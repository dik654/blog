import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { WalkForwardViz } from "../cross-validation/viz/ModernCrossValidationViz";
export default function Article() { return <div className="space-y-16"><section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 과거에 생긴 사건도 아직 알 수 없을 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>과거 시점의 예측을 재현하려면 그때 실제로 알았던 정보만 사용해야 합니다. 나중에 완성된 기록을 과거로 돌려 넣으면 실제 운영에서 불가능했던 예측을 시험하게 됩니다.</p><p>이 글은 한 사건의 결과를 기다린 뒤 보고까지 늦게 도착하는 상황을 따라갑니다. 발생한 날과 학습에 쓸 수 있게 된 날이 왜 다른지 날짜로 확인합니다.</p></div></section>

<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 시계를 고정하고 도착한 기록만 학습합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>예측을 내렸다고 재현할 시각을 하나 정합니다. 그때까지 조회할 수 있었던 입력과 정답만 골라 학습하고 이후의 결과를 평가합니다. 같은 규칙으로 시각을 앞으로 옮기면 여러 과거 운영을 재현할 수 있습니다.</p></div><ol className="my-8 grid list-none gap-4 p-0 sm:grid-cols-2"><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">1</span><span>예측을 재현할 시각을 고정한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">2</span><span>그때까지 도착한 입력과 정답을 고른다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">3</span><span>학습한 뒤 다음 기간을 평가한다</span></li><li className="border-l border-border pl-4"><span className="block text-sm text-muted-foreground">4</span><span>같은 규칙으로 시각을 앞으로 옮긴다</span></li></ol></section>

<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 10월 25일 사건의 정답은 12월 1일에 도착합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>모든 시각을 2026년 UTC 00:00로 두겠습니다. 10월 25일 사건 뒤 30일 동안의 결과를 끝까지 관찰하고 보고가 7일 더 늦게 도착한다고 합시다. 관찰 종료는 11월 24일이고 정답 도착은 12월 1일입니다. (가정)</p><p>11월 1일의 예측을 재현할 때 이 사건은 이미 과거입니다. 그러나 결과는 아직 관찰 중이고 보고도 오지 않았으므로 그 정답을 학습에 넣을 수 없습니다. 사건의 날짜만 비교하면 이 차이를 놓칩니다. (가정)</p></div></section>

<section id="inside-time" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 사건과 입력과 정답의 시각을 나누어 기록합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>한 행에는 사건 발생 시각, 입력값을 실제 조회할 수 있게 된 시각, 정답을 조회할 수 있게 된 시각이 필요합니다. 예측을 재현하는 시각과 이 셋을 각각 비교합니다. 오래된 사건도 정답이 늦게 정정되면 당시에는 수정 전 값만 알았을 수 있습니다.</p><p>10월 25일 행에는 관찰 길이 30일과 보고 지연 7일을 남깁니다. 11월 1일에 입력이 도착했더라도 정답은 12월 1일에야 도착하므로 정답이 필요한 학습에는 아직 쓸 수 없습니다.</p></div></section>

<section id="why-arrival" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 정답이 일찍 들어오면 미래의 답안을 본 셈입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>나중에 확보한 정답을 사건 날짜에 맞춰 과거 학습표에 붙이면 11월 1일 모델이 11월 24일까지의 결과를 미리 배운 셈입니다. 모델의 능력보다 자료 준비 과정이 점수를 높일 수 있습니다.</p><p>따라서 날짜가 과거라는 조건과 정보가 도착했다는 조건을 따로 검사합니다. 입력이 늦게 들어오는 문제도 같은 방식으로 처리해야 실제 운영에서 가능한 예측을 재현할 수 있습니다.</p></div></section>

<section id="time-terms" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 발생과 가용성과 예측 시작점에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>사건이 생긴 시각은 event time, 시스템에서 조회할 수 있게 된 시각은 available time입니다. 예측했다고 재현하는 기준 시각은 forecast origin입니다.</p></div><TermBreakdown title="역할을 이해한 뒤 이름을 붙입니다" items={[{"term": "Target horizon", "description": "사건 뒤 결과를 관찰하기로 정한 기간입니다.", "boundary": "이 사례는 30일 전체가 끝나야 최종 정답을 확정합니다."}, {"term": "Reporting delay", "description": "결과가 확정된 뒤 시스템에 도착하기까지의 지연입니다.", "boundary": "사례에서는 7일이지만 실제로는 행마다 다를 수 있습니다."}, {"term": "Walk-forward validation", "description": "예측 시작점을 앞으로 옮기며 그 시점의 과거로 이후를 평가합니다.", "boundary": "단순 날짜 정렬만으로 정보 가용성을 확인하지는 않습니다."}]} /><WalkForwardViz /></section>

<section id="labels" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 30일과 7일을 더하고 엄격한 이전 조건을 적용합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>10월 25일에 30일을 더하면 11월 24일이고 7일을 더하면 12월 1일 00:00입니다. 총 37일이 지났습니다. 이 글은 예측 시작점보다 먼저 도착한 정답만 사용한다는 엄격한 규칙을 선택합니다. (가정)</p><p>그러면 11월 1일에는 제외하고 12월 1일 00:00처럼 같은 시각에도 제외합니다. 12월 2일 00:00에는 이 정답 가용성 조건을 통과합니다. 실제 서비스가 같은 시각의 도착을 확정해 사용할 수 있다면 포함 규칙을 따로 명시해야 합니다.</p><p>아래 T_o는 다른 자격 검사를 이미 통과한 행 중 정답 시각 조건으로 고른 후보 집합입니다. 정답이 도착했어도 학습 기간 밖이거나 품질 오류가 있는 행은 전체 학습 집합에서 제외될 수 있습니다.</p></div><ExplainedFormula
          question="30일 outcome과 7일 reporting delay가 있으면 왜 37일을 기다려야 하나요?"
          idea={<p>
            Event 뒤 target horizon이 끝나야 결과를 알 수 있고 그 결과가 system에 도착하는 reporting delay도 지나야 합니다. 둘을 더해 label
            available time을 만듭니다.
          </p>}
          formula={String.raw`t_i^{\mathrm{label}}=t_i^{\mathrm{event}}+h_i+d_i,\quad i\in T_o\iff t_i^{\mathrm{label}}<o`}
          annotatedFormula={String.raw`\begin{aligned}t_i^{\mathrm{end}}&=\underbrace{t_i^{\mathrm{event}}+h_i}_{\text{target 관측 구간이 끝나는 시각}}\\t_i^{\mathrm{label}}&=\underbrace{t_i^{\mathrm{end}}+d_i}_{\text{reporting 지연 뒤 label이 도착}}\\i\in T_o&\Longleftrightarrow\underbrace{t_i^{\mathrm{label}}<o}_{\text{origin 이전 label만 허용}}
\end{aligned}`}
          operations={[
            { expression: String.raw`t_i^{\mathrm{event}}+h_i`, annotation: ["event 시각에 target horizon을 더해", "outcome 관측 완료 시각 계산"] },
            { expression: String.raw`t_i^{\mathrm{end}}+d_i`, annotation: ["보고 지연을 더해", "system label 도착 시각 계산"] },
            { expression: String.raw`t_i^{\mathrm{label}}<o`, annotation: ["label 도착과 forecast origin을 비교해", "당시 학습 가능 row만 선택"] },
          ]}
          terms={[
            { symbol: String.raw`t_i^{\mathrm{event}}`, name: "Event time", description: "Row i 사건 발생 시각입니다." },
            { symbol: String.raw`h_i,d_i`, name: "Horizon·reporting delay", description: "Target 관측 길이와 system 반영 지연입니다." },
            { symbol: "o", name: "Forecast origin", description: "Prediction을 냈다고 재연하는 시각입니다." },
          ]}
          assumptions={["시각 비교는 같은 timezone과 clock convention을 씁니다.", "Label correction·late arrival policy를 manifest에 고정합니다.","이 식의 T_o는 다른 자격 조건을 이미 통과한 행 중 정답 가용성으로 고른 후보 집합입니다. 전체 학습 자격의 충분 조건은 아닙니다.","관측 창 전체가 끝난 뒤 고정 지연으로 최종 정답이 도착하는 단순 모형입니다."]}
          interpretation="2026-10-25 00:00 UTC + 30일 = 11-24 00:00, 여기에 7일을 더하면 12-01 00:00입니다. 엄격한 이전 시각 규칙에서는 같은 시각도 제외하고 12-02 00:00에는 정답 조건을 통과합니다."
        /></section>

<section id="paper-walk-forward" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 공식 gap 인자는 달력의 날짜를 세지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>scikit-learn 1.7.2 TimeSeriesSplit은 순서대로 학습과 평가 인덱스를 만들고 gap으로 학습 끝부분의 표본을 제외합니다. 정답 도착 시각을 인자로 받거나 직접 검사하는 도구는 아닙니다.</p></div><div id="source-gap-count" className="mt-8 scroll-mt-20"><CitationBlock source="scikit-learn 1.7.2 — TimeSeriesSplit gap" citeKey={1} href="https://scikit-learn.org/1.7/modules/generated/sklearn.model_selection.TimeSeriesSplit.html"><q>Number of samples to exclude</q></CitationBlock><div className="prose prose-neutral max-w-none dark:prose-invert"><p>이 사례의 37일 지연을 gap=37로 쓰면 표본 37개를 뺍니다. 하루에 한 행이라는 특별한 규칙이 없다면 37일과 같지 않습니다. 10월 25일 행의 실제 도착일 12월 1일을 예측 시작점과 비교하는 검사는 별도로 수행해야 합니다.</p></div></div><AlgorithmBlock title="한 시작점에서 정답 가용성을 검사 — 의사코드" input={["event=2026-10-25 00:00 UTC", "horizon=30일, delay=7일, origin"]} steps={[{"code": "label_available ← event + horizon + delay", "note": "12월 1일 00:00으로 계산합니다."}, {"code": "label_ok ← label_available < origin", "note": "12월 1일 같은 시각은 false, 12월 2일은 true입니다."}, {"code": "train_ok ← other_eligibility and feature_available and label_ok", "note": "학습 기간·입력 가용성·품질 등 다른 조건을 함께 검사합니다."}]} output="해당 시각에 사용할 수 있는 학습 행" /></section>

<section id="gap-purge" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 거리와 정보 구간의 겹침은 다른 검사입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Gap은 경계 근처에 정한 간격을 두는 규칙입니다. Purge는 학습 행이 사용하는 정보 구간과 평가 구간이 실제로 겹치는지 보고 해당 행을 제거하는 규칙입니다. 고정 간격이 모든 길이의 관찰 구간 겹침을 자동으로 없애지는 않습니다.</p><p>Embargo는 평가 직후 일정 구간을 후속 학습에서 제외하는 규칙입니다. 이후 기간까지 학습 후보가 될 수 있는 설계에서 남는 근접 의존성을 다룹니다. 과거만 학습하는 설계에도 무조건 같은 처방을 붙이기보다 어떤 정보가 공유되는지 먼저 확인합니다.</p></div></section>

<section id="boundary" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 실제 재학습 범위와 정답 확정 정책을 재현합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>Expanding window는 사용 가능한 과거를 누적하고 rolling window는 최근의 정한 범위만 남깁니다. 실제 서비스가 최근 90일만 학습한다면 과거 재현도 같은 조건을 사용해야 합니다. 새 대상을 평가할 필요가 있으면 대상 분리 조건도 추가합니다.</p><p>30일을 모두 기다리는 것은 이 사례의 최종 정답 정책입니다. 어떤 문제는 양성 사건이 생기면 더 일찍 확정할 수 있지만 음성은 관찰 창이 끝나야 알 수 있습니다. 보고 지연과 정정도 행마다 다를 수 있으므로 실제 가용 시각과 버전 기록이 있으면 그것을 사용합니다.</p></div><ContentBoundary article="walk-forward-validation" /></section>

<section id="prediction-questions" data-teach-level="review" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 그 시점에 정말 알 수 있었나요</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>10월 25일 사건의 결과를 30일 관찰하고 7일 뒤 받는다면 11월 1일과 12월 2일의 정답 조건은 각각 어떤가요? (답: 7절)</p><p>하루 기록 수가 일정하지 않은 자료에서 gap=37은 37일 지연을 보장하나요? (답: 8절)</p><p>정답 가용성 조건을 통과하면 학습 기간과 입력 품질까지 자동 통과한 것인가요? (답: 7절)</p></div></section></div>; }
