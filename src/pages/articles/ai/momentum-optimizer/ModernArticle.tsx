import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { momentumOptimizerTree } from "./fileTree";
import { MomentumMemoryViz } from "../optimizers/viz/ModernOptimizerViz";

export default function MomentumOptimizerArticle() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Momentum은 과거 gradient 전체가 아니라 감쇠된 방향 state 하나를
          기억합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Exponential moving average</strong>는 오래된 signal에 β의
            거듭제곱 weight를 줍니다. <strong>Momentum velocity</strong>는 그
            memory를 parameter update direction으로 사용합니다.
          </p>
          <p>
            일관된 방향은 누적되고 좌우로 번갈아 나오는 방향은 상쇄되지만, 큰
            β·learning rate에서는 늦게 꺾여 overshoot할 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="Momentum memory를 이루는 네 항"
          items={[
            {
              term: "Current gradient",
              description: "이번 mini-batch의 noisy direction입니다.",
              example: "gₜ=(1,−2)입니다.",
              boundary: "Full gradient와 같다고 가정하지 않습니다.",
            },
            {
              term: "Decay β",
              description: "직전 state를 얼마나 남길지 정합니다.",
              example: "β=.9면 직전 state의 90%를 유지합니다.",
              boundary: "최근 10개 hard window가 아닙니다.",
            },
            {
              term: "Velocity",
              description: "감쇠된 과거와 현재 gradient를 합친 state입니다.",
              example: "vₜ=.9vₜ₋₁+gₜ입니다.",
              boundary: "Library마다 (1−β) convention이 다를 수 있습니다.",
            },
            {
              term: "Damping audit",
              description: "Oscillation·overshoot·update norm을 함께 봅니다.",
              example: "β·η grid에서 trajectory를 비교합니다.",
              boundary: "Momentum이 모든 saddle을 탈출한다는 보장은 없습니다.",
            },
          ]}
        />
        <MomentumMemoryViz />
        <ContentBoundary article="momentum-optimizer" />
      </section>

      <section id="ema" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          EMA는 오래된 gradient를 β의 거듭제곱만큼 희미하게 남깁니다
        </h2>
        <ExplainedFormula
          question="β=.9일 때 10 step 전 gradient의 현재 weight가 왜 약 .35인가요?"
          idea={
            <p>
              재귀식에서 직전 state를 반복 대입하면 과거 gradient마다 β의 시간
              차 거듭제곱이 붙습니다.
            </p>
          }
          formula={String.raw`\begin{aligned}m_t&=\beta m_{t-1}+(1-\beta)g_t\\m_t&=(1-\beta)\sum_{j=0}^{t-1}\beta^jg_{t-j}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}r_t&=\underbrace{\beta m_{t-1}}_{\text{직전 memory를 beta만큼 보존}}\\n_t&=\underbrace{(1-\beta)g_t}_{\text{현재 gradient의 새 기여를 추가}}\\m_t&=\underbrace{r_t+n_t}_{\text{보존분과 신규분을 한 state로 합성}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\beta m_{t-1}`,
              annotation: [
                "직전 memory에 beta를 곱해",
                "과거 signal을 한 단계 감쇠",
              ],
            },
            {
              expression: String.raw`(1-\beta)g_t`,
              annotation: [
                "현재 gradient에 남은 mass를 곱해",
                "새 signal의 기여 추가",
              ],
            },
            {
              expression: String.raw`r_t+n_t`,
              annotation: [
                "과거 보존분과 현재 기여를 더해",
                "고정 크기 EMA state 갱신",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`m_t`,
              name: "EMA state",
              description: "시점 t의 normalized moving average입니다.",
            },
            {
              symbol: String.raw`\beta`,
              name: "Decay",
              description: "과거 state를 유지하는 0–1 coefficient입니다.",
            },
            {
              symbol: String.raw`g_t`,
              name: "Current signal",
              description: "이번 step의 gradient입니다.",
            },
          ]}
          assumptions={[
            "0≤β<1입니다.",
            "여기서는 (1−β)를 쓰는 normalized EMA convention입니다.",
            "Step 간격이 같은 optimizer update clock입니다.",
          ]}
          interpretation="10 step 전 상대 weight는 .9¹⁰≈.349입니다. 실제 absolute coefficient에는 현재식 convention의 (1−β)도 곱해집니다."
        />
      </section>

      <section id="velocity" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Momentum velocity는 EMA memory를 descent update에 사용합니다
        </h2>
        <ExplainedFormula
          question="Gradient가 1,1,1이고 β=.9이면 velocity가 왜 1,1.9,2.71인가요?"
          idea={
            <p>
              Unnormalized convention에서는 직전 velocity를 β배 남기고 현재
              gradient를 그대로 더한 뒤 그 방향의 반대로 이동합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}v_t&=\beta v_{t-1}+g_t\\\theta_{t+1}&=\theta_t-\eta v_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}r_t&=\underbrace{\beta v_{t-1}}_{\text{직전 velocity를 감쇠해 보존}}\\v_t&=\underbrace{r_t+g_t}_{\text{현재 gradient를 memory에 누적}}\\\theta_{t+1}&=\underbrace{\theta_t-\eta v_t}_{\text{velocity 반대 방향으로 parameter 이동}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\beta v_{t-1}`,
              annotation: [
                "직전 velocity에 beta를 곱해",
                "과거 방향을 감쇠 보존",
              ],
            },
            {
              expression: String.raw`r_t+g_t`,
              annotation: [
                "보존된 방향과 현재 gradient를 더해",
                "새 velocity 생성",
              ],
            },
            {
              expression: String.raw`\theta_t-\eta v_t`,
              annotation: [
                "velocity에 learning rate를 곱하고 빼서",
                "parameter를 descent 방향으로 이동",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`v_t`,
              name: "Velocity",
              description: "Gradient history를 누적한 optimizer state입니다.",
            },
            {
              symbol: String.raw`\eta`,
              name: "Learning rate",
              description: "Velocity를 parameter displacement로 바꿉니다.",
            },
            {
              symbol: String.raw`\theta_t`,
              name: "Parameter",
              description: "현재 model state입니다.",
            },
          ]}
          assumptions={[
            "Unnormalized momentum convention을 사용합니다.",
            "β와 η가 update clock마다 명시됩니다.",
            "Nesterov look-ahead는 포함하지 않습니다.",
          ]}
          interpretation="v₁=1, v₂=.9×1+1=1.9, v₃=.9×1.9+1=2.71입니다. 같은 방향이 지속되면 state가 커집니다."
        />
        <CodeViewButton
          onClick={() =>
            sidebar.open("velocity-update", codeRefs["velocity-update"])
          }
        />
        <TermBreakdown
          title="위 식에 없는 변형 — Nesterov look-ahead"
          items={[
            {
              term: "Nesterov momentum",
              description:
                "위 식은 현재 θₜ₋₁에서 gradient를 구하지만, Nesterov는 velocity 방향으로 먼저 한 걸음 미리 이동한 지점에서 gradient를 구합니다: v_t = β·v_{t-1} + ∇f(θ_{t-1} − β·v_{t-1}), θ_t = θ_{t-1} − η·v_t.",
              example:
                "Velocity가 이미 minimum을 지나칠 방향이면, look-ahead 지점의 gradient가 그 방향을 미리 깎아 overshoot를 줄입니다.",
              boundary:
                "구현마다 look-ahead를 적용하는 순서가 다를 수 있어(예: PyTorch SGD의 nesterov=True) 정확한 update 식은 실제 사용하는 library 문서와 대조해야 합니다.",
            },
          ]}
        />
        <CodeViewButton
          onClick={() =>
            sidebar.open(
              "nesterov-formulation",
              codeRefs["nesterov-formulation"],
            )
          }
        />
      </section>

      <section id="damping-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Velocity가 커지는 것과 학습이 좋아지는 것은 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sharp curvature에서 velocity가 minimum을 지나치거나 learning-rate
            schedule 변화 뒤 stale direction이 남을 수 있습니다. SGD와 같은
            initialization·data order·effective batch·update budget에서 loss
            trajectory·update norm·validation을 비교합니다.
          </p>
        </div>
        <div id="paper-polyak" className="scroll-mt-24">
          <CitationBlock
            source="Some Methods of Speeding Up the Convergence of Iteration Methods"
            citeKey={1}
            href="https://doi.org/10.1016/0041-5553(64)90137-5"
          >
            <strong>문제:</strong> 반복 최적화의 느린 수렴.{" "}
            <strong>기여:</strong> 이전 iterate를 사용하는 multi-step
            acceleration 계열을 분석. <strong>전제:</strong> 논문의
            objective·iteration·parameter 조건. <strong>근거 범위:</strong>{" "}
            원문의 deterministic iteration 분석. <strong>과장 금지:</strong>{" "}
            현대 stochastic deep network에서 β=.9가 보편 최적이거나 overshoot가
            사라진다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: momentumOptimizerTree }}
        projectMetas={{
          torch: {
            id: "torch",
            label: "PyTorch · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </div>
  );
}
