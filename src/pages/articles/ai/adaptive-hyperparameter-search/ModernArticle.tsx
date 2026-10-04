import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { AdaptiveSearchViz } from "../hyperparameter-tuning/viz/ModernHpoViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 앞서 해 본 결과로 다음 시도를 고릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>학습 설정을 바꾸어 여러 번 실행할 때 앞의 결과를 버리고 계속 무작위로만 고를 필요는 없습니다. 어떤 설정에서 좋은 결과가 나왔는지 기록하면 다음에 살펴볼 곳을 더 구체적으로 정할 수 있습니다.</p><p>
            이 글은 네 번의 완료 결과를 두 무리로 나누고 아직 실행하지 않은 두 후보를 비교합니다. 다음 시도를 고르는 점수가 실제 모델 성능과 어떻게 다른지 살펴봅니다.
          </p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 이력을 읽고 후보를 골라 실제 결과를 되돌립니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 조건에서 얻은 설정과 결과를 보관합니다. 좋은 결과 근처와 나머지 결과 근처를 비교해 다음 후보를 제안합니다. 제안한 설정을 실제로 학습하고 평가한 뒤 성공·중단·실패 상태와 함께 이력에 더합니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>비교 가능한 실행 결과를 모은다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>좋았던 설정과 나머지를 나눈다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>다음에 볼 설정을 제안한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>실제 실행 결과와 상태를 되돌린다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 손실 네 개를 나눈 뒤 두 후보를 비교합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 자료와 같은 학습량에서 네 설정의 손실이 0.40·0.25·0.20·0.35였다고 합시다. 작을수록 좋으며 경계 0.30보다 작은 0.25와 0.20을 좋은 두 관측으로 분류합니다. 다른 두 관측은 나머지 무리입니다. (가정)</p><p>이 무리에서 설정의 분포를 추정한 결과 후보 P의 두 밀도 값이 0.30과 0.05, Q의 값이 0.20과 0.10이라고 추가로 가정합니다. 비율은 P가 6, Q가 2이므로 이 규칙은 P를 먼저 살펴봅니다. 밀도 값은 네 손실만으로 계산되는 값이 아니라 설정 위치와 추정 방법까지 필요한 가정입니다. (가정)</p></div></section>

<section id="inside-history" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 설정과 점수와 점수가 생긴 상태를 함께 남깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>이력의 각 행에는 설정, 관측 점수, 학습량과 실행 상태가 필요합니다. 마지막 손실이 없는 경우에도 중간에 잘려 멈춘 것인지, 자원이 부족해 실패한 것인지, 아직 실행 중인지를 구별해야 합니다.</p><p>
            비교 자료나 학습량이 달랐다면 점수 차이가 설정 때문인지 실험 조건 때문인지 분리하기 어렵습니다. 네 완료 결과는 같은 평가 조건에서 왔다고 고정하고 제안 시점에 무엇을 알고
            있었는지도 기록합니다.
          </p></div></section>

<section id="why-state" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 실패한 실행에 가짜 나쁜 점수를 붙이지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>메모리 부족으로 끝난 실행에는 최종 성능이 관측되지 않았을 수 있습니다. 이를 임의의 큰 손실로 바꾸면 자원 실패와 성능을 한 숫자로 섞게 됩니다. 원래 상태와 원인을 보존하고 탐색기가 그 상태를 어떻게 쓰는지 별도로 정합니다.</p><p>실행 중인 후보의 미래 결과도 지금의 이력에 넣을 수 없습니다. 여러 작업자가 같은 시점의 정보로 움직이면 비슷한 후보를 동시에 고를 수 있으므로 완료 순서와 동시 실행 상태가 제안 경로에 영향을 줍니다.</p></div></section>

<section id="search-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 관측 이력과 근사 모델과 다음 실행 가치에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>지금까지 관측한 기록이 history, 설정과 결과의 관계를 근사한 내부 모델이 surrogate입니다. 다음 후보를 평가할 가치를 매기는 규칙은 acquisition입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Proposal", "description": "실제로 실행할 다음 설정의 제안입니다.", "boundary": "제안 점수가 실제 평가 결과는 아닙니다."}, {"term": "TPE", "description": "Tree-structured Parzen Estimator로 좋은 결과와 나머지 결과에서 설정의 분포를 따로 추정하는 방법입니다.", "boundary": "자료와 추정 모형에 의존하는 제안 방법이며 인과적 중요도 분석이 아닙니다."}, {"term": "Trial state", "description": "완료·중단·실패·실행 중 같은 실행 상태입니다.", "boundary": "Optuna의 실제 실행 중 상태 이름은 RUNNING이며 PENDING은 대기 상태를 가리키는 일반 설명입니다."}, {"term": "Study", "description": "하나의 탐색 작업과 관측 이력을 묶습니다.", "boundary": "상태와 제안 규칙은 사용한 버전에서 확인합니다."}, {"term": "Trial", "description": "설정 하나를 실제로 평가하는 실행입니다.", "boundary": "상태와 제안 규칙은 사용한 버전에서 확인합니다."}, {"term": "Sampler", "description": "이력을 읽고 다음 설정을 제안합니다.", "boundary": "상태와 제안 규칙은 사용한 버전에서 확인합니다."}, {"term": "Pruner", "description": "중간 관측에 따라 조기 중단을 제안합니다.", "boundary": "상태와 제안 규칙은 사용한 버전에서 확인합니다."}, {"term": "Storage", "description": "여러 작업자가 공유할 이력을 보관합니다.", "boundary": "상태와 제안 규칙은 사용한 버전에서 확인합니다."}]} /><AdaptiveSearchViz /></section>

<section id="proposal-loop" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 네 완료 관측을 읽은 시점의 제안을 추적합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>이번 단순 계산은 네 완료 관측만으로 두 분포를 만들었다고 둡니다. 다섯 번째가 조기 중단되고 여섯 번째가 실패했으며 일곱 번째가 실행 중이라면 상태 자체는 모두 보존합니다. 실제 탐색기가 중단된 중간값을 사용하는지는 그 버전의 정책에 달렸습니다.</p><p>현재의 두 후보에서 P의 제안 값은 6, Q는 2이므로 P를 먼저 실행하도록 고릅니다. 실제 실행에서 P가 더 나쁠 수도 있으므로 새 결과를 받아야 이력이 갱신됩니다. 식의 argmax는 이상화한 규칙이며 구현이 모든 가능한 설정의 전역 최댓값을 정확히 찾는다는 약속은 아닙니다.</p></div><ExplainedFormula
          question="과거 관측이 다음 configuration으로 어떻게 이어지나요?"
          idea={
            <p>
              비교 가능한 trial rows를 history로 묶고 현재 surrogate가 계산한 acquisition이 큰 feasible configuration을 선택합니다.
            </p>
          }
          formula={String.raw`\mathcal H_t=\{(\lambda_i,y_i,s_i)\}_{i=1}^t,\quad \lambda_{t+1}=\arg\max_{\lambda\in\Lambda_{\rm feasible}}a_t(\lambda\mid\mathcal H_t)`}
          annotatedFormula={String.raw`\begin{aligned}h_i&=\underbrace{(\lambda_i,y_i,s_i)}_{\text{trial 한 행}}\\\mathcal H_t&=\underbrace{\{h_1,\ldots,h_t\}}_{\text{제안 시점 history}}\\a_\lambda&=\underbrace{\operatorname{value}(\lambda\mid\mathcal H_t)}_{\text{다음 실행 가치}}\\\lambda_{t+1}&=\underbrace{\arg\max_{\lambda\in\Lambda_F}a_\lambda}_{\text{feasible 최고 후보 선택}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\{(\lambda_i,y_i,s_i)\}_{i=1}^{t}`,
              annotation: [
                "각 trial의 설정·관측·상태를 모아",
                "제안 시점의 evidence table 생성",
              ],
            },
            {
              expression: String.raw`\operatorname{value}(\lambda\mid\mathcal H_t)`,
              annotation: [
                "후보와 지금까지의 history를 결합해",
                "다음 실행의 활용·탐색 가치 계산",
              ],
            },
            {
              expression: String.raw`\arg\max_{\lambda\in\Lambda_{\rm feasible}}a_t(\lambda)`,
              annotation: [
                "constraint를 통과한 후보만 비교해",
                "다음 configuration 반환",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\mathcal H_t`,
              name: "Observed history",
              description: "t개 관측이 기록된 뒤 다음 후보를 제안할 때 보이는 이력입니다.",
            },
            {
              symbol: String.raw`s_i`,
              name: "Trial state",
              description: "완료·중단·실패·실행 중 상태입니다.",
            },
            {
              symbol: String.raw`a_t`,
              name: "Acquisition",
              description: "다음 실행의 가치를 매기는 sampler 규칙입니다.",
            },
            {
              symbol: String.raw`\Lambda_{\rm feasible}`,
              name: "Feasible space",
              description:
                "Type·branch·resource constraint를 통과한 후보입니다.",
            },
          ]}
          assumptions={[
            "각 score가 같은 validation fixture와 resource에서 비교 가능합니다.",
            "Parallel workers는 pending 결과를 보지 못한 채 여러 후보를 제안할 수 있습니다.",
            "Retry는 새 attempt로 남겨 failure history를 보존합니다.","argmax는 이상화된 선택 규칙입니다. 실제 sampler는 유한 후보 중 비교하거나 확률적으로 제안할 수 있습니다.","실행 불가능한 하드 제약은 제안 공간과 실행 전 검사로 별도 적용합니다.",
          ]}
          interpretation="완료 4개 관측을 본 상태에서 P의 비율 6과 Q의 비율 2를 비교해 P를 먼저 평가합니다. 이 가정의 선택은 P의 실제 손실을 알아냈다는 뜻이 아닙니다."
        /></section>

<section id="tpe" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 좋은 관측에서의 밀도를 나머지 밀도로 나눕니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>최소화 문제에서 y*=0.30보다 작은 손실의 설정으로 l을 만들고 나머지로 g를 만듭니다. 후보 P의 l/g=0.30/0.05=6은 Q의 0.20/0.10=2보다 큽니다. 단지 좋은 무리에서 흔하다는 것만이 아니라 다른 무리에서 얼마나 흔한지도 함께 비교합니다. (가정)</p><p>이 예에서 l과 g는 연속 설정 공간의 밀도입니다. 한 점의 밀도 0.30을 성공 확률 30%라고 읽지 않습니다. 분모 g가 양수인 곳에서 비율을 계산하며 관측이 적을 때의 추정 불안정성과 밀도 추정의 보정 방법도 고려합니다.</p></div><ExplainedFormula
          question="TPE의 density ratio는 왜 다음 후보를 고르는 데 쓰이나요?"
          idea={
            <p>
              관측 score를 quantile로 나눈 뒤 good trials의 configuration
              density와 나머지 density를 따로 추정합니다. Good에서 흔하면서
              other에서 드문 위치가 더 큰 비율을 얻습니다.
            </p>
          }
          formula={String.raw`\ell(\lambda)=p(\lambda\mid y<y^*),\quad g(\lambda)=p(\lambda\mid y\ge y^*),\quad \rho(\lambda)=\ell(\lambda)/g(\lambda)`}
          annotatedFormula={String.raw`\begin{aligned}G_i&=\underbrace{\mathbf1[y_i<y^*]}_{\text{good 관측 표시}}\\\ell_\lambda&=\underbrace{p(\lambda\mid G_i=1)}_{\text{good의 후보 밀도}}\\g_\lambda&=\underbrace{p(\lambda\mid G_i=0)}_{\text{other의 후보 밀도}}\\\rho_\lambda&=\underbrace{\frac{\ell_\lambda}{g_\lambda}}_{\text{good 대 other 비율}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\{i:y_i<y^*\}`,
              annotation: [
                "score threshold로 관측을 나눠",
                "good cohort의 index를 생성",
              ],
            },
            {
              expression: String.raw`p(\lambda\mid i\in\mathcal G)`,
              annotation: [
                "good cohort만 조건으로 걸어",
                "후보 configuration의 local density 추정",
              ],
            },
            {
              expression: String.raw`\ell(\lambda)/g(\lambda)`,
              annotation: [
                "good density를 other density로 나눠",
                "양쪽에서 모두 흔한 영역의 점수를 낮춤",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`y^*`,
              name: "Quantile threshold",
              description:
                "Good과 other observations를 나누는 score 경계입니다.",
            },
            {
              symbol: String.raw`\ell`,
              name: "Good density",
              description: "좋은 cohort에서 configuration이 나타날 밀도입니다.",
            },
            {
              symbol: "g",
              name: "Other density",
              description:
                "나머지 cohort에서 configuration이 나타날 밀도입니다.",
            },
            {
              symbol: String.raw`\rho`,
              name: "Density ratio",
              description: "두 밀도를 비교한 proposal preference입니다.",
            },
          ]}
          assumptions={[
            "Minimization 표기이며 maximization에서는 good 부등호가 바뀝니다.",
            "초기 관측이 적거나 noisy하면 density가 불안정합니다.","비율을 계산하는 곳에서 g(λ)>0을 가정합니다. 연속 밀도 값은 한 점의 성공 확률이 아닙니다.",
            "실제 구현에는 prior·candidate count·multivariate option이 더 있습니다.",
          ]}
          interpretation="가정한 P의 l=0.30, g=0.05는 비율 6이고 Q의 l=0.20, g=0.10은 비율 2입니다. P를 먼저 시험하지만 어느 후보의 실제 손실도 이 비율만으로 알 수 없습니다."
        /></section>

<section id="paper-tpe" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 원문의 개선 기대값 식에 비율 6과 2를 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Bergstra 등의 2011 논문 §4 식 (2)는 손실 경계로 나눈 두 설정 분포를 정의합니다. §4.1은 이 분포 모형 아래 개선 기대값을 비교하면 l/g가 큰 후보를 선호하는 이유를 유도합니다.</p></div><div id="source-tpe-ei" className="mt-8 scroll-mt-20"><CitationBlock source="Algorithms for Hyper-Parameter Optimization §4.1, PDF p.4" citeKey={1} href="https://papers.nips.cc/paper_files/paper/2011/file/86e8f7ab32cfd12577bc2619bc635690-Paper.pdf"><q>EI ∝ (γ + (g(x)/l(x))(1 − γ))⁻¹</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>이 사례처럼 좋은 무리 비중 γ=0.5를 놓습니다. P에서는 1/(0.5+0.5/6)=12/7≈1.7143, Q에서는 1/(0.5+0.5/2)=4/3≈1.3333이므로 P가 큽니다. 공통 비례상수를 생략한 비교 값이며 손실이 1.7143 줄어든다는 뜻은 아닙니다. 실제 개선은 실행 후에만 압니다. (가정)</p></div></div></section>

<section id="paper-optuna" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 공식 구현의 초기 관측과 제약 처리까지 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Optuna 4.5.0 TPESampler 공식 문서는 l(x)/g(x)를 크게 만드는 후보를 고른다고 설명합니다. 같은 버전의 기본 n_startup_trials는 10이므로 완료 관측 네 개만 놓은 위 계산을 기본 설정의 실제 실행 결과라고 부르면 안 됩니다. 위 숫자는 TPE의 비교 원리를 보여 주는 가정입니다.</p><p>Study는 탐색 작업과 이력을 묶고 Trial은 실행 한 건을 가리킵니다. Sampler는 다음 제안을 담당합니다. 조기 중단을 제안하는 Pruner와 이력을 공유하는 Storage도 별도 역할입니다. 원 Optuna 논문의 define-by-run 설계와 현재 버전의 세부 기본값은 구별합니다.</p></div><div id="source-optuna-ratio" className="mt-8 scroll-mt-20"><CitationBlock source="Optuna 4.5.0 — TPESampler" citeKey={1} href="https://optuna.readthedocs.io/en/v4.5.0/reference/samplers/generated/optuna.samplers.TPESampler.html"><q>maximizes the ratio l(x)/g(x)</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>P의 비율 6과 Q의 비율 2를 비교하는 부분은 이 공식 역할과 대응합니다. 실제 라이브러리 출력까지 재현하려면 검색 공간·초기 관측·seed·후보 샘플 수·동시 실행 조건을 함께 고정해야 합니다.</p></div></div><div id="paper-optuna-design" className="mt-8 scroll-mt-20"><CitationBlock source="Optuna 2019 — Abstract" citeKey={1} href="https://arxiv.org/abs/1907.10902"><q>define-by-run</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>실행 코드에서 조건에 따라 탐색 공간을 정의하는 설계입니다. 위의 두 후보와 가정한 밀도 계산이 모든 조건부 공간이나 현재 기본값을 대표한다는 뜻은 아닙니다.</p></div></div></section>

<section id="parallel-boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 제안의 제약과 실제 실행 가능성을 따로 검사합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>4.5.0의 constant_liar 옵션은 실행 중 후보 근처를 피하도록 벌점을 줍니다. 그러나 실제 완료 결과를 미리 아는 것은 아니며 작업 종료 순서가 바뀌면 제안도 달라질 수 있습니다. 재시도는 새 실행으로 남겨 원래 실패 이력을 보존합니다.</p><p>constraints_func는 성공한 trial 뒤에 제약값을 평가하는 API입니다. 이것만으로 불가능한 자원 요청이 실행 전에 차단된다고 보장할 수 없습니다. 타입·분기·자원 같은 반드시 지켜야 할 조건은 제안 공간과 실행 전 검사에도 둡니다.</p><p>네 관측의 밀도가 안정적이라는 보장은 없습니다. 탐색 중 가장 좋았던 점수에는 선택 효과도 있으므로 최종 후보를 정한 뒤 별도 평가가 필요합니다. 비교 조건과 이력 보존은 탐색을 해석할 출발점이며 최적 설정의 증명은 아닙니다.</p></div><span id="boundary" className="scroll-mt-20" /><ContentBoundary article="adaptive-hyperparameter-search" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 제안 값과 실제 성능을 구분할 수 있나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>P의 두 밀도가 0.30·0.05이고 Q가 0.20·0.10이면 어느 후보를 먼저 시험하나요? (답: 8절)</p><p>Optuna 4.5.0 기본 설정에서 완료 관측 네 개로 만든 예를 실제 TPE 출력이라고 해도 될까요? (답: 10절)</p><p>constraints_func를 지정했으니 실행 불가능한 설정이 항상 사전에 차단된다고 보장할 수 있나요? (답: 11절)</p></div></section></div>; }
