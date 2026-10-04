import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ParetoSelectionViz } from "../hyperparameter-tuning/viz/ModernHpoViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 정확도와 속도와 메모리 사이에서 선택 이유를 남깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>손실이 가장 낮은 모델이 너무 느리거나 장치에 들어가지 않을 수 있습니다. 반대로 빠르지만 오차가 큰 모델도 있습니다. 서로 다른 숫자를 한 점수로 더하기 전에 어떤 후보를 쓸 수 있고 무엇을 더 중요하게 볼지 정해야 합니다.</p><p>이 글은 네 후보를 실제 한도에서 걸러낸 뒤 모든 면에서 뒤지는 후보를 제외합니다. 남은 두 후보 중 무엇을 고르는지는 별도의 사용 목적에 따라 설명합니다.</p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 필수 한도를 검사한 뒤 서로 나은 점이 있는 후보를 남깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>모든 후보를 같은 조건으로 측정하고 필수 한도를 어긴 후보를 뺍니다. 어떤 후보보다 모든 목표가 나쁘거나 같은데 하나는 더 나쁜 후보를 제외합니다. 남은 후보는 반복 측정과 사전에 정한 선택 기준으로 검토합니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>단위와 측정 조건을 고정한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>필수 자원·운영 한도를 적용한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>모든 면에서 뒤지는 후보를 제외한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>남은 상충 관계에서 선택 이유를 남긴다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 메모리로 D를 빼고 A와 C 사이의 선택을 남깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>후보의 값은 손실·지연·메모리 순서입니다. A는(0.20,10ms,4GB), B는(0.22,12ms,5GB), C는(0.18,15ms,3GB), D는(0.16,9ms,18GB)라고 합시다. 모두 작을수록 좋고 같은 측정 조건입니다. (가정)</p><p>
            메모리는 16GB 이하, 지연은 100ms 이하가 필수라고 정합니다. D는 메모리 때문에 제외됩니다. A는 B보다 세 값이 모두 작습니다. C는 A보다 손실과 메모리가 좋지만
            지연은 길어 A와 C가 함께 남습니다. (가정)
          </p></div></section>

<section id="inside-objectives" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 목표값과 허용 여부와 선호를 다른 칸에 둡니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>각 측정값의 단위와 방향을 기록합니다. 손실·지연·메모리는 이번 예에서 모두 최소화하지만 처리량처럼 큰 값이 좋은 지표도 있습니다. 비교 전에 그 방향을 맞춥니다.</p><p>16GB 한도와 더 적은 메모리를 선호하는 것은 다른 역할입니다. 한도는 후보를 사용할 수 있는지 정하고 목표값은 사용할 수 있는 후보 사이의 차이를 보여 줍니다. 숫자가 좋은 다른 축으로 필수 위반을 상쇄하지 않습니다.</p></div></section>

<section id="why-separate" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 0.18과 15와 3을 더하면 단위 선택이 결과를 바꿉니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            손실과 밀리초와 기가바이트를 근거 없이 더하면 단위를 바꾸는 것만으로 순위가 달라질 수 있습니다. 지연 15ms를 0.015초로 쓰면 실제 모델은 같은데 합산 숫자가 크게
            바뀝니다. (가정)
          </p><p>가중 합을 쓰려면 단위와 척도, 교환할 수 있는 가치에 대한 근거를 정합니다. 그 선택 전에 각 목표를 나란히 보관하면 한 축의 개선 때문에 다른 축에서 무엇을 포기하는지 확인할 수 있습니다.</p></div></section>

<section id="pareto-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 목표와 지배와 남은 경계에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>작게 또는 크게 만들 평가량이 objective입니다. 모든 목표에서 나쁘지 않고 적어도 하나에서 더 좋은 관계가 dominance이며 다른 후보에 지배되지 않은 집합이 Pareto frontier입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Hard constraint", "description": "위반하면 사용할 수 없는 사전 조건입니다.", "boundary": "이번16GB와100ms 조건은 선호 가중치가 아닙니다."}, {"term": "Trade-off", "description": "한 목표를 개선하는 대신 다른 목표를 악화시키는 상충 관계입니다.", "boundary": "A와 C처럼 둘 다 남는 이유이며 자동 우승자를 뜻하지 않습니다."}, {"term": "Selection receipt", "description": "측정 조건과 최종 선택의 기준·결과를 연결한 기록입니다.", "boundary": "후보 경계와 제품의 선택 정책을 따로 보존합니다."}]} /><ParetoSelectionViz /></section>

<section id="dominance" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. A와 B의 각 축을 비교해 모두 통과하는지 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            A와 B를 비교하면 0.20≤0.22,10≤12,4≤5이고 엄격히 작은 축도 있습니다. 따라서 A가 B를 지배합니다. A와 C에서는 10≤15는 맞지만 0.20≤0.18은
            거짓이므로 A가 C를 지배하지 않습니다. (가정)
          </p><p>
            C도 15≤10을 만족하지 않아 A를 지배하지 않습니다. 모든 값이 완전히 같은 두 후보는 엄격히 작은 축이 없어 서로를 지배하지 않습니다. 아래 식은 오차 허용폭을 넣지 않은
            표준 정의입니다.
          </p></div><ExplainedFormula
          question="Minimize objectives에서 configuration a가 b를 지배한다는 뜻은 무엇인가요?"
          idea={
            <p>
              a가 모든 목표에서 b보다 크지 않고 적어도 한 목표에서는 엄격히 작아야 합니다. 한 축이라도 나쁘면 둘은 trade-off입니다.
            </p>
          }
          formula={String.raw`a\prec b\iff(\forall k, f_k(a)\le f_k(b))\land(\exists j,f_j(a)<f_j(b))`}
          annotatedFormula={String.raw`\begin{aligned}g_k&=\underbrace{\mathbf1[f_k(a)\le f_k(b)]}_{\text{k축에서 나쁘지 않음}}\\s_k&=\underbrace{\mathbf1[f_k(a)<f_k(b)]}_{\text{k축에서 엄격히 작음}}\\G&=\underbrace{\prod_kg_k}_{\text{모든 축을 AND로 결합}}\\S&=\underbrace{\sum_ks_k}_{\text{엄격히 작은 축의 수}}\\a\prec b&\iff\underbrace{(G=1)\land(S\ge1)}_{\text{dominance 판정}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`f_k(a)\le f_k(b)`,
              annotation: [
                "같은 방향인 두 후보의 k번째 값을 비교해",
                "a가 더 크지 않은지 판정",
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
                "엄격히 작은 목표 수를 더해",
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
              symbol: String.raw`a\prec b`,
              name: "a dominates b",
              description: "b가 별도의 trade-off를 제공하지 않는 관계입니다.",
            },
          ]}
          assumptions={[
            "모든 objectives의 방향과 단위가 명시되어 있습니다.",
            "Hard constraints를 먼저 통과한 후보끼리 비교합니다.",
            "같은 hardware·batch·measurement protocol을 사용합니다.","이 식은 허용폭을 넣지 않은 표준 Pareto 지배입니다. 측정 불확실성과 작은 차이의 실용적 의미는 별도 검토합니다.",
          ]}
          interpretation="A(.20 loss,10ms,4GB)는 B(.22,12ms,5GB)를 지배합니다. C(.18,15ms,3GB)는 더 정확하지만 느려 A와 서로 지배하지 않습니다."
        /></section>

<section id="paper-multiobjective-optuna" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 공식 문서도 모든 축과 적어도 한 축을 함께 검사합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            Optuna 4.5.0의 best_trials 문서는 다른 실행에 지배되지 않은 실행을 돌려준다고 설명합니다. 최소화 방향으로 맞춘 값에 대해 모든 축의 이하 조건과 적어도 한
            축의 미만 조건을 함께 요구합니다.
          </p></div><div id="source-pareto-all-any" className="mt-8 scroll-mt-20"><CitationBlock source="Optuna 4.5.0 — Study.best_trials" citeKey={1} href="https://optuna.readthedocs.io/en/v4.5.0/reference/generated/optuna.study.Study.html#optuna.study.Study.best_trials"><q><code>all(v0 &lt;= v1) for v0, v1 in zip(t0.values, t1.values)</code><br /><code>any(v0 &lt; v1) for v0, v1 in zip(t0.values, t1.values)</code></q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>t0에 A, t1에 B를 넣으면 세 이하 비교와 세 미만 비교가 모두 참입니다. A와 C에서는 이하 비교 중 하나가 거짓이므로 A가 C를 지배하지 않습니다. 실제 코드처럼 실행할 식을 새로 작성한 것이 아니라 문서에 실린 정의 표기 두 부분의 원문 발췌입니다. (가정)</p></div></div><div id="source-pareto-directions" className="mt-8 scroll-mt-20"><CitationBlock source="Optuna 4.5.0 — Multi-objective optimization tutorial" citeKey={1} href="https://optuna.readthedocs.io/en/v4.5.0/tutorial/20_recipes/002_multi_objective.html"><q><code>study = optuna.create_study(directions=["minimize", "maximize"])</code></q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>공식 예제는 반환 순서가 FLOPS와 정확도여서 첫째는 최소, 둘째는 최대입니다. 우리 사례의 손실·지연·메모리는 모두 최소화해야 합니다. 이 원문 줄을 그대로 사용하면 목표 개수와 방향부터 다른 문제가 됩니다.</p></div></div></section>

<section id="uncertainty" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 반복 10회 중 6회인 관계는 관측 0.6으로 보고합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            A와 B를 같은 절차로 열 번 반복 측정했는데 여섯 번만 A가 지배했다고 합시다. 지배 여부를 1 또는 0으로 적고 더하면 6, 반복 수로 나누면 0.6입니다. 한 번의 작은
            차이만으로 후보를 영구히 버릴 근거가 충분한지 다시 확인합니다. (가정)
          </p><p>
            학습 seed의 변동과 시스템 부하의 변동은 다른 원인입니다. 같은 입력·장치·배치·계측 경계를 고정하고 어느 조건을 반복했는지 기록합니다. 열 번의 비율이 미래에도 정확히
            60%라는 뜻은 아닙니다.
          </p></div><ExplainedFormula
          question="반복 측정에서 a가 b를 안정적으로 지배하는 비율은 어떻게 보나요?"
          idea={
            <p>
              각 repeat에서 앞서 정의한 표준 dominance가 성립하면 1을 기록하고 전체 repeats의 평균을 냅니다.
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
            "작은 R의 비율을 확정적 probability처럼 해석하지 않습니다.","R>0이며 반복마다 같은 지배 규칙을 사용합니다. 반복들이 독립인지는 이 기술적 비율만으로 판단하지 않습니다.",
          ]}
          interpretation="10회 중 6회만 A가 B를 지배하면 frontier에서 B를 즉시 제거하기보다 두 후보의 uncertainty와 slice trade-off를 더 확인합니다."
        /></section>

<section id="tolerance-boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 허용폭을 넣은 비교는 순환할 수도 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            작은 차이를 무시하는 실용적 비교와 표준 지배를 섞지 않습니다. 모든 축에서 a≤b+1이고 적어도 한 축에서 a가 b보다 1을 초과해 작으면 좋다고 부르는 별도 규칙을 생각해
            봅시다. (가정)
          </p><p>
            같은 단위의 세 목표에서 X=(0,1,2),Y=(2,0,1),Z=(1,2,0)을 둡니다. 이 완화 규칙에서는 X가 Y보다 좋고 Y가 Z보다 좋으며 Z가 X보다 좋다고 나옵니다.
            각 비교에서 나쁜 축은 1까지 허용되고 좋은 축은 2 좋아지기 때문입니다. 세 후보를 모두 지워 버리면 안 됩니다. (가정)
          </p><p>허용폭에 관한 판단은 반복 분포와 후보 쌍의 근거로 따로 보고합니다. 표준 지배식의 정확한 정의와 같은 순서 관계라고 가정하지 않으며 어떤 근사 경계를 쓰는지 별도 규칙을 명시합니다.</p></div></section>

<section id="selection-receipt" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 남은 A와 C 중 선택한 이유를 따로 적습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            제품 정책을 사전에 “80ms 안에서 손실이 가장 작은 후보”로 정했다고 합시다. A와 C는 모두 통과하며 0.18인 C를 고릅니다. 더 빠른 응답이 우선인 정책이었다면 선택이
            달라질 수 있습니다. 경계 자체가 제품의 선호를 대신하지 않습니다. (가정)
          </p><p>기록에는 목표 방향·단위·필수 한도·측정 장치와 입력·반복 결과·정확한 경계의 버전·최종 선택 기준과 되돌릴 후보를 남깁니다. 선택에 쓴 자료와 독립적인 평가의 역할도 구별합니다.</p></div><ContentBoundary article="multi-objective-hpo" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 모든 면의 우열과 실제 선택을 나누어 보았나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>A가 B를 지배해도 C까지 지배하지 못하는 축은 무엇인가요? (답: 7절)</p><p>
            허용폭 1의 비교에서 X→Y→Z→X가 되면 세 후보를 전부 지워도 되나요? (답: 10절)
          </p><p>80ms 안에서 손실이 가장 작은 후보를 고르는 사전 정책은 A와 C 중 누구를 선택하나요? (답: 11절)</p></div></section></div>; }
