import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { AdamStateViz } from "../optimizers/viz/ModernOptimizerViz";

export default function AdamOptimizerArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Adam은 gradient 방향과 squared scale을 두 EMA state로 나눕니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>First raw moment</strong> m은 signed direction을,{" "}
            <strong>second raw moment</strong> v는 squared magnitude를
            추적합니다. 0 initialization bias를 보정한 뒤 m̂을 √v̂+ε로 나눕니다.
          </p>
          <p>
            v는 centered variance가 아니고, diagonal preconditioner는 Hessian
            inverse가 아닙니다. Weight shrinkage는 이 경로와 분리한{" "}
            <a href="/ai/weight-decay">AdamW 글</a>에서 이어집니다.
          </p>
        </div>
        <TermBreakdown
          title="Adam state를 이루는 네 항"
          items={[
            {
              term: "First raw moment",
              description: "Signed gradient의 EMA입니다.",
              example: "β₁=.9, g=2이면 첫 m=.2입니다.",
              boundary: "Dataset 평균 gradient와 동일하지 않습니다.",
            },
            {
              term: "Second raw moment",
              description: "Squared gradient의 EMA입니다.",
              example: "β₂=.999, g=2이면 첫 v=.004입니다.",
              boundary: "Centered variance E[(g−E[g])²]가 아닙니다.",
            },
            {
              term: "Bias correction",
              description: "0에서 시작한 초기 EMA shrink를 되돌립니다.",
              example: "m̂₁=.2/(1−.9)=2입니다.",
              boundary: "Sampling bias나 model bias를 고치지 않습니다.",
            },
            {
              term: "Preconditioner",
              description: "Coordinate history scale로 direction을 나눕니다.",
              example: "v̂=100이면 denominator는 약 10입니다.",
              boundary: "Full curvature나 convergence 보장이 아닙니다.",
            },
          ]}
        />
        <AdamStateViz />
        <ContentBoundary article="adam-optimizer" />
      </section>

      <section id="moments" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          m과 v는 gradient와 gradient 제곱의 raw-moment EMA입니다
        </h2>
        <ExplainedFormula
          question="첫 gradient g=2에서 m₁=.2, v₁=.004가 되는 이유는 무엇인가요?"
          idea={
            <p>
              같은 gradient에서 signed value와 squared value를 만들고 서로 다른
              decay로 두 장부를 갱신합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}r_t^m&=\beta_1m_{t-1}\\n_t^m&=(1-\beta_1)g_t\\m_t&=r_t^m+n_t^m\\r_t^v&=\beta_2v_{t-1}\\n_t^v&=(1-\beta_2)g_t^2\\v_t&=r_t^v+n_t^v\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}r_t^m&=\underbrace{\beta_1m_{t-1}}_{\text{과거 signed 방향 보존}}\\n_t^m&=\underbrace{(1-\beta_1)g_t}_{\text{현재 방향 추가}}\\m_t&=\underbrace{r_t^m+n_t^m}_{\text{두 방향 기여를 합성}}\\r_t^v&=\underbrace{\beta_2v_{t-1}}_{\text{과거 squared scale 보존}}\\n_t^v&=\underbrace{(1-\beta_2)g_t^2}_{\text{현재 magnitude 제곱 추가}}\\v_t&=\underbrace{r_t^v+n_t^v}_{\text{두 scale 기여를 합성}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\beta_1m_{t-1}+(1-\beta_1)g_t`,
              annotation: [
                "과거와 현재 signed gradient를 decay-weighted 합으로 묶어",
                "first raw-moment state 갱신",
              ],
            },
            {
              expression: String.raw`g_t^2`,
              annotation: [
                "현재 gradient를 coordinate별로 제곱해",
                "부호 없는 magnitude signal 생성",
              ],
            },
            {
              expression: String.raw`\beta_2v_{t-1}+(1-\beta_2)g_t^2`,
              annotation: [
                "과거와 현재 squared signal을 합쳐",
                "second raw-moment state 갱신",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`m_t`,
              name: "First raw moment EMA",
              description: "Signed gradient history입니다.",
            },
            {
              symbol: String.raw`v_t`,
              name: "Second raw moment EMA",
              description: "Squared-gradient history입니다.",
            },
            {
              symbol: String.raw`\beta_1,\beta_2`,
              name: "Decay coefficients",
              description: "두 state의 기억 길이를 따로 정합니다.",
            },
          ]}
          assumptions={[
            "m₀=v₀=0입니다.",
            "Square는 coordinate-wise입니다.",
            "β₁=.9, β₂=.999 예시는 convention을 고정합니다.",
          ]}
          interpretation="m₁=.1×2=.2이고 v₁=.001×4=.004입니다. v에 평균을 뺀 centered deviation은 들어가지 않습니다."
        />
      </section>

      <section id="bias-correction" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Bias correction은 빈 state에서 시작한 초기 shrink만 보정합니다
        </h2>
        <ExplainedFormula
          question="Constant first gradient에서 왜 m̂₁=g, v̂₁=g²가 복원되나요?"
          idea={
            <p>
              0 initialization 때문에 한 번만 들어온 신규 mass가 1−β만큼
              작으므로, 누적된 mass 1−βᵗ로 나눕니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\hat m_t&=m_t/(1-\beta_1^t)\\\hat v_t&=v_t/(1-\beta_2^t)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}a_t&=\underbrace{1-\beta_1^t}_{\text{first EMA에 누적된 총 mass}}\\\hat m_t&=\underbrace{m_t/a_t}_{\text{작아진 first state scale 복원}}\\b_t&=\underbrace{1-\beta_2^t}_{\text{second EMA에 누적된 총 mass}}\\\hat v_t&=\underbrace{v_t/b_t}_{\text{작아진 squared state scale 복원}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`1-\beta_1^t`,
              annotation: [
                "first EMA가 지금까지 받은 coefficient mass를 계산해",
                "초기 0의 shrink 정도 측정",
              ],
            },
            {
              expression: String.raw`m_t/a_t`,
              annotation: [
                "first state를 누적 mass로 나눠",
                "signed scale 보정",
              ],
            },
            {
              expression: String.raw`v_t/b_t`,
              annotation: [
                "second state를 별도 누적 mass로 나눠",
                "squared scale 보정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`t`,
              name: "Update index",
              description: "실제 optimizer update 횟수입니다.",
            },
            {
              symbol: String.raw`\hat m_t`,
              name: "Corrected first moment",
              description:
                "Initialization scale을 보정한 direction state입니다.",
            },
            {
              symbol: String.raw`\hat v_t`,
              name: "Corrected second moment",
              description: "Initialization scale을 보정한 squared state입니다.",
            },
          ]}
          assumptions={[
            "Update index는 skipped step에서 임의로 증가하지 않습니다.",
            "두 decay는 각자 exponent를 사용합니다.",
            "이 보정은 data sampling bias와 무관합니다.",
          ]}
          interpretation="t=1에서 m₁=(1−β₁)g를 같은 1−β₁로 나누므로 g가 되고, v도 같은 방식으로 g²를 복원합니다."
        />
      </section>

      <section id="preconditioning" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          √v̂+ε로 나누어 coordinate별 effective step을 만듭니다
        </h2>
        <ExplainedFormula
          question="같은 m̂인데 v̂가 1과 100인 두 좌표의 update가 왜 다른가요?"
          idea={
            <p>
              Squared-gradient history의 root를 denominator로 사용해 자주 큰
              gradient를 본 좌표의 direction을 더 작게 scale합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}s_t&=\sqrt{\hat v_t}\\q_t&=s_t+\varepsilon\\d_t&=\hat m_t/q_t\\\theta_{t+1}&=\theta_t-\eta d_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}s_t&=\underbrace{\sqrt{\hat v_t}}_{\substack{\text{squared history를}\\\text{gradient scale로 복원}}}\\q_t&=\underbrace{s_t+\varepsilon}_{\substack{\text{0 나눗셈과}\\\text{작은 분모를 완화}}}\\d_t&=\underbrace{\hat m_t/q_t}_{\substack{\text{direction을 coordinate}\\\text{history scale로 나눔}}}\\\theta_{t+1}&=\underbrace{\theta_t-\eta d_t}_{\text{global LR를 곱해 이동}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\sqrt{\hat v_t}`,
              annotation: [
                "squared-gradient history에 root를 취해",
                "gradient와 비교 가능한 coordinate scale 생성",
              ],
            },
            {
              expression: String.raw`s_t+\varepsilon`,
              annotation: [
                "scale에 epsilon을 더해",
                "0 division과 tiny denominator 완화",
              ],
            },
            {
              expression: String.raw`\hat m_t/q_t`,
              annotation: [
                "signed direction을 coordinate scale로 나눠",
                "adaptive direction 생성",
              ],
            },
            {
              expression: String.raw`\theta_t-\eta d_t`,
              annotation: [
                "adaptive direction에 global LR를 곱하고 빼서",
                "다음 parameter 확정",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\varepsilon`,
              name: "Numerical epsilon",
              description: "Denominator convention에 포함되는 작은 양수입니다.",
            },
            {
              symbol: String.raw`d_t`,
              name: "Adaptive direction",
              description: "Coordinate별 history로 scale된 direction입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "Global learning rate",
              description:
                "Adaptive direction 전체의 displacement scale입니다.",
            },
          ]}
          assumptions={[
            "Square root와 division은 coordinate-wise입니다.",
            "Epsilon placement와 dtype이 구현에 고정됩니다.",
            "Weight decay는 이 task-gradient path 밖에서 별도로 다룹니다.",
          ]}
          interpretation="m̂가 같고 ε를 무시하면 v̂=1은 1로, v̂=100은 10으로 나누므로 두 번째 coordinate step은 첫 번째의 1/10입니다."
        />
      </section>

      <section id="release-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Adam state와 update convention을 같이 저장해야 재현됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Parameter identity별 m·v·step, β₁·β₂·ε, moment dtype, gradient
            clipping과 AMP skip 순서, LR schedule을 checkpoint와 receipt에
            넣습니다. 같은 training loss만으로 convergence나 validation 우월성을
            결론내리지 않습니다.
          </p>
        </div>
        <div id="paper-adam" className="scroll-mt-24">
          <CitationBlock
            source="Adam: A Method for Stochastic Optimization"
            citeKey={1}
            href="https://arxiv.org/abs/1412.6980"
          >
            <strong>문제:</strong> Noisy·sparse gradient의 coordinate scale
            차이. <strong>기여:</strong> First·second raw-moment EMA와
            initialization bias correction을 결합한 adaptive update.{" "}
            <strong>전제:</strong> 논문의 stochastic
            objective·bounded-gradient·online convex analysis와 실험 조건.{" "}
            <strong>근거 범위:</strong> 원문의 regret analysis와 공개 benchmark.{" "}
            <strong>과장 금지:</strong> 모든 nonconvex model에서 기본
            hyperparameter가 최선이거나 SGD보다 항상 우월하다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-adam-convergence" className="scroll-mt-24">
          <CitationBlock
            source="On the Convergence of Adam and Beyond"
            citeKey={2}
            href="https://arxiv.org/abs/1904.09237"
          >
            <strong>문제:</strong> Adaptive step history가 특정 convex
            example에서 convergence를 깨뜨릴 수 있는 문제.{" "}
            <strong>기여:</strong> Failure example과 장기 memory 조건을 분석.{" "}
            <strong>전제:</strong> 논문의 convex online optimization
            construction. <strong>근거 범위:</strong> Adam convergence claim의
            경계와 제안 variant. <strong>과장 금지:</strong> 모든 실제 Adam
            training이 발산한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
