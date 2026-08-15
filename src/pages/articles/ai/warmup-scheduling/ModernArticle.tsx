import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { WarmupCompositionViz } from "../lr-scheduling/viz/ModernLrScheduleViz";

export default function WarmupSchedulingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Warmup은 시작 구간과 본 schedule을 이어 붙이는 계약입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Warmup</strong>은 처음 W updates 동안 learning rate를
            start에서 peak까지 올립니다.{" "}
            <strong>Main schedule composition</strong>은 남은 T−W updates를
            local clock 0부터 다시 세어 경계값과 종료점을 맞춥니다.
          </p>
        </div>
        <TermBreakdown
          title="Warmup 경계의 네 용어"
          items={[
            {
              term: "Warmup length W",
              description:
                "Peak LR에 도달하기까지 사용할 optimizer update 수입니다.",
              example: "W=100이면 처음 100 updates가 rising phase입니다.",
              boundary: "100 micro-batches나 100 epochs를 뜻하지 않습니다.",
            },
            {
              term: "Peak boundary",
              description:
                "Warmup 끝값과 main schedule 첫 값이 만나는 지점입니다.",
              example: "ηwarm(W)=S(0)=.001입니다.",
              boundary: "두 값이 다르면 경계에서 LR가 갑자기 뜁니다.",
            },
            {
              term: "Main local cursor k",
              description:
                "Global update에서 W를 뺀 본 schedule 내부 위치입니다.",
              example: "t=101, W=100이면 k=1입니다.",
              boundary: "Global t를 그대로 cosine에 넣지 않습니다.",
            },
            {
              term: "Relative update",
              description:
                "실제 parameter displacement를 parameter norm으로 정규화한 진단입니다.",
              example: "‖Δθ‖=.05, ‖θ‖=50이면 ρ=.001입니다.",
              boundary: "작을수록 학습 품질이 항상 좋다는 metric은 아닙니다.",
            },
          ]}
        />
        <WarmupCompositionViz />
        <ContentBoundary article="warmup-scheduling" />
      </section>

      <section id="composition" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Global clock을 warmup과 main local clock으로 나눕니다
        </h2>
        <ExplainedFormula
          question="T=1000, W=100이면 왜 cosine main length가 900인가요?"
          idea={
            <p>
              Warmup이 전체 budget 앞부분을 이미 사용했으므로 main schedule은
              global step에서 W를 뺀 cursor와 남은 길이 T−W를 사용합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}r_t&=t/W\quad(0\le t\le W)\\k&=t-W\\L&=T-W\\\eta_t&=S(k;L)\quad(t>W)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}r_t&=\underbrace{t/W}_{\text{warmup 안의 0–1 progress 계산}}\\k&=\underbrace{t-W}_{\text{global update에서 warmup offset 제거}}\\L&=\underbrace{T-W}_{\text{total budget에서 warmup 길이 차감}}\\\eta_t&=\underbrace{S(k;L)}_{\text{main local clock으로 LR 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`t/W`,
              annotation: [
                "global update를 warmup 길이로 나눠",
                "rising phase progress 생성",
              ],
            },
            {
              expression: String.raw`t-W`,
              annotation: [
                "global update에서 warmup offset을 빼",
                "main local cursor 생성",
              ],
            },
            {
              expression: String.raw`T-W`,
              annotation: [
                "total budget에서 warmup을 빼",
                "main schedule 길이 확정",
              ],
            },
            {
              expression: String.raw`S(k;L)`,
              annotation: [
                "local cursor와 남은 길이를 main 함수에 넣어",
                "경계 이후 LR 반환",
              ],
            },
          ]}
          terms={[
            {
              symbol: "W",
              name: "Warmup updates",
              description: "Rising phase 길이입니다.",
            },
            {
              symbol: "T",
              name: "Total updates",
              description: "Warmup과 main을 모두 포함한 run budget입니다.",
            },
            {
              symbol: "k",
              name: "Main local cursor",
              description: "Warmup 이후 0부터 시작하는 step입니다.",
            },
            {
              symbol: "L",
              name: "Main length",
              description: "본 schedule에 남은 update 수입니다.",
            },
          ]}
          assumptions={[
            "0<W<T입니다.",
            "Warmup 끝값과 S(0;L)이 같습니다.",
            "Endpoint와 scheduler call convention을 framework에 맞춥니다.",
          ]}
          interpretation="L=900이고 global t=100에서 k=0입니다. Warmup 100 뒤 T_max=1000 cosine을 붙이면 총 1100 updates가 되어 intended end가 밀립니다."
        />
      </section>

      <section id="update-magnitude" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Warmup 효과는 LR가 아니라 실제 displacement로 확인합니다
        </h2>
        <ExplainedFormula
          question="Parameter norm 50, update norm .5이면 relative update가 왜 .01인가요?"
          idea={
            <p>
              Optimizer가 만든 모든 update 항을 합친 실제 displacement의 norm을
              update 직전 parameter norm으로 나눕니다.
            </p>
          }
          formula={String.raw`\begin{aligned}\Delta_t&=\theta_{t+1}-\theta_t\\d_t&=\|\theta_t\|_2+\varepsilon\\\rho_t&=\|\Delta_t\|_2/d_t\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\Delta_t&=\underbrace{\theta_{t+1}-\theta_t}_{\text{실제 이동량}}\\n_t&=\underbrace{\|\Delta_t\|_2}_{\text{이동 크기}}\\d_t&=\underbrace{\|\theta_t\|_2+\varepsilon}_{\text{parameter 크기}}\\\rho_t&=\underbrace{n_t/d_t}_{\text{크기 정규화 update}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\theta_{t+1}-\theta_t`,
              annotation: [
                "update 후 parameter에서 전 값을 빼",
                "실제 displacement 복원",
              ],
            },
            {
              expression: String.raw`\|\Delta_t\|_2`,
              annotation: [
                "coordinate별 이동을 norm으로 모아",
                "update magnitude 계산",
              ],
            },
            {
              expression: String.raw`n_t/(\|\theta_t\|_2+\varepsilon)`,
              annotation: [
                "update norm을 parameter norm으로 나눠",
                "무차원 relative update 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\Delta_t`,
              name: "Actual displacement",
              description: "Optimizer·decay까지 반영된 parameter 차이입니다.",
            },
            {
              symbol: String.raw`n_t`,
              name: "Update norm",
              description: "Displacement의 L2 magnitude입니다.",
            },
            {
              symbol: String.raw`\rho_t`,
              name: "Relative update",
              description: "Parameter scale로 정규화한 진단값입니다.",
            },
            {
              symbol: String.raw`\varepsilon`,
              name: "Denominator guard",
              description: "Zero-norm parameter에서 나눗셈을 안정화합니다.",
            },
          ]}
          assumptions={[
            "같은 parameter group과 norm reduction을 비교합니다.",
            "AMP skipped update는 Δ=0 event로 따로 표시합니다.",
            "Decoupled weight decay를 포함할지 분리할지 명시합니다.",
          ]}
          interpretation=".5/50=.01입니다. Warmup 뒤 ρ·loss spike·overflow가 줄었는지 함께 보고, 작은 ρ 자체를 좋은 학습의 충분조건으로 보지 않습니다."
        />
      </section>

      <section id="failure-boundary" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Warmup은 잘못된 gradient를 고치지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            NaN 원인이 data corruption·normalization·loss scale·잘못된 parameter
            group·과도한 peak LR라면 W를 늘려 증상을 늦출 뿐입니다. Fixed
            fixture에서 no-warmup과 warmup의 gradient norm·relative
            update·overflow·loss를 비교하고 원인별 rollback을 둡니다.
          </p>
        </div>
        <div id="paper-untuned-warmup" className="scroll-mt-24">
          <CitationBlock
            source="On the Adequacy of Untuned Warmup for Adaptive Optimization"
            citeKey={1}
            href="https://arxiv.org/abs/1910.04209"
          >
            <strong>문제:</strong> Adam warmup 필요성의 설명과 costly tuning.{" "}
            <strong>기여:</strong> Adaptive update magnitude 중심의 분석과
            simple untuned warmup 비교. <strong>전제:</strong> Adam·β₂와 논문의
            architecture·dataset·settings. <strong>근거 범위:</strong> 논문이
            비교한 practical experiments와 rule of thumb.{" "}
            <strong>과장 금지:</strong> 제안한 길이가 모든 model·optimizer의
            이론적 최적값이라는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
