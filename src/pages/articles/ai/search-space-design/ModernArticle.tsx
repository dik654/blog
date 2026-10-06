import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { SearchSpaceDesignViz } from "../hyperparameter-tuning/viz/ModernHpoViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 같은 범위에서도 무엇을 자주 뽑을지는 달라집니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>학습률을 작은 수부터 큰 수까지 시험하겠다는 말만으로는 실험이 정해지지 않습니다. 큰 값 근처를 대부분 시험할 수도 있고 자릿수마다 비슷한 횟수로 시험할 수도 있습니다.</p><p>이 글은 양수 하나를 뽑는 규칙부터 시작합니다. 그 값에 학습 방법별 선택 사항과 메모리 조건을 붙여 실행 가능한 후보를 제안하는 과정을 살펴봅니다.</p></div><p className="font-semibold">그림을 보기 전에 세 가지를 예측해 보세요.</p><ol className="list-decimal space-y-2 pl-6"><li>1e−5와 1e−1 사이 로그 좌표의 중간값은 1e−3일까요?</li><li>예상 메모리 18GB 후보는 20GB 상한을 통과하고 22GB 후보는 탈락할까요?</li><li>SGD에서만 쓰는 momentum을 모든 optimizer 분기에 0으로 채워도 조건부 공간과 같은 뜻일까요?</li></ol><p>답은 <strong>예, 예, 아니요</strong>입니다. 값의 좌표·활성 분기·자원 제약을 함께 기록해야 실제로 제안된 후보 분포를 해석할 수 있습니다.</p><SearchSpaceDesignViz /><ContentBoundary article="search-space-design" /></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 값의 모양과 뽑는 비중을 정하고 필요한 항목만 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>정수인지 실수인지 선택 항목인지 먼저 정합니다. 범위 안에서 뽑는 비중을 정한 뒤 상위 선택에 필요한 하위 값만 만듭니다. 마지막으로 서로 맞는 조합인지와 자원 한도를 검사합니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>값의 종류와 단위를 정한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>어느 크기를 얼마나 자주 뽑을지 정한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>선택한 방법에 필요한 항목만 만든다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>조합과 예상 자원을 검사한다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 같은 중간 위치가 0.001과 0.050005로 갈립니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            학습률 범위를 0.00001부터 0.1까지 놓습니다. 두 끝의 숫자를 보통 평균내면 0.050005입니다. 그러나 10배 커지는 구간 네 개를 같은 비중으로 보고 중간 위치를
            고르면 0.001입니다. 두 값 모두 범위 안이지만 시험을 배분하는 방식이 다릅니다. (가정)
          </p><p>
            같은 규칙으로 만든 후보 P는 SGD와 momentum0.9를 쓰며 예상 메모리는 18GB입니다. 후보 Q는 예상 22GB입니다. 허용 상한 20GB에서 P는 사전 검사를
            통과하고 Q는 제외합니다. 이 예상값은 실제 측정치가 아닙니다. (가정)
          </p></div></section>

<section id="inside-space" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 한 숫자에도 형태·범위·비중·조건을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>학습률은 양의 실수, 깊이는 정수, 학습 방법은 정해진 목록 중 선택이라고 적습니다. 깊이의 실수를 뽑아 단순 반올림하면 끝값의 확률이 달라질 수 있으므로 정수 생성 규칙을 따로 둡니다.</p><p>
            SGD를 고를 때만 momentum을 생성하도록 정했다면 다른 분기에는 그 항목이 없습니다. 존재하지 않는 값을 0으로 채우면 실제 momentum0을 선택한 경우와 구별하기
            어렵습니다. (가정)
          </p></div></section>

<section id="why-scale" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 아무 조합이나 늘리면 같은 예산으로 보는 곳이 바뀝니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            보통 균등 추첨에서는 0.01~0.1 구간의 길이가 0.00001~0.0001보다 1,000배 깁니다. 앞의 큰 값 구간에 그만큼 더 많은 추첨 비중이 갑니다. 곱셈 비율을
            비교하고 싶다면 그 차이를 의도한 것인지 확인해야 합니다. (가정)
          </p><p>사용되지 않는 선택 사항까지 모든 분기에 붙이면 실제 실행은 같은데 설정 기록만 다른 후보가 생깁니다. 범위를 넓히거나 무효 조합을 늘리면 좋은 후보에 돌아갈 비중도 달라집니다. 넓은 범위 자체가 좋은 탐색을 보장하지 않습니다.</p></div></section>

<section id="space-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 값의 형태와 좌표와 존재 조건에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>값이 정수·실수·목록 중 어느 것인지가 type입니다. 곱셈 비율을 고르게 보려고 로그 좌표를 쓰는 것이 log scale이고 상위 선택에 따라 하위 값을 여는 규칙이 conditional space입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Log-uniform", "description": "로그 좌표에서 같은 길이 구간에 같은 확률을 주는 분포입니다.", "boundary": "로그 축을 쓰는 모든 탐색기가 균등 추첨을 하는 것은 아닙니다."}, {"term": "Hard constraint", "description": "반드시 만족해야 하는 조합·자원 규칙입니다.", "boundary": "예상 메모리의 통과와 실제 실행 중 한도 준수는 구별합니다."}, {"term": "Search-space revision", "description": "값의 형태·범위·분기·제약을 고정한 개정 번호입니다.", "boundary": "범위를 바꾸면 이전 후보들이 나온 분포도 함께 기록합니다."}]} /></section>

<section id="scale" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 로그 좌표의 절반을 원래 크기로 돌립니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            10을 밑으로 쓰면 두 끝의 좌표는−5와−1입니다. 상대 위치u=0.5를 넣으면−5+0.5×4=−3이고 원래 단위로 돌아온 값은 10⁻³=0.001입니다. 자연로그와 exp를
            써도 같은 값을 얻습니다. (가정)
          </p><p>
            네 자릿수 구간은 모두 같은 로그 길이이므로 균등 추첨에서 각각 25%입니다. 이 계산은 양의 범위와 균등 로그 추첨이라는 가정에 의존합니다. 0과 음수에는 같은 로그 변환을
            그대로 쓸 수 없습니다.
          </p></div><ExplainedFormula
          question="a와 b 사이의 각 order of magnitude에 같은 sampling 비중을 주려면 어떻게 하나요?"
          idea={
            <p>
              0과 1 사이 위치를 뽑고 log a와 log b 사이로 옮긴 뒤 exp로 원래
              단위에 되돌립니다.
            </p>
          }
          formula={String.raw`u\sim U(0,1),\quad \lambda=\exp(\log a+u(\log b-\log a))`}
          annotatedFormula={String.raw`\begin{aligned}u&\sim\underbrace{\operatorname{Uniform}(0,1)}_{\text{log interval 안의 위치를 고르게 선택}}\\z&=\underbrace{\log a+u(\log b-\log a)}_{\substack{\text{unit interval을}\text{log a부터 log b까지 이동·확대}}}\\\lambda&=\underbrace{\exp(z)}_{\text{log 좌표를 원래 parameter 단위로 복원}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{Uniform}(0,1)`,
              annotation: ["0과 1 사이의 위치를", "같은 확률로 선택"],
            },
            {
              expression: String.raw`\log a+u(\log b-\log a)`,
              annotation: [
                "log 범위의 폭을 u만큼 이동해",
                "두 bounds 사이 log 좌표 생성",
              ],
            },
            {
              expression: String.raw`\exp(z)`,
              annotation: [
                "log 좌표에 지수함수를 적용해",
                "원래 크기의 parameter로 복원",
              ],
            },
          ]}
          terms={[
            {
              symbol: "a, b",
              name: "Positive bounds",
              description: "0보다 큰 lower·upper bound입니다.",
            },
            {
              symbol: "u",
              name: "Uniform position",
              description: "Log interval 안의 상대 위치입니다.",
            },
            {
              symbol: "z",
              name: "Log coordinate",
              description: "Sampling에 사용하는 log-space 값입니다.",
            },
            {
              symbol: String.raw`\lambda`,
              name: "Sampled parameter",
              description: "원래 단위로 복원된 configuration 값입니다.",
            },
          ]}
          assumptions={[
            "0<a<b이며 log 좌표에서 균등하게 뽑는 sampler를 가정합니다. log=True인 모든 적응형 제안이 균등한 것은 아닙니다.",
            "Multiplicative scale이 domain에 자연스럽습니다.",
            "Framework의 endpoint·quantization semantics를 version과 함께 기록합니다.",
          ]}
          interpretation="a=1e-5, b=1e-1이면 1e-5~1e-4와 1e-2~1e-1은 log 길이가 같아 같은 25% 확률을 가집니다."
        /></section>

<section id="conditional-space" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 활성 분기와 예상 메모리를 모두 통과해야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            P는 SGD에 필요한 momentum이 있으므로 분기 검사 1,18≤20이므로 자원 검사 1입니다. 두 값을 곱하면 1입니다. Q의 분기 구성이 맞아도 22≤20은 거짓이므로
            1×0=0으로 제외됩니다. (가정)
          </p><p>AdamW를 고르는 분기라면 이 예에서는 beta 값처럼 그 방법이 사용하는 항목만 생성합니다. 라이브러리가 허용하는 전체 인자와 이번 탐색에서 바꿀 인자는 다를 수 있으므로 실제 실행 설정도 따로 보존합니다.</p></div><ExplainedFormula
          question="Branch와 memory limit을 모두 만족하는 후보 집합은 어떻게 만드나요?"
          idea={
            <p>
              전체 configuration 중 parent-child 의미가 맞고 estimated
              resource가 hard bound 이하인 후보만 feasible set에 남깁니다.
            </p>
          }
          formula={String.raw`\Lambda_{\rm feasible}=\{\lambda\in\Lambda:c_{\rm branch}(\lambda)=1,\ \widehat m(\lambda)\le M_{\max}\}`}
          annotatedFormula={String.raw`\begin{aligned}b_\lambda&=\underbrace{\mathbf1[c_\lambda=1]}_{\text{branch 의미 통과}}\\r_\lambda&=\underbrace{\mathbf1[\widehat m_\lambda\le M_{\max}]}_{\text{memory 한도 통과}}\\q_\lambda&=\underbrace{b_\lambda r_\lambda}_{\text{두 gate를 AND로 결합}}\\\Lambda_F&=\underbrace{\{\lambda:q_\lambda=1\}}_{\text{예상 제약을 통과한 후보 집합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\mathbf1[c_{\rm branch}(\lambda)=1]`,
              annotation: [
                "configuration의 branch 의미를 검사해",
                "유효하면 binary gate 1 생성",
              ],
            },
            {
              expression: String.raw`\mathbf1[\widehat m(\lambda)\le M_{\max}]`,
              annotation: [
                "resource estimate를 hard limit과 비교해",
                "예상 자원 gate 생성",
              ],
            },
            {
              expression: String.raw`b(\lambda)r(\lambda)`,
              annotation: [
                "두 binary gates를 곱해",
                "모든 조건을 통과한 경우만 1 유지",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`c_{\rm branch}`,
              name: "Branch rule",
              description: "Parent-child parameter 조합의 의미 유효성입니다.",
            },
            {
              symbol: String.raw`\widehat m`,
              name: "Resource estimate",
              description: "Configuration의 예상 peak memory입니다.",
            },
            {
              symbol: String.raw`M_{\max}`,
              name: "Hard memory limit",
              description: "Headroom을 포함해 미리 정한 허용 상한입니다.",
            },
            {
              symbol: String.raw`\Lambda_{\rm feasible}`,
              name: "Feasible space",
              description: "모든 hard gates를 통과한 후보 집합입니다.",
            },
          ]}
          assumptions={[
            "Estimator와 실제 peak 사이 오차를 위한 headroom이 있습니다.",
            "Hard constraint와 선호 objective를 구분합니다.",
            "Constraint revision을 study history에 기록합니다.","예상값의 통과는 실제 peak가 한도 안이라는 증명이 아닙니다. 런타임 제약도 별도로 검사합니다.",
          ]}
          interpretation="예상 22GB인 후보에 20GB 상한을 적용하면 제안 전에 제외합니다. 예상 18GB였지만 실제 OOM이면 그 attempt는 FAIL evidence입니다."
        /></section>

<section id="paper-optuna-space" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 공식 예제의 범위와 로그 옵션을 구분해 읽습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            Optuna 4.5.0의 Pythonic Search Space 예제는 실수 범위와 log 옵션을 호출에 함께 적습니다. 아래는 공식 원문의 한 줄이며 상한은 이 글의 0.1과
            다른 0.01입니다.
          </p></div><div id="source-space-log" className="mt-8 scroll-mt-20"><CitationBlock source="Optuna 4.5.0 — Pythonic Search Space, floating point parameter (log)" citeKey={1} href="https://optuna.readthedocs.io/en/v4.5.0/tutorial/10_key_features/002_configurations.html"><q><code>learning_rate = trial.suggest_float("learning_rate", 1e-5, 1e-2, log=True)</code></q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            원문의 범위는 자릿수 구간이 세 개입니다. 균등 로그 추첨이라면 각 구간은 1/3입니다. 이 글의 네 구간 사례를 넣으려면 high를 1e-1로 바꾼 별도 설정이므로 각
            1/4가 됩니다. 공식 예제와 수정한 설정을 같은 원문이라고 섞지 않습니다. (가정)
          </p></div></div><div id="source-space-random" className="mt-8 scroll-mt-20"><CitationBlock source="Optuna 4.5.0 — RandomSampler" citeKey={1} href="https://optuna.readthedocs.io/en/v4.5.0/reference/samplers/generated/optuna.samplers.RandomSampler.html"><q>Sampler using random sampling.</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            25% 계산을 재현할 때는 RandomSampler처럼 무작위 추첨하는 방법까지 지정합니다. TPE는 앞 관측에 따라 같은 로그 공간 안의 제안 비중을 바꾸므로 log=True
            하나로 25%를 보장하지 않습니다.
          </p></div></div></section>

<section id="versioning" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 실제 코드의 분기는 필요한 항목만 생성합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 공식 예제는 SVC를 고른 가지에서만 svc_c를 제안합니다. SGD일 때만 momentum을 여는 앞 사례도 같은 조건부 구조를 적용한 별도 설계입니다.</p></div><div id="source-space-branch" className="mt-8 scroll-mt-20"><CitationBlock source="Optuna 4.5.0 — Pythonic Search Space, Branches" citeKey={1} href="https://optuna.readthedocs.io/en/v4.5.0/tutorial/10_key_features/002_configurations.html"><q><code>if classifier_name == "SVC":<br />&nbsp;&nbsp;&nbsp;&nbsp;svc_c = trial.suggest_float("svc_c", 1e-10, 1e10, log=True)</code></q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>classifier_name이 SVC이면 이 호출을 지나지만 RandomForest이면 지나지 않습니다. 우리 P의 SGD 선택도 같은 방식으로 momentum 항목을 열고 다른 분기에는 만들지 않습니다. 분기 이름과 수치는 서로 다른 사례이며 원문의 코드를 바꿔 인용한 것이 아닙니다.</p></div></div><div id="paper-optuna-design" className="mt-8 scroll-mt-20"><CitationBlock source="Optuna 2019 — Abstract" citeKey={1} href="https://arxiv.org/abs/1907.10902"><q>define-by-run</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>실행 코드의 조건에 따라 탐색 공간을 정의한다는 설계입니다. 상한이 반복 선택돼 공간을 넓히려면 실패 분포와 작은 사전 실험을 확인하고 새 개정 번호·범위·제안 방법을 남깁니다.</p></div></div></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 사전 검사와 실제 실행의 차이도 결과입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            P의 예상 18GB가 실제 21GB였다면 예측 오차 때문에 실행이 실패할 수 있습니다. 이 실행을 지우거나 임의의 나쁜 성능 점수로 바꾸지 않고 실제 측정과 실패 상태를
            남깁니다. 여유분과 실행 중 제한도 별도로 설계합니다. (가정)
          </p><p>무효 후보를 버리고 다시 뽑으면 최종 분포는 제약을 통과했다는 조건이 붙은 분포가 됩니다. 분기별 탈락률이 다르면 분기 비중도 달라질 수 있습니다. 원래의 추첨 비중과 실제 평가한 후보의 비중을 구별합니다.</p></div></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 좌표와 추첨법과 실행 가능성을 구별했나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>1e-5~1e-1에서 로그 좌표의 절반을 고르면 어떤 학습률이 되나요? (답: 7절)</p><p>
            log=True를 쓴 TPE도 네 자릿수 구간을 항상 25%씩 제안하나요? (답: 9절)
          </p><p>
            예상 18GB로 통과했지만 실제 21GB에서 실패한 후보는 어떻게 기록하나요? (답: 11절)
          </p></div></section></div>; }
