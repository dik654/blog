import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { ParetoSelectionViz } from "../hyperparameter-tuning/viz/ModernHpoViz";

export default function MultiObjectiveHpoArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Multi-objective tuning은 서로 다른 단위의 목표를 한 점수로 숨기지
          않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            실제 배포 후보는 validation loss만으로 결정되지 않습니다.
            Latency·peak memory·cost·worst-slice quality처럼 서로 다른 단위와
            책임을 가진 목표가 함께 있습니다. <strong>Pareto frontier</strong>는
            그 trade-off를 없애는 방법이 아니라, 더 볼 이유가 없는 후보를 제거한
            뒤 실제 선택이 필요한 경계를 보여 줍니다.
          </p>
          <p>
            먼저 반드시 지켜야 할 값을 hard constraint로 분리합니다. 100ms SLA나
            16GB memory 상한을 넘는 후보를 “정확도가 좋으니” frontier에 남기면
            운영 불가능한 선택을 미룬 것뿐입니다.
          </p>
        </div>
        <TermBreakdown
          title="여러 목표를 선택으로 바꾸는 네 단계"
          items={[
            {
              term: "Objective",
              description: "작을수록 또는 클수록 좋은 연속 평가량입니다.",
              example:
                "Validation loss는 minimize, throughput은 maximize합니다.",
              boundary:
                "단위가 다른 목표를 근거 없이 한 weighted sum으로 합치지 않습니다.",
            },
            {
              term: "Hard constraint",
              description: "어기면 후보를 채택할 수 없는 운영·안전 경계입니다.",
              example: "Peak memory≤16GB, p99 latency≤100ms입니다.",
              boundary:
                "좋으면 좋은 objective와 통과해야 하는 gate를 구분합니다.",
            },
            {
              term: "Dominance",
              description:
                "한 후보가 모든 목표에서 나쁘지 않고 하나 이상에서 더 좋은 관계입니다.",
              example:
                "A가 B보다 loss·latency·memory 모두 좋으면 B는 지배당합니다.",
              boundary:
                "Measurement noise보다 작은 차이를 승리로 세지 않습니다.",
            },
            {
              term: "Frontier",
              description:
                "다른 feasible 후보에 지배당하지 않은 configuration 집합입니다.",
              example: "빠른 A와 정확한 C가 함께 남을 수 있습니다.",
              boundary: "Frontier가 자동으로 한 우승자를 정하지 않습니다.",
            },
          ]}
        />
        <ParetoSelectionViz />
        <ContentBoundary article="multi-objective-hpo" />
      </section>

      <section id="dominance" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          모든 목적에서 나쁘지 않은 후보만 다른 후보를 지배합니다
        </h2>
        <ExplainedFormula
          question="Minimize objectives에서 configuration a가 b를 지배한다는 뜻은 무엇인가요?"
          idea={
            <p>
              a가 모든 목표에서 b보다 크지 않고 적어도 한 목표에서는 엄격히 작아야 합니다. 한 축이라도 나쁘면 둘은 trade-off입니다.
            </p>
          }
          formula={String.raw`a\prec b\iff(\forall k, f_k(a)\le f_k(b))\land(\exists j,f_j(a)<f_j(b))`}
          annotatedFormula={String.raw`\begin{aligned}g_k&=\underbrace{\mathbf1[f_k(a)\le f_k(b)+\delta_k]}_{\text{k축에서 나쁘지 않음}}\\s_k&=\underbrace{\mathbf1[f_k(a)<f_k(b)-\delta_k]}_{\text{k축에서 분명히 좋음}}\\G&=\underbrace{\prod_kg_k}_{\text{모든 축을 AND로 결합}}\\S&=\underbrace{\sum_ks_k}_{\text{분명히 이긴 축의 수}}\\a\prec b&\iff\underbrace{(G=1)\land(S\ge1)}_{\text{dominance 판정}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`f_k(a)\le f_k(b)+\delta_k`,
              annotation: [
                "두 후보의 k번째 값을 tolerance와 함께 비교해",
                "a가 실질적으로 나쁘지 않은지 판정",
              ],
            },
            {
              expression: String.raw`\prod_kg_k(a,b)`,
              annotation: [
                "모든 binary gates를 곱해",
                "모든 objectives 통과를 AND로 결합",
              ],
            },
            {
              expression: String.raw`\sum_js_j(a,b)\ge1`,
              annotation: [
                "분명히 이긴 objectives 수를 더해",
                "하나 이상 개선됐는지 확인",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`f_k`,
              name: "Objective k",
              description: "같은 fixture에서 측정한 minimize 방향 목표입니다.",
            },
            {
              symbol: String.raw`\delta_k`,
              name: "Practical tolerance",
              description:
                "Noise나 무의미한 미세 차이를 승리로 세지 않는 경계입니다.",
            },
            {
              symbol: String.raw`a\prec b`,
              name: "a dominates b",
              description: "b가 별도의 trade-off를 제공하지 않는 관계입니다.",
            },
          ]}
          assumptions={[
            "모든 objectives의 방향과 단위가 명시되어 있습니다.",
            "Hard constraints를 먼저 통과한 후보끼리 비교합니다.",
            "같은 hardware·batch·measurement protocol을 사용합니다.",
          ]}
          interpretation="A(.20 loss,10ms,4GB)는 B(.22,12ms,5GB)를 지배합니다. C(.18,15ms,3GB)는 더 정확하지만 느려 A와 서로 지배하지 않습니다."
        />
      </section>

      <section id="uncertainty" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          한 번 측정한 점 대신 반복 분포로 frontier의 흔들림을 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Latency는 background load에, quality는 seed와 sample에 흔들립니다. 한 번의 측정으로 frontier를 만들면 0.2ms 차이로 후보가
            들어오고 나갑니다. 같은 후보를 여러 seed·measurement rounds에서 반복하고 tolerance를 넘는 dominance가 얼마나 자주 유지되는지 기록합니다.
          </p>
        </div>
        <ExplainedFormula
          question="반복 측정에서 a가 b를 안정적으로 지배하는 비율은 어떻게 보나요?"
          idea={
            <p>
              각 repeat에서 tolerance-aware dominance가 성립하면 1을 기록하고 전체 repeats의 평균을 냅니다.
            </p>
          }
          formula={String.raw`\widehat\pi_{a\prec b}=R^{-1}\sum_{r=1}^{R}\mathbf1[a\prec_r b]`}
          annotatedFormula={String.raw`\begin{aligned}d_r&=\underbrace{\mathbf1[a\prec_r b]}_{\text{repeat r의 dominance}}\\N_d&=\underbrace{\sum_{r=1}^{R}d_r}_{\text{dominance 유지 횟수}}\\\widehat\pi_d&=\underbrace{\frac{N_d}{R}}_{\text{전체 repeat 중 유지 비율}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[a\prec_r b]`,
              annotation: [
                "repeat별 multi-objective 결과를 dominance rule로 검사해",
                "binary outcome 생성",
              ],
            },
            {
              expression: String.raw`\sum_rd_r`,
              annotation: ["repeat별 dominance 사건을 더해", "유지 횟수 계산"],
            },
            {
              expression: String.raw`N_{a\prec b}/R`,
              annotation: [
                "유지 횟수를 전체 repeats로 나눠",
                "stability proportion 계산",
              ],
            },
          ]}
          terms={[
            {
              symbol: "R",
              name: "Repeated evaluations",
              description: "Seed 또는 measurement rounds 수입니다.",
            },
            {
              symbol: String.raw`d_r`,
              name: "Repeat dominance",
              description: "r번째 측정에서 dominance가 성립했는지 나타냅니다.",
            },
            {
              symbol: String.raw`\widehat\pi`,
              name: "Dominance stability",
              description: "측정 반복에서 관계가 유지된 비율입니다.",
            },
          ]}
          assumptions={[
            "Repeat마다 같은 evaluation protocol을 사용합니다.",
            "Seed variation과 systems noise를 구분해 기록합니다.",
            "작은 R의 비율을 확정적 probability처럼 해석하지 않습니다.",
          ]}
          interpretation="10회 중 6회만 A가 B를 지배하면 frontier에서 B를 즉시 제거하기보다 두 후보의 uncertainty와 slice trade-off를 더 확인합니다."
        />
      </section>

      <section id="selection-receipt" className="scroll-mt-20">
        <h2 className="mb-4 text-2xl font-bold">
          Frontier에서 한 후보를 고른 이유는 별도 selection receipt입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Receipt에는 objective definitions·directions·units, hard
            constraints, measurement fixture·hardware, tolerance, repetitions,
            frontier revision을 적습니다. 마지막 선택에는 “p99 latency 80ms SLA
            안에서 outer loss가 가장 낮아 C를 승인”처럼 책임 있는 정책 이유와
            rollback 후보를 남깁니다.
          </p>
        </div>
        <div id="paper-multiobjective-optuna" className="scroll-mt-24">
          <CitationBlock
            source="Optuna multi-objective optimization documentation"
            citeKey={1}
            href="https://optuna.readthedocs.io/en/stable/tutorial/20_recipes/002_multi_objective.html"
          >
            <strong>문제:</strong> 여러 objective의 trade-off를 study에서
            보존하는 방법. <strong>기여:</strong> directions와 Pareto trials를
            다루는 현재 API 예시. <strong>전제:</strong> 설치된 Optuna version과
            objective implementation. <strong>근거 범위:</strong> 공식 API
            usage. <strong>과장 금지:</strong> API가 business preference나 안전
            constraint를 자동 결정하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
