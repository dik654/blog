import ExplainedFormula from "@/components/ui/explained-formula";
import Math from "@/components/ui/math";
import ProposalMethodsViz from "./viz/ProposalMethodsViz";
import ServingBreakEvenViz from "./viz/ServingBreakEvenViz";

const SPEEDUP_TERMS = [
  {
    symbol: "t_T(1)",
    name: "Target-only token time",
    description: "같은 workload에서 target이 token 하나를 확정하는 기준 시간입니다.",
  },
  {
    symbol: "t_D(K)",
    name: "Proposal time",
    description: "Depth K의 draft 후보를 만드는 데 든 시간입니다.",
  },
  {
    symbol: "t_V(K)",
    name: "Verification time",
    description: "Target이 K개 후보 위치와 bonus/correction 경로를 평가한 시간입니다.",
  },
  {
    symbol: "t_R(K)",
    name: "Runtime overhead",
    description: "Scheduling·sampling·cache commit·CPU/GPU synchronization 비용입니다.",
  },
  {
    symbol: String.raw`\mathbb{E}[Y_K]`,
    name: "평균 committed length",
    description: "Depth K에서 target verify 한 cycle이 실제 확정한 token 수입니다.",
  },
] as const;

export default function EagleMtp() {
  return (
    <section id="eagle-mtp" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        EAGLE·native MTP·draft model은 같은 검증기에 서로 다른 proposer를 붙입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          모든 방법은 target verify와 acceptance라는 같은 골격을 사용하지만 후보를
          만드는 정보와 비용이 다릅니다. 별도 draft model은 token distribution을
          직접 예측하고, EAGLE 계열은 target의 feature를 활용해 불확실성을 줄이며,
          native MTP는 학습할 때부터 붙어 있던 future-token module을 proposer로
          사용합니다. N-gram·suffix 방식은 model 없이 이미 등장한 문자열 반복을
          이용합니다.
        </p>
      </div>

      <ProposalMethodsViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="paper-eagle" className="scroll-mt-20">
          EAGLE의 핵심 아이디어: token보다 feature를 먼저 예측합니다
        </h3>
        <p className="leading-8">
          <a href="https://arxiv.org/abs/2401.15077">
            EAGLE: Speculative Sampling Requires Rethinking Feature Uncertainty
          </a>
          은 다음 token 자체보다 target model의 feature sequence를 autoregressive하게
          예측하고, 원래 token sequence도 조건으로 제공하는 feature-level drafter를
          제안했습니다. Feature에는 다음 token 외의 문맥 정보가 들어 있지만 token이
          정해져도 feature가 하나로 결정되지는 않으므로, 논문은 이 uncertainty를
          줄이는 조건 설계를 함께 다룹니다. 결과적으로 target에 가까운 proposal을
          더 작은 계산으로 만들려는 접근이며, 모든 target에 checkpoint 없이 바로
          붙일 수 있다는 뜻은 아닙니다.
        </p>

        <h3 id="paper-mtp" className="scroll-mt-20">
          MTP 원 논문의 핵심 아이디어: 한 위치에서 여러 미래 token을 함께 학습합니다
        </h3>
        <p className="leading-8">
          <a href="https://arxiv.org/abs/2404.19737">
            Better &amp; Faster Large Language Models via Multi-token Prediction
          </a>
          은 shared model trunk 위에 여러 output head를 두고, 각 위치에서 다음
          token 하나뿐 아니라 더 먼 미래 token까지 함께 예측하도록 학습했습니다.
          원 논문의 주장은 auxiliary training objective가 representation과 sample
          efficiency에 줄 수 있는 효과, 그리고 학습된 미래 예측을 inference에
          활용할 가능성을 해당 model scale·task에서 평가한 것입니다. 모든 native
          MTP model이 같은 head 구조나 같은 inference speedup을 가진다는 뜻은
          아닙니다.
        </p>
        <h4 id="native-mtp" className="scroll-mt-20">
          Native MTP weight를 serving proposer로 사용하는 단계
        </h4>
        <p className="leading-8">
          Serving에서는 model에 포함된 future-token module이 만든 후보를 target의
          speculative verifier에 넣을 수 있습니다.
          그러나 MTP head가 있다는 사실만으로 여러 token이 자동 확정되지는
          않습니다. Runtime이 해당 architecture의 module을 읽고 draft tree 또는
          chain을 만들며, target acceptance와 cache commit까지 구현해야 합니다.
        </p>
        <p className="leading-8">
          또 target과 proposer의 작은 수치 차이가 먼 후보까지 누적되므로 activation
          quantization이나 custom kernel 변경 뒤에는 acceptance length가 크게
          달라질 수 있습니다. 양자화는 한 target 실행에서 읽는 byte를 줄이고 MTP는
          그 실행을 여러 token이 나눠 쓰게 하므로 함께 이득을 낼 수 있지만,
          numerical drift가 acceptance를 낮추면 두 효과가 서로 상쇄될 수도 있습니다.
          GLM-5.2와 B300에서 이 문제를 어떻게 측정하고 runtime 병목을 제거했는지는
          <a href="/ai/sionic-glm-b300#mtp">GLM/B300 MTP 적용 사례</a>에서 구체적인
          수치와 함께 다룹니다.
        </p>

        <h3 id="paper-specinfer" className="scroll-mt-20">
          SpecInfer의 핵심 아이디어: 한 줄이 아니라 후보 tree를 한 번에 검증합니다
        </h3>
        <p className="leading-8">
          <a href="https://arxiv.org/abs/2305.09781">SpecInfer</a>는 여러 small
          speculative model이 만든 후보를 tree로 구성하고, 큰 model이 tree-based
          attention으로 함께 검증하는 serving system을 제안했습니다. Chain 하나의
          depth만 늘리는 대신 후보 폭도 활용해 target과 일치할 경로를 늘리는
          접근입니다. 다만 tree가 넓어질수록 temporary KV·verification compute와
          scheduling 복잡도도 늘어나므로, 논문의 workload와 system 조건 밖에서
          동일한 속도 향상을 가정하면 안 됩니다.
        </p>
      </div>

      <div id="serving-break-even" className="scroll-mt-20">
        <ServingBreakEvenViz />
      </div>

      <ExplainedFormula
        question="Speculative decoding이 target-only보다 빨라지는 최소 조건은 무엇일까요?"
        idea={
          <>
            한 cycle에서 확정한 token을 target-only로 만들었을 기준 시간과,
            proposal·verification·runtime을 모두 포함한 실제 cycle 시간을 비교합니다.
            Acceptance만 높고 proposer가 느리면 이 부등식을 통과하지 못합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
t_C(K)&=t_D(K)+t_V(K)+t_R(K) \\
S(K)&\approx\frac{\mathbb{E}[Y_K],t_T(1)}{t_C(K)} \\
\text{benefit}&\Longleftrightarrow
\mathbb{E}[Y_K],t_T(1)>t_C(K)
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\underbrace{t_C(K)}_{\text{확률 가중 평균}}&=\underbrace{t_D(K)+t_V(K)+t_R(K)}_{\text{오른쪽 항으로 결과 계산}} \\
S(K)&\approx\frac{\mathbb{E}[Y_K],t_T(1)}{t_C(K)} \\
\text{benefit}&\Longleftrightarrow
\mathbb{E}[Y_K],t_T(1)>t_C(K)
\end{aligned}`}
        operations={[
          { expression: String.raw`t_D(K)+t_V(K)+t_R(K)`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","한 cycle에서 확정한 token을 target-only로","만들었을 기준 시간과,","proposal·verification·runtime을 모두"] },
          { expression: String.raw`t_C(K)`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","한 cycle에서 확정한 token을 target-only로","만들었을 기준 시간과,","proposal·verification·runtime을 모두"] },
        ]}
        terms={SPEEDUP_TERMS}
        assumptions={[
          "같은 prompt/output distribution·sampler·quality contract에서 target-only와 비교합니다.",
          "시간은 같은 QPS·batching·parallelism·precision·hardware 조건의 end-to-end 측정값입니다.",
          "이 근사는 queueing과 tail latency를 평균 한 식으로 압축하므로 p95 SLA는 별도로 판단합니다.",
        ]}
        interpretation="S>1인 구간만 이득입니다. 낮은 QPS에서는 t_T(1)이 커서 유리할 수 있지만, 높은 QPS에서 continuous batching이 target weight를 이미 재사용하면 기준 t_T(1)이 작아지고 proposer가 GPU 자원을 빼앗아 S가 1 아래로 내려갈 수 있습니다."
        title="Speculative serving의 손익분기식"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="dynamic-policy" className="scroll-mt-20">
          Static K 하나가 아니라 workload별 정책을 검증합니다
        </h3>
        <p className="leading-8">
          최적 depth는 prompt·출력 종류·sampling temperature·동시성에 따라
          달라집니다. 코드처럼 다음 token이 비교적 예측 가능한 구간과 높은
          temperature의 창작 문장은 같은 K를 쓰더라도 acceptance tail이 다릅니다.
          vLLM의 dynamic speculative decoding처럼 runtime이 관측 신호에 따라
          speculation을 줄이거나 끌 수 있지만, 정책의 입력·선택 이유·실제 결과를
          trace에 남겨야 회귀를 찾을 수 있습니다.
        </p>
        <p className="leading-8">
          최소 benchmark ledger에는 target/draft artifact와 revision, K와 dynamic
          policy, prompt/output length·QPS·sampler 분포, <Math>{String.raw`\bar A`}</Math>와
          <Math>{String.raw`\bar Y`}</Math>의 정의, draft/verify/runtime 시간, TTFT·ITL·E2E
          latency, KV 사용량·preemption, target-only 대비 품질 검사가 들어가야
          합니다. Batch-1 tokens/s 한 숫자로 production throughput을 결론 내리지
          않는 이유가 여기에 있습니다.
        </p>
      </div>
    </section>
  );
}
