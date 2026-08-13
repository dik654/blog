import ExplainedFormula from "@/components/ui/explained-formula";
import Math from "@/components/ui/math";
import AcceptanceTraceViz from "./viz/AcceptanceTraceViz";

const REJECTION_TERMS = [
  {
    symbol: "p(x)",
    name: "Target probability",
    description: "현재 prefix에서 target model이 token x에 준 확률입니다.",
  },
  {
    symbol: "q(x)",
    name: "Draft probability",
    description: "같은 prefix에서 proposer가 token x에 준 확률입니다.",
  },
  {
    symbol: "a(x)",
    name: "Acceptance probability",
    description: "Draft가 제안한 x를 그대로 확정할 조건부 확률입니다.",
  },
  {
    symbol: "r(x)",
    name: "Correction distribution",
    description: "Draft가 거부됐을 때 target의 남은 확률 질량에서 다시 뽑는 분포입니다.",
  },
] as const;

const PREFIX_TERMS = [
  {
    symbol: "I_i",
    name: "Prefix acceptance indicator",
    description: "첫 i개 draft가 모두 수락되면 1, 하나라도 거부되면 0입니다.",
  },
  {
    symbol: "R_j",
    name: "위치별 acceptance indicator",
    description: "j번째 draft가 해당 prefix에서 수락되면 1, 거부되면 0입니다.",
  },
  {
    symbol: "A",
    name: "수락 prefix 길이",
    description: "첫 거부 전까지 연속으로 수락된 draft token 수입니다.",
  },
  {
    symbol: "K",
    name: "Speculation depth",
    description: "한 cycle에 제안한 draft token의 최대 수입니다.",
  },
] as const;

export default function DraftVerify() {
  return (
    <section id="draft-verify" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Verify의 목적은 후보 채점이 아니라 target 분포 보존입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Greedy decoding은 비교적 단순합니다. 각 위치에서 draft token이 target의
          argmax와 같은 동안 수락하고, 처음 달라지는 위치에서 target token으로
          이어 가면 됩니다. Sampling에서는 target이 두 번째·세 번째 후보도 일정
          확률로 선택해야 하므로 “draft와 target의 top-1이 같으면 수락”하는
          규칙만으로는 원래 분포가 바뀝니다.
        </p>
        <p className="leading-8">
          Speculative sampling은 draft가 target보다 적게 준 확률 질량은 그대로
          활용하고, draft가 과하게 준 부분은 확률적으로 거부합니다. 거부된 경우에는
          target에 남아 있는 확률 질량에서 correction token을 뽑습니다. 이 두 경로를
          합치면 최종 token의 확률이 다시 <Math>{"p(x)"}</Math>가 됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="Draft token을 재사용하면서도 target sampling 분포를 정확히 유지할 수 있을까요?"
        idea={
          <>
            Draft가 token x를 낼 확률 <Math>{"q(x)"}</Math>에 acceptance
            probability를 곱하면 두 모델이 공통으로 가진 확률 질량
            <Math>{String.raw`\min(p(x),q(x))`}</Math>만 먼저 사용합니다. 거부됐을 때는
            target에만 남은 질량 <Math>{"(p(x)-q(x))_+"}</Math>에서 보충합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
a(x)&=\min\!\left(1,\frac{p(x)}{q(x)}\right) \\
r(x)&=\frac{(p(x)-q(x))_+}{\sum_z (p(z)-q(z))_+} \\
m_{\mathrm{accept}}(x)&=\min(p(x),q(x)) \\
m_{\mathrm{correct}}(x)&=(p(x)-q(x))_+ \\
m_{\mathrm{out}}(x)&=m_{\mathrm{accept}}(x)+m_{\mathrm{correct}}(x) \\
&=p(x)
\end{aligned}`}
        terms={REJECTION_TERMS}
        assumptions={[
          "p와 q는 같은 vocabulary와 같은 이미 확정된 prefix를 조건으로 한 normalized distribution입니다.",
          "q(x)=0인 token은 draft가 제안하지 않으므로 acceptance ratio를 직접 계산할 사건이 없습니다.",
          "거부 시 correction은 normalized positive residual에서 sampling하며 runtime의 numerical implementation이 이 계약을 지켜야 합니다.",
        ]}
        interpretation="이 등식이 speculative sampling의 정확성 핵심입니다. 단순히 draft token을 항상 수락하거나 거부 뒤 target 전체 분포에서 다시 뽑으면 두 항이 p(x)로 합쳐지지 않아 출력 분포가 달라집니다."
        title="Rejection sampling으로 target probability 복원하기"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3 id="paper-speculative-decoding" className="scroll-mt-20">
          원 논문의 핵심 아이디어: 작은 모델의 계산을 결과가 아니라 제안으로 사용합니다
        </h3>
        <p className="leading-8">
          <a href="https://arxiv.org/abs/2211.17192">
            Fast Inference from Transformers via Speculative Decoding
          </a>
          은 작은 approximation model의 출력을 그대로 정답으로 쓰지 않고, 큰
          target model이 병렬로 검증할 proposal로 사용했습니다. 위 acceptance와
          correction 규칙이 있으므로 논문의 전제 안에서는 target-only sampling과
          같은 분포를 유지하면서 target의 serial step 수를 줄일 수 있습니다.
          “작은 모델이 품질을 대신한다”가 아니라 “작은 모델은 계산 경로만 제안하고
          품질 계약은 target이 계속 소유한다”는 것이 핵심입니다.
        </p>
      </div>

      <AcceptanceTraceViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>첫 거부 이후의 후보는 왜 확정 대상에서 제외할까요?</h3>
        <p className="leading-8">
          Draft의 네 번째 후보는 앞선 세 번째 draft token이 이미 prefix에 들어갔다고
          가정해 만든 conditional sample입니다. 그런데 세 번째 위치가 거부되어
          correction token으로 바뀌면 네 번째 후보는 더 이상 현재 prefix에서 만든
          값이 아닙니다. 그래서 첫 거부 뒤의 suffix를 그대로 이어 쓰면 target
          distribution 보장도 깨집니다. Runtime은 거부 지점까지 sequence length와
          KV state를 확정하고, 바뀐 prefix에서 다음 cycle을 시작해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="뒤쪽 후보의 수락률이 낮을 때 평균 acceptance length를 어떻게 해석할까요?"
        idea={
          <>
            i번째 draft가 개별적으로 맞았는지만 세면 안 됩니다. i번째까지
            확정하려면 앞의 모든 draft도 함께 수락되어야 하므로, 수락 길이는
            연속 prefix 사건의 indicator를 더해 계산합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
R_j &\in \{0,1\} \\
I_i &= \prod_{j=1}^{i}R_j \\
A &= \sum_{i=1}^{K} I_i \\
\mathbb{E}[A] &= \sum_{i=1}^{K}\Pr(A\ge i)
\end{aligned}`}
        terms={PREFIX_TERMS}
        assumptions={[
          "수락은 왼쪽부터 확인하며 첫 거부에서 draft prefix가 끝납니다.",
          "위 식은 각 위치의 acceptance가 서로 독립이라고 가정하지 않습니다.",
          "Correction 또는 bonus token은 A에 포함하지 않고 committed length Y에서 따로 셉니다.",
        ]}
        interpretation="앞쪽 수락률이 높아도 먼 위치까지 모두 수락할 확률이 빠르게 줄 수 있습니다. 따라서 K를 두 배로 늘린 결과는 개별 token acceptance rate가 아니라 tail probability와 실제 E[A]로 확인해야 합니다."
        title="연속 prefix의 acceptance length"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Lossless는 bitwise 동일하다는 뜻이 아닙니다</h3>
        <p className="leading-8">
          논문에서 말하는 lossless는 위 알고리즘과 확률 계산의 전제 아래
          <strong>최종 생성 분포가 target distribution과 같다</strong>는 뜻입니다.
          Floating-point 연산 순서, kernel, tensor parallel reduction, batch
          invariance, structured-output mask까지 매 run의 token이 bitwise 같다는
          뜻은 아닙니다. 같은 seed 재현성만 확인할 것이 아니라 여러 prompt와 seed의
          task quality·token frequency·failure rate가 target-only 기준에서 벗어나지
          않는지도 봐야 합니다.
        </p>

        <h3>Scheduler·KV cache·sampler가 같은 acceptance 결과를 공유해야 합니다</h3>
        <p className="leading-8">
          Target은 후보 여러 위치를 한 step에 처리할 token budget과 임시 KV slot을
          사용합니다. 첫 거부가 정해지면 scheduler의 sequence length, model
          runner의 cache commit 지점, sampler의 correction 결과가 모두 같은
          prefix를 가리켜야 합니다. 이 가운데 하나라도 suffix를 확정된 state로
          남기면 다음 cycle의 조건이 어긋납니다. Speculative decoding은 proposer
          하나를 추가하는 기능이 아니라 이 세 계층의 commit protocol입니다.
        </p>
      </div>
    </section>
  );
}
