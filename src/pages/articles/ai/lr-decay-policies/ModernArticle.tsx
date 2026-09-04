import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { DecayPolicyViz } from "../lr-scheduling/viz/ModernLrScheduleViz";

export default function LrDecayPoliciesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          LR를 낮추는 두 정책은 서로 다른 입력을 읽습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Open-loop decay</strong>는 update clock만 읽습니다.{" "}
            <strong>Metric-triggered decay</strong>는 validation event와 누적
            state를 읽습니다. 결과가 LR 감소라는 이유로 같은 policy로 취급하면
            resume와 재현이 깨집니다.
          </p>
        </div>
        <TermBreakdown
          title="Decay를 결정하는 입력을 한 줄씩 구분"
          items={[
            {
              term: "Milestone",
              description: "LR를 계단식으로 낮출 update index입니다.",
              example: "K=100이면 t=100·200에서 factor를 적용합니다.",
              boundary: "Epoch 번호인지 optimizer update인지 명시합니다.",
            },
            {
              term: "Decay factor γ",
              description: "현재 또는 base LR에 곱하는 0–1 비율입니다.",
              example: "γ=.5면 .1→.05입니다.",
              boundary:
                "호출 횟수가 다르면 같은 γ도 전혀 다른 final LR를 만듭니다.",
            },
            {
              term: "Validation metric",
              description: "Plateau policy가 관찰하는 held-out score입니다.",
              example: "Min-mode validation NLL을 평가 1회마다 전달합니다.",
              boundary:
                "Training loss나 final test를 trigger로 재사용하지 않습니다.",
            },
            {
              term: "Patience state",
              description:
                "Meaningful improvement가 없던 evaluation 횟수입니다.",
              example: "Bad-count가 patience를 넘으면 decay합니다.",
              boundary: "Early stopping counter와 별도 owner·순서를 가집니다.",
            },
          ]}
        />
        <DecayPolicyViz />
        <ContentBoundary article="lr-decay-policies" />
      </section>

      <section id="open-loop" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Step과 exponential은 validation 없이 clock으로 결정됩니다
        </h2>
        <ExplainedFormula
          question="η₀=.1, γ=.5, K=100이면 t=250의 Step LR가 왜 .025인가요?"
          idea={
            <p>
              현재 update가 milestone 구간을 몇 번 지났는지 floor로 센 다음 그 횟수만큼 γ를 곱합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}j_t&=\lfloor t/K\rfloor\\\eta_t^{\rm step}&=\eta_0\gamma^{j_t}\\\eta_t^{\rm exp}&=\eta_0\gamma^t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}j_t&=\underbrace{\lfloor t/K\rfloor}_{\substack{\text{update를 interval로 나눠}\\\text{지난 milestone 수 계산}}}\\\eta_t^{\rm step}&=\underbrace{\eta_0\gamma^{j_t}}_{\text{milestone 수만큼 factor 적용}}\\\eta_t^{\rm exp}&=\underbrace{\eta_0\gamma^t}_{\text{호출마다 같은 factor 적용}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\lfloor t/K\rfloor`,
              annotation: [
                "update index를 interval로 나눠",
                "완료한 decay 횟수 계산",
              ],
            },
            {
              expression: String.raw`\eta_0\gamma^{j_t}`,
              annotation: ["base LR에 factor를 j번 곱해", "계단식 LR 반환"],
            },
            {
              expression: String.raw`\eta_0\gamma^t`,
              annotation: ["매 호출마다 factor를 누적해", "비율 감소 생성"],
            },
          ]}
          terms={[
            {
              symbol: "K",
              name: "Milestone interval",
              description: "Step decay 사이의 update 수입니다.",
            },
            {
              symbol: String.raw`j_t`,
              name: "Completed milestones",
              description: "현재까지 지난 decay 경계 수입니다.",
            },
            {
              symbol: String.raw`\gamma`,
              name: "Decay factor",
              description: "각 decay에서 LR에 곱하는 비율입니다.",
            },
            {
              symbol: String.raw`\eta_0`,
              name: "Base learning rate",
              description: "Decay 전 기준 LR입니다.",
            },
          ]}
          assumptions={[
            "t와 K는 같은 optimizer-update 단위입니다.",
            "0<γ≤1입니다.",
            "Framework의 initial step convention을 trace로 확인합니다.",
          ]}
          interpretation="floor(250/100)=2이므로 .1×.5²=.025입니다. Exponential 식은 같은 γ를 250회 곱하므로 전혀 다른 곡선입니다."
        />
      </section>

      <section id="metric-trigger" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Plateau policy는 improvement를 event 단위로 판정합니다
        </h2>
        <ExplainedFormula
          question="Min-mode에서 현재 metric이 best보다 얼마나 좋아야 bad-count를 reset하나요?"
          idea={
            <p>
              현재 metric이 best에서 threshold를 뺀 경계보다 작을 때만 meaningful improvement로 인정합니다. 아니면 bad-count를 하나 늘립니다.
            </p>
          }
          formula={String.raw`\begin{aligned}q_e&=[m_e<b_e-\delta]\\c_e&=(1-q_e)(c_{e-1}+1)\\d_e&=[c_e>p]\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}q_e&=\underbrace{[m_e<b_e-\delta]}_{\substack{\text{best보다 threshold 이상 낮은지}\\\text{meaningful improvement 판정}}}\\c_e&=\underbrace{(1-q_e)(c_{e-1}+1)}_{\text{개선 없을 때 bad-count 증가}}\\d_e&=\underbrace{[c_e>p]}_{\text{patience를 넘으면 decay 생성}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`m_e<b_e-\delta`,
              annotation: [
                "현재 metric을 improvement 경계와 비교해",
                "의미 있는 개선 여부 판정",
              ],
            },
            {
              expression: String.raw`(1-q_e)(c_{e-1}+1)`,
              annotation: [
                "개선 indicator의 반대를 곱해",
                "개선 시 0, 아니면 counter 증가",
              ],
            },
            {
              expression: String.raw`[c_e>p]`,
              annotation: [
                "bad-count를 patience와 비교해",
                "LR decay trigger 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`m_e`,
              name: "Current validation metric",
              description: "Evaluation event e의 min-mode score입니다.",
            },
            {
              symbol: String.raw`b_e`,
              name: "Best metric",
              description: "현재까지 인정된 가장 작은 score입니다.",
            },
            {
              symbol: String.raw`\delta`,
              name: "Meaningful threshold",
              description:
                "Noise를 improvement로 세지 않기 위한 최소 차이입니다.",
            },
            {
              symbol: "p",
              name: "Patience",
              description: "Decay 전 허용하는 bad evaluation 수입니다.",
            },
          ]}
          assumptions={[
            "Min-mode absolute threshold를 단순화한 식입니다.",
            "Evaluation cadence가 고정되어 있습니다.",
            "Cooldown과 min LR는 별도 transition입니다.",
          ]}
          interpretation="Plateau policy는 update 수만으로 복원되지 않습니다. best·bad-count·cooldown·metric direction과 cadence를 함께 checkpoint해야 합니다."
        />
      </section>

      <section id="selection-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Decay와 early stopping의 순서를 먼저 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 validation metric을 두 state machine이 읽으면 decay 뒤 몇 번의 update를 더 허용할지 명시합니다. 그렇지 않으면 early
            stopping이 먼저 firing해 decay가 효과를 낼 기회가 없습니다. global update와 evaluation index를 먼저 적고 metric·old/new
            LR·trigger reason까지 한 trace에 함께 남깁니다.
          </p>
        </div>
        <div id="docs-pytorch-decay" className="scroll-mt-24">
          <CitationBlock
            source="PyTorch · LRScheduler and ReduceLROnPlateau"
            citeKey={1}
            href="https://docs.pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate"
          >
            <strong>문제:</strong> clock-driven scheduler와 validation-driven
            decay의 호출 semantics를 구분함. <strong>기여:</strong>{" "}
            StepLR·ExponentialLR와 ReduceLROnPlateau의 API·호출 순서를 문서화.{" "}
            <strong>전제:</strong> 현재 PyTorch version과 scheduler 설정.{" "}
            <strong>근거 범위:</strong> API behavior.{" "}
            <strong>과장 금지:</strong> Default patience·factor가 모든 task의
            최적값이라는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
