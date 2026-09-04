import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { codeRefs } from "./codeRefs";
import ContinuousBatchViz from "./viz/ContinuousBatchViz";
import ResourceGateViz from "./viz/ResourceGateViz";

const FEASIBILITY_TERMS = [
  {
    symbol: "n_{tok}",
    name: "이번 iteration의 scheduled token",
    description: "Prefill chunk와 decode token을 합쳐 이번 model execution에 넣은 token 수입니다.",
  },
  {
    symbol: "B_{tok}",
    name: "Token budget",
    description: "한 scheduling iteration에 허용한 최대 batched token 수입니다.",
  },
  {
    symbol: "n_{seq}",
    name: "진행할 sequence 수",
    description: "이번 iteration에서 token을 하나 이상 처리하는 active sequence 수입니다.",
  },
  {
    symbol: "B_{seq}",
    name: "Sequence cap",
    description: "동시에 batch에 포함하도록 허용한 sequence 수의 상한입니다.",
  },
  {
    symbol: "M_{KV}^{need}",
    name: "추가 KV block 수요",
    description: "선택한 token을 처리하고 state를 보존하는 데 새로 필요한 KV memory입니다.",
  },
  {
    symbol: "M_{KV}^{free}",
    name: "사용 가능한 KV pool",
    description: "현재 free block과 회수 가능한 block을 allocator 계약에 맞춰 센 memory입니다.",
  },
] as const;

export default function EngineLoop({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="engine-loop" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Continuous batching은 요청 batch가 아니라 GPU iteration을 다시 구성합니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Static batching은 함께 시작한 요청 묶음이 모두 끝날 때까지 같은 batch를 유지합니다. 먼저 끝난 sequence 자리는 가장 긴 요청이 끝날 때까지 비게 됩니다.
          Continuous batching은 model forward가 끝날 때마다 완료 요청을 빼고 waiting 요청이나 남은 prefill chunk를 넣습니다. 서로 다른
          output 길이가 섞여도 GPU iteration의 빈 자리를 줄일 수 있습니다.
        </p>
        <p className="leading-8">
          다만 이름 때문에 “항상 최대 batch를 유지한다”고 이해하면 안 됩니다. Scheduler는 token budget·sequence cap·KV block이라는 서로 다른
          제약을 모두 만족해야 합니다. 긴 prefill 하나가 decode latency를 밀어내지 않도록 priority와 chunk 크기까지 결정합니다.
        </p>
        <p className="leading-8">
          요청이 끝날 때까지 batch를 고정하지 않고 model iteration마다 다시 조립한다는 아이디어는 vLLM이 처음 제안한 것이 아닙니다. 역사적 경계를 여기서 먼저 분리해
          두어야 합니다. 아래의 Orca는 vLLM 내부 모듈명이 아니라, 이 scheduling 문제를 먼저 정식화한 별도의 선행 serving system입니다.
        </p>
      </div>

      <ContinuousBatchViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="paper-orca" className="scroll-mt-20">
          Orca는 vLLM의 구성 요소가 아니라 선행 serving system입니다
        </h3>
        <p className="leading-8">
          <a href="https://www.usenix.org/conference/osdi22/presentation/yu">
            Orca: A Distributed Serving System for Transformer-Based Generative Models
          </a>
          는 2022년에 생성 요청 전체가 끝날 때까지 batch를 고정하지 않고, 한
          model iteration이 끝날 때마다 batch를 다시 구성하는
          <em> iteration-level scheduling</em>을 제안했습니다. 먼저 끝난 요청은
          바로 빠지고 새 요청은 다음 iteration에 들어갈 수 있으므로, 위 그림의
          A·B·C 교체가 가능해집니다. 오늘날 흔히 continuous batching이라고 부르는
          실행 형태를 이해할 때 Orca가 등장하는 이유가 이것입니다.
        </p>
        <ProgressiveDetail
          title="Orca의 selective batching과 현재 vLLM 구현은 무엇이 다른가요?"
          preview="두 system은 iteration마다 batch를 다시 짠다는 문제를 공유하지만, attention 실행과 KV memory 관리는 같은 구현이 아닙니다."
        >
          <p>
            Orca의 <em>selective batching</em>은 당시 variable-shape attention은
            요청별로 처리하고 dense 연산은 함께 묶는 구체적인 구현 선택이었습니다.
            이 선택을 현재 vLLM backend의 구조로 옮겨 읽으면 안 됩니다. vLLM은
            자체 attention kernel과 KV block manager를 사용합니다.
          </p>
          <p>
            계보는 두 단계로 읽는 편이 정확합니다. Orca가 먼저 연 것은 “언제 batch를 다시 짤 것인가”입니다. vLLM의 원 논문이 새로 밀어낸 핵심 병목은 “그 batch의
            동적인 KV state를 어떻게 낭비 없이 보관할 것인가”입니다.
          </p>
        </ProgressiveDetail>
        <h3 id="resource-feasibility" className="scroll-mt-20">
          한 iteration은 세 예산의 교집합 안에서만 실행할 수 있습니다
        </h3>
      </div>

      <ResourceGateViz />

      <ExplainedFormula
        question="Scheduler가 고른 요청 집합이 실제로 한 GPU iteration에 들어갈 수 있는 조건은 무엇일까요?"
        idea={
          <>
            계산할 token 수, 동시에 진행할 sequence 수, 새 state를 남길 KV
            memory를 각각 상한과 비교합니다. 세 조건 가운데 하나라도 실패하면
            waiting을 유지하거나 chunk를 줄이고, 경우에 따라 running request를
            preempt해야 합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
n_{tok} &\le B_{tok} \\
n_{seq} &\le B_{seq} \\
M_{KV}^{need} &\le M_{KV}^{free}
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
n_{tok} &\le \underbrace{B_{tok}}_{\text{오른쪽 항으로 결과 계산}} \\
n_{seq} &\le \underbrace{B_{seq}}_{\text{오른쪽 항으로 결과 계산}} \\
M_{KV}^{need} &\le \underbrace{M_{KV}^{free}}_{\text{오른쪽 항으로 결과 계산}}
\end{aligned}`}
        operations={[
          { expression: String.raw`B_{tok}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","계산할 token 수, 동시에 진행할 sequence 수, 새","state를 남길 KV memory를 각각 상한과 비교합니다."] },
          { expression: String.raw`B_{seq}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","계산할 token 수, 동시에 진행할 sequence 수, 새","state를 남길 KV memory를 각각 상한과 비교합니다."] },
          { expression: String.raw`M_{KV}^{free}`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","계산할 token 수, 동시에 진행할 sequence 수, 새","state를 남길 KV memory를 각각 상한과 비교합니다."] },
        ]}
        terms={FEASIBILITY_TERMS}
        assumptions={[
          "B_tok와 B_seq는 해당 vLLM version의 effective SchedulerConfig 값입니다.",
          "KV 수요는 block rounding·prefix hit·local/global layer·speculative branch까지 runtime allocator 기준으로 계산합니다.",
          "세 부등식은 실행 가능성만 나타내며 TTFT·ITL·throughput이 좋은지는 별도 load test로 판단합니다.",
        ]}
        interpretation="max_num_batched_tokens나 max_num_seqs 하나만 크게 올려도 다른 두 제약이 그대로라면 처리량이 늘지 않습니다. 오히려 긴 prefill이 decode를 오래 기다리게 하거나 KV pressure로 preemption이 늘 수 있습니다."
        title="Iteration-level scheduling의 hard feasibility"
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef(
            "schedule-resource-feasibility",
            codeRefs["schedule-resource-feasibility"],
          )
        }
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="paper-vllm" className="scroll-mt-20">
          vLLM은 scheduling 계보 위에서 KV memory 병목을 새로 해결했습니다
        </h3>
        <p className="leading-8">
          <a href="https://arxiv.org/abs/2309.06180">
            Efficient Memory Management for Large Language Model Serving with PagedAttention
          </a>
          은 요청마다 최대 길이의 연속 KV memory를 미리 잡을 때 생기는 내부·외부
          fragmentation과 중복 저장을 문제로 삼았습니다. OS virtual memory처럼
          logical KV block을 non-contiguous physical block에 mapping하면 필요한
          만큼 allocation하고 prefix·beam 사이에서 block을 공유할 수 있습니다.
          이 memory manager가 continuous batching이 더 많은 sequence를 유지할
          여지를 만들었다는 것이 system-level 핵심입니다.
        </p>
        <p className="leading-8">
          논문의 throughput 수치는 당시 model·GPU·workload·vLLM 구현에서 나온
          결과이며 현재 배포의 보장값이 아닙니다. Block table과 reference count의
          상세 실행은 <Link to="/ai/vllm-paged-attention">PagedAttention 글</Link>,
          token budget과 preemption 순서는
          <Link to="/ai/vllm-scheduler">Scheduler 글</Link>에서 중복 없이
          이어집니다.
        </p>
      </div>
    </section>
  );
}
