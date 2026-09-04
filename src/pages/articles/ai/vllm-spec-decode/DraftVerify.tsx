import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
import Math from "@/components/ui/math";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import AcceptanceTraceViz from "./viz/AcceptanceTraceViz";
import RejectionResampleViz from "./viz/RejectionResampleViz";

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

export default function DraftVerify({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="draft-verify" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Verify의 목적은 후보 채점이 아니라 target 분포 보존입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Greedy decoding은 비교적 단순합니다. 각 위치에서 draft token이 target의 argmax와 같은 동안 수락하고 처음 달라지는 위치에서 target
          token으로 이어 가면 됩니다. Sampling에서는 target이 두 번째·세 번째 후보도 일정 확률로 선택해야 하므로 “draft와 target의 top-1이 같으면
          수락”하는 규칙만으로는 원래 분포가 바뀝니다.
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
        annotatedFormula={String.raw`\begin{aligned}
a(x)&=\underbrace{\min\!\left(1,\frac{p(x)}{q(x)}\right)}_{\text{기준량당 비율}} \\
r(x)&=\underbrace{\frac{(p(x)-q(x))_+}{\sum_z (p(z)-q(z))_+}}_{\text{기준량당 비율}} \\
m_{\mathrm{accept}}(x)&=\underbrace{\min(p(x),q(x))}_{\text{경계 후보 선택}} \\
m_{\mathrm{correct}}(x)&=(p(x)-q(x))_+ \\
m_{\mathrm{out}}(x)&=m_{\mathrm{accept}}(x)+m_{\mathrm{correct}}(x) \\
&=p(x)
\end{aligned}`}
        operations={[
          { expression: String.raw`\min\!\left(1,\frac{p(x)}{q(x)}\right)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Draft가 token x를 낼 확률 q(x) 에","acceptance probability를 곱하면 두 모델이","공통으로 가진 확률 질량 min(p(x),q(x)) 만 먼저"] },
          { expression: String.raw`\frac{(p(x)-q(x))_+}{\sum_z (p(z)-q(z))_+}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Draft가 token x를 낼 확률 q(x) 에","acceptance probability를 곱하면 두 모델이","공통으로 가진 확률 질량 min(p(x),q(x)) 만 먼저"] },
          { expression: String.raw`\min(p(x),q(x))`, annotation: ["허용 후보 중 목적에 맞는 경계값을 선택합니다.","Draft가 token x를 낼 확률 q(x) 에","acceptance probability를 곱하면 두 모델이","공통으로 가진 확률 질량 min(p(x),q(x)) 만 먼저"] },
        ]}
        terms={REJECTION_TERMS}
        assumptions={[
          "p와 q는 같은 vocabulary와 같은 이미 확정된 prefix를 조건으로 한 normalized distribution입니다.",
          "q(x)=0인 token은 draft가 제안하지 않으므로 acceptance ratio를 직접 계산할 사건이 없습니다.",
          "거부 시 correction은 normalized positive residual에서 sampling하며 runtime의 numerical implementation이 이 계약을 지켜야 합니다.",
        ]}
        interpretation="이 등식이 speculative sampling의 정확성 핵심입니다. 단순히 draft token을 항상 수락하거나 거부 뒤 target 전체 분포에서 다시 뽑으면 두 항이 p(x)로 합쳐지지 않아 출력 분포가 달라집니다."
        title="Rejection sampling으로 target probability 복원하기"
      />
      <CodeViewButton
        onClick={() => onCodeRef("rejection-test", codeRefs["rejection-test"])}
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
          target model이 병렬로 검증할 proposal로 사용했습니다.
        </p>
        <p className="leading-8">
          위 acceptance와 correction 규칙이 있으므로 논문의 전제 안에서는 target-only sampling과 같은 분포를 유지하면서 target의 serial step
          수를 줄일 수 있습니다. “작은 모델이 품질을 대신한다”가 아닙니다. “작은 모델은 계산 경로만 제안하고 품질 계약은 target이 계속 소유한다”가 핵심입니다.
        </p>

        <h3 id="verification-pass" className="scroll-mt-20">
          Verification pass는 K+1개 분포를 한 번의 forward로 얻습니다
        </h3>
        <p className="leading-8">
          Draft가 K개 후보를 만들면 target은 확정 prefix 뒤에 그 K개를 이어 붙여 한 번만 실행합니다. Causal attention 덕분에 마지막 K+1개 위치의 출력은
          각각 prefix, prefix+t₁, …, prefix+t₁..t_K를 조건으로 한 next-token 분포가 됩니다. 그래서 수락 판정에 필요한 p를 위치마다 따로 실행하지
          않아도 됩니다.
        </p>
        <p className="leading-8">
          이 한 번의 forward가 verification pass이고, 그 비용이 token 하나짜리
          target step과 비슷하다는 것이 Chen et al. 2023의 관찰입니다. 낮은
          batch에서는 linear layer가 weight read에 묶여 있어 한 token을 넣든
          다섯 token을 넣든 읽는 byte가 같기 때문입니다. 이 가정이 언제 깨지는지는
          <Link to="/ai/vllm-spec-decode#not-always-faster">비용 모델 절</Link>에서
          다룹니다.
        </p>

        <h3 id="rejection-point" className="scroll-mt-20">
          Rejection point에서는 residual로 다시 뽑고 그 뒤 후보는 버립니다
        </h3>
        <p className="leading-8">
          Verification pass가 끝나면 위치 1부터 차례로 uniform 난수 r_i를 뽑아 r_i ≤ p_i/q_i 인지 봅니다. 처음 실패한 위치 n이 rejection
          point입니다. 그 앞의 n−1개 draft는 그대로 확정합니다. 위치 n의 token은 target에만 남은 질량 (p−q)₊를 정규화한 분포에서 다시 뽑습니다.
        </p>
        <p className="leading-8">
          거부가 한 번도 없으면 K+1번째 분포 <Math>{String.raw`p_{K+1}`}</Math>에서 bonus token 하나를
          뽑습니다. 이 분포는 prefix+t₁..t_K를 조건으로 이미 계산돼 있으므로
          추가 실행이 없습니다. 어느 경우든 한 cycle은 정확히 하나의 target
          sampling(correction 또는 bonus)으로 끝나고, 확정 길이 Y는 1 이상
          K+1 이하가 됩니다.
        </p>
      </div>

      <AlgorithmBlock
        title="한 speculative cycle: draft K개 → verify 1 pass → rejection point → resample → commit"
        input={[
          "prefix: 확정된 token 열, target p(·|·), draft q(·|·), speculation length K",
        ]}
        steps={[
          { code: "for i in 1..K: q_i = q(· | prefix + t_1..t_{i-1}); t_i ~ q_i", note: "Draft를 K번 직렬 실행합니다. 비용 Kc." },
          { code: "p_1..p_{K+1} = target(prefix + t_1..t_K)", note: "Verification pass 한 번. 위치 i의 p_i는 prefix+t_1..t_{i-1}를 조건으로 한 분포입니다." },
          { code: "n = K + 1", note: "거부가 없으면 n은 K+1로 남아 bonus 경로로 갑니다." },
          { code: "for i in 1..K: r_i ~ U(0,1); if r_i > p_i(t_i) / q_i(t_i): n = i; break", note: "왼쪽부터 첫 실패 위치가 rejection point입니다." },
          { code: "accepted = t_1..t_{n-1}", note: "A = n−1. 첫 거부 뒤의 t_n..t_K는 버립니다." },
          { code: "if n <= K: x ~ normalize(max(0, p_n − q_n)) else: x ~ p_{K+1}", note: "Correction은 residual에서, bonus는 K+1번째 target 분포에서 뽑습니다." },
          { code: "prefix = prefix + accepted + [x]; commit KV up to len(prefix)", note: "Y = n. Scheduler·KV cache·sampler가 같은 길이를 봐야 합니다." },
        ]}
        output="prefix에 1..K+1개 token이 추가되고 다음 cycle이 새 prefix에서 시작합니다"
        repeatUntil="EOS 또는 max_tokens에 도달할 때까지 반복"
      />

      <RejectionResampleViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
      </div>

      <AcceptanceTraceViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>첫 거부 이후의 후보는 왜 확정 대상에서 제외할까요?</h3>
        <p className="leading-8">
          Draft의 네 번째 후보는 앞선 세 번째 draft token이 이미 prefix에 들어갔다고
          가정해 만든 conditional sample입니다. 그런데 세 번째 위치가 거부되어
          correction token으로 바뀌면 네 번째 후보는 더 이상 현재 prefix에서 만든 값이 아닙니다.
        </p>
        <p className="leading-8">
          첫 거부 뒤의 suffix를 그대로 이어 쓰면 target distribution 보장도 깨집니다. Runtime은 거부 지점까지 sequence length와 KV state를
          확정하고 바뀐 prefix에서 다음 cycle을 시작해야 합니다.
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
        annotatedFormula={String.raw`\begin{aligned}
R_j &\in \{0,1\} \\
I_i &= \underbrace{\prod_{j=1}^{i}R_j}_{\text{오른쪽 항으로 결과 계산}} \\
A &= \underbrace{\sum_{i=1}^{K} I_i}_{\text{오른쪽 항으로 결과 계산}} \\
\mathbb{E}[A] &= \underbrace{\sum_{i=1}^{K}\Pr(A\ge i)}_{\text{확률 가중 평균}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\prod_{j=1}^{i}R_j`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","i번째 draft가 개별적으로 맞았는지만 세면 안 됩니다."] },
          { expression: String.raw`\sum_{i=1}^{K} I_i`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","i번째 draft가 개별적으로 맞았는지만 세면 안 됩니다."] },
          { expression: String.raw`\sum_{i=1}^{K}\Pr(A\ge i)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","i번째 draft가 개별적으로 맞았는지만 세면 안 됩니다."] },
        ]}
        terms={PREFIX_TERMS}
        assumptions={[
          "수락은 왼쪽부터 확인하며 첫 거부에서 draft prefix가 끝납니다.",
          "위 식은 각 위치의 acceptance가 서로 독립이라고 가정하지 않습니다.",
          "Correction 또는 bonus token은 A에 포함하지 않고 committed length Y에서 따로 셉니다.",
        ]}
        interpretation="앞쪽 수락률이 높아도 먼 위치까지 모두 수락할 확률이 빠르게 줄 수 있습니다. 따라서 K를 두 배로 늘린 결과는 개별 token acceptance rate가 아니라 tail probability와 실제 E[A]로 확인해야 합니다."
        title="연속 prefix의 acceptance length"
      />
      <CodeViewButton
        onClick={() => onCodeRef("prefix-stop", codeRefs["prefix-stop"])}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Lossless는 bitwise 동일하다는 뜻이 아닙니다</h3>
        <p className="leading-8">
          논문에서 말하는 lossless는 위 알고리즘과 확률 계산의 전제 아래
          <strong>최종 생성 분포가 target distribution과 같다</strong>는 뜻입니다.
          Floating-point 연산 순서, kernel, tensor parallel reduction, batch
          invariance, structured-output mask까지 매 run의 token이 bitwise 같다는
          뜻은 아닙니다.
        </p>
        <p className="leading-8">
          같은 seed 재현성만 확인해서는 부족합니다. 여러 prompt와 seed의 task quality·token frequency·failure rate가 target-only
          기준에서 벗어나지 않는지도 봐야 합니다.
        </p>

        <h3>Scheduler·KV cache·sampler가 같은 acceptance 결과를 공유해야 합니다</h3>
        <p className="leading-8">
          Target은 후보 여러 위치를 한 step에 처리할 token budget과 임시 KV slot을
          사용합니다. 첫 거부가 정해지면 scheduler의 sequence length, model
          runner의 cache commit 지점, sampler의 correction 결과가 모두 같은
          prefix를 가리켜야 합니다.
        </p>
        <p className="leading-8">
          이 가운데 하나라도 suffix를 확정된 state로 남기면 다음 cycle의 조건이 어긋납니다. Speculative decoding의 실체는 이 세 계층의 commit
          protocol입니다. proposer 하나를 추가하는 기능이 아닙니다.
        </p>
      </div>
    </section>
  );
}
