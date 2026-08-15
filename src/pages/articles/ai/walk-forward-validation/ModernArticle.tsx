import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { WalkForwardViz } from "../cross-validation/viz/ModernCrossValidationViz";

export default function WalkForwardValidationArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Walk-forward는 과거 row가 아니라 그 시점에 알려진 row로 학습합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">10월 사건이 10월에 발생했더라도 outcome이 11월 말에 확정되면 11월 1일 model은 그 label을 알 수 없습니다. 시간 검증은 event time, feature available time, label available time, prediction origin을 따로 보존합니다.</p></div>
        <TermBreakdown title="시간축의 네 표식" items={[
          { term: "Event time", description: "사건이 현실에서 발생한 시각입니다." },
          { term: "Available time", description: "그 record를 training system이 실제 조회할 수 있게 된 시각입니다.", boundary: "Event time과 같다고 가정하지 않습니다." },
          { term: "Forecast origin", description: "Model이 prediction을 냈다고 재연하는 cutoff입니다." },
          { term: "Target horizon", description: "Origin 뒤 얼마 동안의 결과를 target으로 묶는지 정한 구간입니다." },
        ]} />
        <WalkForwardViz />
        <ContentBoundary article="walk-forward-validation" />
      </section>
      <section id="labels" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Label available time이 origin보다 이른 row만 training에 들어갑니다</h2>
        <ExplainedFormula
          question="30일 outcome과 7일 reporting delay가 있으면 왜 37일을 기다려야 하나요?"
          idea={<p>Event 뒤 target horizon이 끝나야 결과를 알 수 있고, 그 결과가 system에 도착하는 reporting delay도 지나야 합니다. 둘을 더해 label available time을 만듭니다.</p>}
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
          assumptions={["시각 비교는 같은 timezone과 clock convention을 씁니다.", "Label correction·late arrival policy를 manifest에 고정합니다."]}
          interpretation="10월 25일 사건의 30일 outcome이 7일 뒤 도착하면 12월 1일경까지 label을 training에 넣지 않습니다."
        />
      </section>
      <section id="gap-purge" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Gap은 거리를 띄우고 purge는 겹친 정보 interval을 제거합니다</h2>
        <TermBreakdown title="비슷해 보이지만 다른 두 제거 규칙" items={[
          { term: "Gap", description: "Split 경계 가까운 일정 구간을 비워 직접적인 시간 인접을 끊습니다." },
          { term: "Purge", description: "Training row의 feature·target interval이 validation interval과 실제로 겹치면 그 row를 제거합니다." },
          { term: "Embargo", description: "Validation 직후 일정 구간을 후속 training에서 잠시 제외하는 운영 규칙입니다." },
          { term: "Rolling origin", description: "같은 availability 규칙을 유지한 채 origin을 앞으로 이동해 여러 과거 배포를 재연합니다." },
        ]} />
      </section>
      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">Expanding과 rolling window는 production retraining policy에 맞춥니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Expanding window는 사용 가능한 모든 과거를 누적하고, rolling window는 최근 고정 길이만 남깁니다. Concept drift 때문에 오래된 data를 버리는 production이면 backtest도 같은 정책을 써야 합니다. Entity가 반복되면 시간 방향 위에 group 경계도 추가합니다.</p></div>
        <div id="paper-walk-forward" className="not-prose mt-8"><CitationBlock source="scikit-learn — TimeSeriesSplit" citeKey={1} type="paper" href="https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.TimeSeriesSplit.html">
          순서가 있는 data에서 successive training sets가 누적되는 현재 splitter API와 gap parameter를 설명합니다. Label delay와 overlapping target purge가 자동 처리된다는 뜻은 아닙니다.
        </CitationBlock></div>
      </section>
    </div>
  );
}
