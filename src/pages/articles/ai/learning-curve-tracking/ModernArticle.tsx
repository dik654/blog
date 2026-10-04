import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { ProgressCoordinateViz } from "../experiment-tracking/viz/ModernExperimentViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 곡선의 높이를 보기 전에 가로축이 무엇인지 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            두 학습 실행의 손실을 비교하려고 그래프를 열었습니다. 둘 다 100번째 점이라고 해서 같은 양을 학습한 것은 아닙니다. 기록을 남긴 횟수와 실제 모델을 바꾼 횟수, 처리한
            자료의 양은 다를 수 있습니다.
          </p><p>
            이 글은 두 실행을 100만토큰 근처에 맞춰 비교합니다. 실제 관측 위치와 목표의 차이까지 남겨 더 낮은 손실을 같은 학습량의 성능으로 과장하지 않도록 합니다.
          </p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 값에 진행 좌표를 붙이고 가까운 관측을 대응시킵니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>모델을 갱신한 횟수, 처리한 양, 경과 시간을 따로 기록합니다. 평가값에 그 좌표와 계산법을 붙인 뒤 정한 목표량 근처의 관측을 고릅니다. 마지막에는 평가 자료와 모델 상태가 맞는지 확인합니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>진행 좌표를 따로 센다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>관측값과 평가 정의를 붙인다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>같은 목표량 근처를 고른다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>실제 위치 차이와 실행 근거를 보고한다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 100만토큰까지 필요한 갱신은 1000회와 250회입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            A는 한 번 갱신할 때 1,000토큰, B는 4,000토큰을 처리한다고 합시다.100만토큰에는 각각 1,000회와 250회가 필요합니다. 여기 토큰은 정해진 규칙으로 센 실제
            학습 토큰이며 매 갱신의 양이 일정하다고 가정합니다. (가정)
          </p><p>
            하지만 정확히 100만에서 기록한 값은 없었습니다. A는 102만토큰·1,020회·120초에서 손실 0.42, B는 98만토큰·245회·150초에서 0.39를 남겼습니다.
            목표에서 3만토큰까지 차이를 허용하기로 미리 정합니다. 둘 다 2만 떨어져 있어 비교 후보가 되지만 같은 정확한 위치는 아닙니다. (가정)
          </p></div></section>

<section id="inside-observation" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 점 하나에도 진행과 평가와 실행 정체를 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>각 점에 모델 상태의 식별자와 갱신 수, 처리 토큰, 경과 시간을 기록합니다. 평가 자료의 버전과 어떤 행을 포함했는지, 손실의 평균 방식도 연결합니다. loss라는 같은 이름만으로 같은 계산이라고 가정하지 않습니다.</p><p>시간에는 학습만 셌는지 평가와 저장·복구까지 포함했는지 적습니다. 여러 번 작은 묶음을 누적한 뒤 한 번 갱신했다면 기록 호출 수나 작은 묶음 수와 실제 갱신 수는 다릅니다.</p></div></section>

<section id="why-axes" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 같은 갱신 번호와 같은 진행률도 같은 자원량은 아닙니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            갱신 250회에서 A는 25만토큰, B는 100만토큰을 봅니다. 같은 번호를 비교하면 본 자료의 양이 4배 다른 효과가 섞입니다. 진행 축을 토큰으로 바꾸면 적어도 이 차이를
            드러낼 수 있습니다. (가정)
          </p><p>
            전체 예산이 200만과 2,000만토큰이면 진행률 0.5는 100만과 1,000만토큰입니다. 진행률을 같게 그렸다고 같은 자원을 쓴 것은 아닙니다. 원래의 양과 예산을 함께
            보존합니다. (가정)
          </p></div></section>

<section id="curve-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 값과 갱신 수와 처리량을 구별해 부릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>평가에서 얻은 수가 metric value이고 실제 가중치 갱신 수가 optimizer update입니다. 지금까지 소비한 표본이나 토큰의 양은 processed units입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Wall time", "description": "정한 시작 경계에서 지난 실제 시간입니다.", "boundary": "장치·입출력·평가 시간이 다르면 학습 품질과 속도를 따로 해석합니다."}, {"term": "Metric definition", "description": "자료 범위와 집계 방식·방향을 고정한 평가 정의입니다.", "boundary": "같은 이름의 점수도 가중치나 분모가 다르면 비교 조건이 다릅니다."}, {"term": "Aligned observation", "description": "목표 자원량 근처에서 정한 규칙으로 고른 관측입니다.", "boundary": "가깝다는 이유로 정확히 같은 양에서 측정했다고 쓰지 않습니다."}, {"term": "Attempt", "description": "복구와 재시도를 구별하는 실제 실행 기록입니다.", "boundary": "원래 곡선을 지우고 새 경로로 덮어쓰지 않습니다."}]} /><ProgressCoordinateViz /></section>

<section id="progress-coordinate" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 모델 진척과 소비량과 시간의 세 좌표를 남깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            두 실행의 목표 예산을 200만토큰으로 둡니다. A의 102만/200만=0.51, B의 98만/200만=0.49입니다. 진행률은 곡선을 읽는 보조 값이며 실제 토큰 수를
            대체하지 않습니다. (가정)
          </p><p>
            A의 관측은(1,020회,102만토큰,120초)에 0.42를 붙입니다. B는(245회,98만토큰,150초)에 0.39를 붙입니다. 손실 차이는 0.03이지만 시간과 위치 차이도
            함께 남겨야 합니다. (가정)
          </p></div><ExplainedFormula
          question="서로 다른 logger와 batch 설정에서도 한 metric 관측의 위치를 잃지 않으려면 무엇을 기록하나요?"
          idea={
            <p>
              관측값에 진행 좌표 세 개와 metric definition ID를 결합합니다.
              update는 학습 사건, processed units는 자원량, elapsed time은
              system 속도를 나타냅니다.
            </p>
          }
          formula={String.raw`\begin{aligned}p_k&=n_k/n_{\rm budget}\\c_k&=(u_k,n_k,t_k)\\r_k&=(c_k,m_k,d_m)\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}p_k&=\underbrace{n_k/n_{\rm budget}}_{\text{처리량을 budget 비율로 환산}}\\c_k&=\underbrace{(u_k,n_k,t_k)}_{\text{진행 좌표를 한 묶음으로}}\\r_k&=\underbrace{c_k\oplus(m_k,d_m)}_{\text{값과 정의를 함께 보존}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`n_k/n_{\rm budget}`,
              annotation: [
                "처리량을 전체 budget으로 나눠",
                "같은 단위의 기준 예산 대비 진행률 표시",
              ],
            },
            {
              expression: String.raw`(u_k,n_k,t_k)`,
              annotation: [
                "update·처리량·시간을 함께 묶어",
                "step이라는 모호한 단일 축을 제거",
              ],
            },
            {
              expression: String.raw`(m_k,d_m)`,
              annotation: [
                "값에 metric definition을 붙여",
                "동명이지만 reducer가 다른 관측을 구분",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`u_k`,
              name: "Optimizer update",
              description:
                "k번째 관측까지 완료된 실제 parameter update 수입니다.",
            },
            {
              symbol: String.raw`n_k`,
              name: "Processed units",
              description: "처리한 sample·token·frame의 누적량입니다.",
            },
            {
              symbol: String.raw`t_k`,
              name: "Elapsed time",
              description: "고정된 시작 경계부터 지난 wall-clock 시간입니다.",
            },
            {
              symbol: String.raw`m_k,d_m`,
              name: "Metric · definition",
              description:
                "관측값과 dataset slice·reducer·direction을 고정한 정의 ID입니다.",
            },
          ]}
          assumptions={[
            "하나의 이어지는 실행 경로에서 관측 순서와 좌표 의미를 보존합니다. 같은 update에 여러 평가가 있을 수 있습니다.",
            "Budget과 processed units는 같은 단위를 사용합니다.",
            "복구로 과거 상태에서 다시 출발하면 실행 분기와 소비 자원을 별도로 기록합니다. 모델 진척과 실제 누적 소비량을 섞지 않습니다.","n_budget>0이며 p를0~1로 읽으려면0≤n_k≤n_budget이어야 합니다. 예산 초과는 감추지 않습니다.",
          ]}
          interpretation="예산200만토큰이라면 A의102만은진행률0.51, B의98만은0.49입니다. A의갱신1020과 B의245, 시간120초와150초, 손실0.42와0.39를 각각 원래 좌표와 보존합니다."
        /></section>

<section id="comparison-boundary" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 가장 가까운 점을 골라도 허용폭 검사는 남습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            A에 90만의 0.43과 102만의 0.42가 있고 B에 98만의 0.39와 110만의 0.38이 있다고 합시다.100만과의 거리는 A에서 10만·2만, B에서
            2만·10만이므로 102만과 98만을 고릅니다. 둘 다 허용 3만 안이고 관측 차이는 0.03입니다. (가정)
          </p><p>
            두 관측이 같은 거리이면 더 이른 점을 고르기로 미리 정할 수 있습니다. 목표에서 10만 떨어진 점밖에 없다면 가장 가깝더라도 이번 허용폭을 넘으므로 비교를 보류합니다. 선으로
            이은 보간값은 실제 평가 결과가 아니라 추가 가정입니다.
          </p><p>실행 중 정한 하드 예산을 넘은 점은 거리 계산 전에 제외합니다. 목표 근처의 사후 분석에서 앞뒤를 모두 허용하는 규칙과 예산 안에서 달성한 성능을 묻는 규칙을 구별합니다.</p></div><ExplainedFormula
          question="Run A와 B의 logging 간격이 다를 때 어느 두 관측을 비교해야 하나요?"
          idea={
            <p>
              비교하려는 token budget에 가장 가까운 관측을 각 run에서 독립적으로 찾고 선택된 두 metric의 차이를 계산합니다.
            </p>
          }
          formula={String.raw`k_j(n^*)=\arg\min_k|n_{j,k}-n^*|,\quad \Delta=m_{A,k_A}-m_{B,k_B}`}
          annotatedFormula={String.raw`\begin{aligned}e_{j,k}&=\underbrace{|n_{j,k}-n^*|}_{\text{관측 위치와 목표 budget의 거리}}\\k_j&=\underbrace{\arg\min_k e_{j,k}}_{\text{각 run에서 가장 가까운 관측을 선택}}\\\Delta&=\underbrace{m_{A,k_A}-m_{B,k_B}}_{\text{허용폭 안 관측의 차이 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`|n_{j,k}-n^*|`,
              annotation: [
                "관측 처리량에서 목표량을 빼고 절댓값을 취해",
                "앞뒤 어느 쪽이든 가까운 정도를 거리로 변환",
              ],
            },
            {
              expression: String.raw`\arg\min_k`,
              annotation: [
                "거리 후보 중 최솟값의 index를 골라",
                "logging 간격이 다른 관측을 목표 근처에 정렬",
              ],
            },
            {
              expression: String.raw`m_{A,k_A}-m_{B,k_B}`,
              annotation: [
                "정렬된 두 관측을 빼서",
                "잔여 자원 차이를 보고하며 관측값 차이 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`n^*`,
              name: "Target budget",
              description: "비교하려는 공통 processed-unit 위치입니다.",
            },
            {
              symbol: String.raw`k_j`,
              name: "Aligned observation",
              description:
                "run j에서 target budget에 가장 가까운 관측 index입니다.",
            },
            {
              symbol: String.raw`\Delta`,
              name: "Aligned difference",
              description: "같은 자원 지점으로 정렬한 metric 차이입니다.",
            },
          ]}
          assumptions={[
            "두 run이 target budget 주변까지 실제로 학습되었습니다.",
            "관측 간격이 너무 크면 비교를 보류하거나 보간 가정을 명시합니다. 보간값은 실제 측정값이 아닙니다.","같은 거리이면 이른 관측을 고른다는 규칙을 미리 정합니다. 하드 자원 상한을 넘는 관측은 비교 집합에서 먼저 제외합니다.",
            "Evaluation dataset·checkpoint timing·metric reducer가 동일합니다.",
          ]}
          interpretation="목표100만에서 A102만과B98만은 각각2만 차이로 허용3만 안입니다. 관측 손실 차이는0.42−0.39=0.03이며 정확히100만에서의 차이라고 단정하지 않습니다."
        /></section>

<section id="standard-wandb-tracking" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 실제 API는 사용할 가로축의 이름을 받습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            W&B SDK의 고정 버전 0.19.11에서 Run.define_metric은 다른 metric의 이름을 step_metric으로 받습니다. 이 필드가 차트의 가로축을 정하며
            토큰 수를 자동 계산해 주는 것은 아닙니다.
          </p></div><div id="source-wandb-axis" className="mt-8 scroll-mt-20"><CitationBlock source="wandb v0.19.11 — wandb/sdk/wandb_run.py:L2874–2875" citeKey={1} href="https://github.com/wandb/wandb/blob/2a058902a2425bf79e5add34b30d0e9ea5e39951/wandb/sdk/wandb_run.py#L2860-L2878"><q>step_metric: The name of another metric to serve as the X-axis<br />for this metric in automatically generated charts.</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            step_metric으로 processed_tokens를 지정하고 같은 관측에 A의 1,020,000과 B의 980,000을 기록하면 loss는 그 토큰 좌표에 놓입니다.
            optimizer update1,020과 245를 가로축에 넣은 것과 다릅니다. 수집 코드가 실제로 센 값과 단위가 맞아야 합니다. (가정)
          </p></div></div></section>

<section id="logging-receipt" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 가로축 설정과 실제 평가의 근거를 함께 보관합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>같은 버전의 step_sync는 새 호출에 좌표를 쓰지 않았을 때 마지막 값을 넣을 수 있습니다. 이전 좌표가 이번 평가의 정확한 위치라고 자동으로 보장되지는 않으므로 이 비교에서는 좌표와 손실을 같은 관측에 명시적으로 저장합니다.</p><p>
            곡선의 각 점을 만든 모델 상태와 평가 자료, 계산법·배치 정책·장치 기록을 연결합니다. B의 0.39가 A보다 낮아도 학습률·자료 순서·seed 등이 달랐다면 토큰 축을 맞춘
            것만으로 배치 크기의 인과 효과가 증명되지 않습니다.
          </p></div><div id="source-wandb-sync" className="mt-8 scroll-mt-20"><CitationBlock source="wandb v0.19.11 — Run.define_metric step_sync field" citeKey={1} href="https://github.com/wandb/wandb/blob/2a058902a2425bf79e5add34b30d0e9ea5e39951/wandb/sdk/wandb_run.py#L2860-L2878"><q><code>step_sync: bool | None = None,</code></q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            가로축 metric을 빠뜨릴 때 이전 값이 재사용되는 옵션의 입력입니다. 우리 관측은 102만과 98만을 각각 명시해 기록하며 이 옵션이나 그래프 자체를 학습량의 원장으로
            간주하지 않습니다.
          </p></div></div></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 과거 상태에서 다시 시작한 실행은 새 경로로 남깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>체크포인트가 과거 갱신 상태라면 복구 뒤 모델의 진척 좌표가 이전 관측보다 뒤로 갈 수 있습니다. 새 실행이나 분기로 연결하고 이미 소비한 토큰과 시간을 별도로 남깁니다. 같은 자료를 다시 처리한 비용을 없애거나 원래 관측을 덮어쓰지 않습니다.</p><p>한 실행 경로에서도 같은 갱신에 여러 평가를 할 수 있으므로 관측 번호와 모델 진척은 서로 다른 값입니다. 패딩 포함 여부·누적 배치·분산 작업자 간 중복 집계 규칙을 고정하고 보고할 때 목표와 실제 관측의 잔차를 함께 적습니다.</p></div><ContentBoundary article="learning-curve-tracking" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 곡선의 같은 위치가 같은 의미인지 확인했나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            갱신당 1,000토큰과 4,000토큰이면 100만토큰에서 각각 몇 번 갱신했나요? (답: 3절)
          </p><p>
            목표 100만에서 A102만과 B98만을 비교한 0.03은 정확히 같은 토큰 수의 손실 차이인가요? (답: 8절)
          </p><p>오래된 체크포인트에서 다시 시작한 실행을 원래 증가 곡선에 덮어써도 되나요? (답: 11절)</p></div></section></div>; }
