import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";

const stages = [
  ["예측 행", "entity i · cutoff c · horizon h · target y(i,c,h)"],
  ["과거 원장", "event time과 available time이 기록된 관측만 선택"],
  ["시간 표현", "lag · rolling · elapsed time · calendar/cyclic basis"],
  ["평가", "rolling-origin backtest와 point-in-time replay"],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">시계열 feature는 “현재 row에서 알 수 있던 과거”를 고정하는 일입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          8월 1일 자정에 매장 A의 다음 7일 매출을 예측한다고 해보겠습니다. 이
          문제의 한 row는 단순히 날짜 하나가 아니라 <em>매장 A, cutoff 8월 1일,
          horizon 7일</em>이라는 질문입니다. Lag와 rolling statistic은 이 질문보다
          먼저 이용할 수 있었던 event history를 고정 길이의 표로 요약합니다.
        </p>
        <p>
          여기에는 서로 다른 네 시간이 있습니다. Event time은 현상이 일어난
          시점이고, available time은 시스템이 값을 알게 된 시점이며, cutoff는
          model이 결정을 내리는 시점입니다. Label horizon은 정답을 측정할 미래
          구간입니다. Calendar상 과거라도 available time이 cutoff보다 늦으면
          feature로 사용할 수 없습니다.
        </p>
        <p>
          이 글은 <Link to="/ai/feature-engineering#aggregation">point-in-time aggregation과 feature availability</Link>,{" "}
          <Link to="/ai/math-complex-numbers-oscillations">radian·sin·cos의 수학</Link>을
          재사용합니다. 여기서는 lag와 window의 인덱스 의미, rolling-origin 평가,
          cyclic basis가 forecasting row에 연결되는 방법만 소유합니다.
        </p>
      </div>

      <ContentBoundary article="time-features" />

      <ExplainedFormula
        question="Forecasting용 table의 한 row는 어떤 질문을 하나의 target으로 고정할까?"
        idea={<>Entity i에서 forecast origin c까지 알 수 있는 history로, c 뒤의 horizon h 동안 정의된 target을 예측합니다. 따라서 input과 label 양쪽에 시간 경계가 들어갑니다.</>}
        formula={String.raw`\hat y_{i,c,h}=f_{\theta}\!\left(\Phi\!\left(\{r: r.\mathrm{entity}=i,\ r.\mathrm{available\_time}\le c\}\right)\right)`}
        annotatedFormula={String.raw`\hat y_{i,c,h}=\underbrace{f_{\theta}\!\left(\Phi\!\left(\{r: r.\mathrm{entity}=i,\ r.\mathrm{available\_time}\le c\}\right)\right)}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`f_{\theta}\!\left(\Phi\!\left(\{r: r.\mathrm{entity}=i,\ r.\mathrm{available\_time}\le c\}\right)\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","Entity i에서 forecast origin c까지 알 수","있는 history로, c 뒤의 horizon h 동안 정의된","target을 예측합니다."] },
        ]}
        terms={[
          { symbol: "i", name: "entity", description: "서로 history가 섞이면 안 되는 매장·사용자·센서 같은 예측 단위입니다." },
          { symbol: "c", name: "cutoff · forecast origin", description: "Prediction을 실제로 만들어야 하는 기준 시점입니다." },
          { symbol: "h", name: "forecast horizon", description: "Cutoff 뒤 얼마 동안 또는 몇 step 뒤의 target을 맞힐지 정합니다." },
          { symbol: "Φ", name: "time-feature map", description: "유효한 과거 record를 lag·window·calendar coordinates로 바꿉니다." },
        ]}
        assumptions={["Entity key·timezone·event/available timestamp의 clock 기준이 고정돼 있습니다.", "Target interval은 input history와 겹치지 않도록 문제별로 명시합니다.", "Training과 serving은 같은 cutoff rule과 late-arrival policy를 사용합니다."]}
        interpretation="좋은 시계열 feature는 미래를 잘 요약한 값이 아니라 prediction 당시 재현할 수 있는 과거를 잘 요약한 값입니다."
      />

      <figure data-viz="time-feature-topdown" className="not-prose my-8 min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
        <figcaption>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Forecast row contract</p>
          <p className="mt-2 text-lg font-semibold">모델보다 먼저 네 단계의 시간 경계를 고정합니다</p>
        </figcaption>
        <div className="mt-6 overflow-hidden rounded-lg border border-border/70">
          {stages.map(([title, body], index) => (
            <div key={title} className={`grid gap-2 px-4 py-4 sm:grid-cols-[2.5rem_8rem_1fr] ${index ? "border-t border-border/60" : ""}`}>
              <span className="text-xs font-bold text-primary/70">0{index + 1}</span>
              <p className="font-semibold">{title}</p>
              <p className="text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </figure>
    </section>
  );
}
