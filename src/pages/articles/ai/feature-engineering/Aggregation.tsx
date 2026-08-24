import ExplainedFormula from "@/components/ui/explained-formula";
import AggregationViz from "./viz/AggregationViz";

export default function Aggregation() {
  return (
    <section id="aggregation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        집계 피처는 여러 event를 cutoff 이전의 상태 한 줄로 압축합니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          사용자 평균 구매액, 최근 로그인 횟수, 설비별 온도 변동처럼 aggregation
          feature는 길이가 제각각인 event history를 model row 하나의 상태로
          바꿉니다. Count는 활동량, mean은 중심, standard deviation은 변동성,
          recency는 마지막 사건과의 거리를 나타냅니다. 같은 groupby 문법이라도
          서로 다른 업무 가설을 측정합니다.
        </p>
        <p>
          가장 중요한 계약은 cutoff time입니다. 예측 시점 뒤의 event까지
          groupby하면 미래 누출이 생기므로, 각 row마다 그 시점 이전 기록만
          사용하는 point-in-time join을 구성합니다. Validation entity의 label이
          training aggregation에 들어가지 않도록 split도 이 계산보다 먼저
          확정해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="최근 W 기간의 event count를 현재 row와 미래 event 없이 어떻게 정의할까?"
        idea={<>Entity가 같은 record 중 event time과 available time이 모두 cutoff 이하이고, 왼쪽 경계보다 뒤인 것만 1로 셉니다. 구간을 (t₀−W, t₀]처럼 적으면 경계 시각의 중복 집계 여부까지 재현할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}
I_r={}&\mathbf 1[e_r=e]\\
&\cdot\mathbf 1[t_0-W<t_{\mathrm{event},r}]\\
&\cdot\mathbf 1[t_{\mathrm{event},r}\le t_0]\\
&\cdot\mathbf 1[t_{\mathrm{available},r}\le t_0],\\
\operatorname{count}_{W}(e,t_0)&=\sum_r I_r.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
I_r={}&\mathbf 1[e_r=e]\\
&\cdot\mathbf 1[t_0-W<\underbrace{t_{\mathrm{event},r}]}_{\text{lookback window 계산}}\\
&\cdot\mathbf 1[t_{\mathrm{event},r}\le \underbrace{t_0]}_{\text{event record 계산}}\\
&\cdot\mathbf 1[t_{\mathrm{available},r}\le \underbrace{t_0],}_{\text{event record 계산}}\\
\operatorname{count}_{W}(e,t_0)&=\sum_r I_r.
\end{aligned}`}
        operations={[
          { expression: String.raw`t_{\mathrm{event},r}]`, annotation: ["lookback window이(가) 식의 결과에 기여하는","방식을 계산합니다.","Entity가 같은 record 중 event time과","available time이 모두 cutoff 이하이고, 왼쪽"] },
          { expression: String.raw`t_0]`, annotation: ["event record이(가) 식의 결과에 기여하는 방식을","계산합니다.","Entity가 같은 record 중 event time과","available time이 모두 cutoff 이하이고, 왼쪽"] },
          { expression: String.raw`t_0],`, annotation: ["event record이(가) 식의 결과에 기여하는 방식을","계산합니다.","Entity가 같은 record 중 event time과","available time이 모두 cutoff 이하이고, 왼쪽"] },
        ]}
        terms={[
          { symbol: "W", name: "lookback window", description: "7일·30일처럼 cutoff에서 과거로 돌아갈 관측 길이입니다." },
          { symbol: "r", name: "event record", description: "거래·로그인·센서 측정처럼 집계 후보가 되는 한 기록입니다." },
          { symbol: "1[·]", name: "indicator", description: "대괄호 안 조건을 만족하면 1, 아니면 0이 되어 허용된 event만 셉니다." },
          { symbol: "Iᵣ", name: "eligible-event indicator", description: "Entity·window·available-time 조건을 모두 통과한 record만 1이 됩니다." },
          { symbol: "(t₀−W,t₀]", name: "window boundary", description: "왼쪽은 제외하고 cutoff는 포함하는 구간입니다. 다른 규칙을 쓰면 명시해야 합니다." },
        ]}
        assumptions={["Event time과 pipeline available time을 구분합니다.", "Entity key의 변경·병합 규칙이 학습과 serving에서 같습니다.", "현재 row의 target 또는 target 이후 처리 event는 source에 들어가지 않습니다."]}
        interpretation="전체 기간 groupby를 먼저 만든 뒤 row에 붙이면 각 row의 cutoff가 사라집니다. Point-in-time join은 row마다 다른 과거 세계를 복원해야 합니다."
      />

      <div className="not-prose my-8"><AggregationViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Window는 최근성과 안정성 사이의 가설입니다</h3>
        <p>
          Rolling window는 최근 상태를, expanding statistic은 누적 이력을
          표현합니다. 1일·7일·30일 count를 함께 두면 속도 변화도 읽을 수 있지만
          서로 강하게 상관될 수 있습니다. Event-time 기준인지 ingestion-time
          기준인지, timezone과 day boundary는 무엇인지, 늦게 도착한 record를
          backfill할지를 schema에 포함해야 합니다.
        </p>
        <p>
          user×category처럼 key를 세분화하면 더 구체적인 맥락을 얻지만 관측이
          적은 group의 mean과 variance는 불안정합니다. Count를 함께 제공하고,
          minimum support나 상위 group mean으로의 shrinkage를 validation에서
          비교합니다. 이름은 <code>user_30d_mean_amount_v3</code>처럼 group,
          window, statistic, value와 version이 드러나게 짓는 편이 운영에 유리합니다.
        </p>
      </div>
    </section>
  );
}
