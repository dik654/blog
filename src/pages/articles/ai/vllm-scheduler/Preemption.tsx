import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import PreemptionTraceViz from "./viz/PreemptionTraceViz";

const WASTE_TERMS = [
  {
    symbol: "n_r^{before}",
    name: "Preemption 전 계산량",
    description: "요청 r이 중단되기 직전까지 model forward를 마친 token 수입니다.",
  },
  {
    symbol: "n_r^{hit}",
    name: "재개 시 다시 쓸 수 있는 prefix",
    description:
      "다시 admission될 때 prefix cache 등으로 계산을 생략할 수 있는 token 수입니다. Hit가 없으면 0입니다.",
  },
  {
    symbol: "W_r^{recompute}",
    name: "반복 계산 token",
    description: "이전에 계산했지만 재개 과정에서 다시 prefill해야 하는 token 수입니다.",
  },
  {
    symbol: "C_{preempt}",
    name: "전체 preemption 비용",
    description: "반복 model compute와 queue·scheduler·cache 복구 시간을 합친 비용입니다.",
  },
] as const;

export default function Preemption({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="preemption" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        KV block을 확보하지 못하면 현재 V1은 요청을 WAITING으로 되돌리고 계산을 다시 준비합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Token budget이 남아 있어도 새 token의 K·V state를 저장할 block이 없으면
          model execution을 시작할 수 없습니다. 현재 V1 scheduler의 기본 경로는
          낮은 우선순위의 RUNNING 요청을 고르고, 그 요청의 KV·encoder cache를
          해제한 뒤 상태를 <code>PREEMPTED</code>로 바꾸어 WAITING queue 앞쪽에
          다시 넣습니다. 이 과정에서 <code>num_computed_tokens</code>를 0으로
          재설정하고 speculative 후보도 비웁니다.
        </p>
        <p className="leading-8">
          여기서 preemption은 오류 메시지가 아니라 memory pressure에 대응하는
          정상 state transition입니다. 다만 재개할 때 보존되지 않은 prefix를 다시
          처리하므로 GPU 계산과 사용자 대기 시간이 늘어납니다. 자주 발생한다면
          scheduler가 처리량을 늘리는 대신 같은 일을 반복하고 있다는 신호입니다.
        </p>
      </div>

      <PreemptionTraceViz />

      <ExplainedFormula
        question="Preemption 한 번이 실제로 반복시킨 계산량을 어떻게 추적할까요?"
        idea={
          <>
            중단 전에 계산한 token 가운데 재개 시 prefix cache로 다시 쓸 수 있는
            부분을 빼면 최소 반복 계산량을 얻습니다. 여기에 WAITING queue 체류와
            cache lookup·allocation 시간을 더해야 사용자가 체감한 전체 비용이 됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}
W_r^{recompute} &= \max\!\left(0,\;n_r^{before}-n_r^{hit}\right) \\
C_{preempt} &\approx T_{model}\!\left(W_r^{recompute}\right)
 + t_{requeue}+t_{restore}
\end{aligned}`}
        terms={WASTE_TERMS}
        assumptions={[
          "n_hit은 재개 시 실제 cache lookup 결과이며 preemption 전 cached token 수와 같다고 가정하지 않습니다.",
          "T_model은 반복 token 수에 완전히 선형이지 않을 수 있으므로 trace의 model execution time으로 검증합니다.",
          "한 요청이 여러 번 preempt되면 각 episode의 반복 계산과 queue 시간을 따로 기록한 뒤 합칩니다.",
        ]}
        interpretation="중단 전 8,000 token을 계산했고 재개 시 3,000-token prefix만 hit했다면 최소 5,000 token을 다시 처리합니다. preemption 횟수가 같아도 중단 위치와 prefix hit가 다르면 비용은 크게 달라지므로 counter 하나만으로 비교하면 안 됩니다."
        title="Recomputation waste와 사용자 지연"
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("preempt-request", codeRefs["preempt-request"])
        }
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="paper-fastserve" className="scroll-mt-20">
          FastServe가 보여 준 설계 공간: 무엇을 중단할지와 state를 어디에 둘지는 별개의 선택입니다
        </h3>
        <p className="leading-8">
          <a href="https://arxiv.org/abs/2305.05920">
            Fast Distributed Inference Serving for Large Language Models
          </a>
          는 긴 generation job이 짧은 job을 막는 head-of-line blocking을 문제로
          삼고, output token 경계에서 preemption하는 skip-join MLFQ scheduler를
          제안했습니다. 중단한 state는 GPU와 host memory 사이에서 offload·reload해
          response time을 줄이려 했습니다.
        </p>
        <p className="leading-8">
          이 논문은 <em>preemptive scheduling의 근거</em>이지 현재 vLLM V1이
          FastServe처럼 MLFQ와 host offload를 사용한다는 근거가 아닙니다. 현재 V1의
          기본 recomputation 경로와 비교하면 “어떤 request를 양보시킬지”라는 policy와
          “KV state를 유지·offload·재계산할지”라는 memory mechanism을 분리해서
          평가해야 한다는 점이 선명해집니다.
        </p>

        <h3 id="preemption-diagnosis" className="scroll-mt-20">
          Preemption counter는 출발점이고, 원인은 같은 시간축의 memory·queue·길이에서 찾습니다
        </h3>
        <ol className="leading-8">
          <li>
            <code>num_preemptions</code>가 오른 구간의 KV cache usage와 running·waiting
            request 수를 먼저 맞춥니다.
          </li>
          <li>
            Prompt·output 길이, arrival burst, priority mix가 배포 전 workload와
            달라졌는지 확인합니다.
          </li>
          <li>
            <code>max_num_seqs</code>·<code>max_num_batched_tokens</code>·context 상한과
            speculative lookahead가 KV demand를 과도하게 늘렸는지 봅니다.
          </li>
          <li>
            설정을 바꾼 뒤 raw throughput만 보지 말고 TTFT·ITL tail과
            <Link to="/ai/vllm-serving#serving-goodput"> SLO goodput</Link>을 같은
            workload replay에서 다시 승인합니다.
          </li>
        </ol>
        <p className="leading-8">
          KV capacity 자체는 model의 layer 수·KV head 수·head dimension·cache
          dtype과 runtime allocator가 결정합니다. 이론 byte 계산과 실제
          <code>GPU KV cache size</code>의 차이는
          <Link to="/ai/hybrid-kv-cache-allocation#kv-cache"> hybrid KV allocation
          serving</Link>에서 이어집니다.
        </p>
      </div>
    </section>
  );
}
