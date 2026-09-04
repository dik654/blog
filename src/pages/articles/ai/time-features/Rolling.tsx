import ExplainedFormula from "@/components/ui/explained-formula";
import RollingViz from "./viz/RollingViz";

export default function Rolling() {
  return (
    <section id="rolling" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Rolling statistic은 window의 양끝과 관측 수까지 포함한 계약입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          최근 7일 평균이라는 문장만으로는 구현을 재현할 수 없습니다. Cutoff
          자체를 포함하는지, 정확히 7일 전 record를 포함하는지, available time과
          event time 중 어느 clock으로 자르는지, 관측이 몇 개 이상이어야 값을
          낼지 정해야 합니다. 일반적인 forecasting feature는 target 시점의 값을
          제외하도록 오른쪽이 열린 과거 window를 사용합니다.
        </p>
        <p>
          Row-count window는 최근 N개 사건의 상태를, duration window는 최근 Δ시간의 활동량을 묻습니다. Event가 불규칙하면 둘의 표본 수가 달라집니다.
          mean과 함께 count·coverage·time-since-last-event를 기록하면 “평균 10”이 한 번의 관측인지 백 번의 관측인지 구분됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="Cutoff c 직전 W시간 동안 확정된 값의 평균을 어떻게 정의할까?"
        idea={<>Entity i의 record 중 event time은 왼쪽 경계 c−W 이상, 오른쪽 경계 c보다 작고 available time도 c 이하인 집합만 선택합니다. 그 집합의 count로 합을 나눕니다.</>}
        formula={String.raw`\mathcal W_{i,c}=\{r_i:c-W\le t^{\mathrm{event}}_r<c,\ t^{\mathrm{avail}}_r\le c\},\qquad \mu_{i,c,W}=\frac{1}{|\mathcal W_{i,c}|}\sum_{r\in\mathcal W_{i,c}}v_r`}
        annotatedFormula={String.raw`\mathcal W_{i,c}=\underbrace{\{r_i:c-W\le t^{\mathrm{event}}_r<c,\ t^{\mathrm{avail}}_r\le c\},\qquad \mu_{i,c,W}=\frac{1}{|\mathcal W_{i,c}|}\sum_{r\in\mathcal W_{i,c}}v_r}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\{r_i:c-W\le t^{\mathrm{event}}_r<c,\ t^{\mathrm{avail}}_r\le c\},\qquad \mu_{i,c,W}=\frac{1}{|\mathcal W_{i,c}|}\sum_{r\in\mathcal W_{i,c}}v_r`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Entity i의 record 중 event time은 왼쪽","경계 c−W 이상, 오른쪽 경계 c보다"] },
        ]}
        terms={[
          { symbol: "[c−W,c)", name: "half-open window", description: "정확히 왼쪽 경계는 포함하고 현재 cutoff는 제외하는 시간 구간입니다." },
          { symbol: "t_event", name: "event time", description: "현상이 실제로 발생한 시각으로 duration 범위를 정합니다." },
          { symbol: "t_avail", name: "available time", description: "Feature system이 record를 사용할 수 있게 된 시각이며 반드시 cutoff 이하여야 합니다." },
          { symbol: "|W_i,c|", name: "window count", description: "선택된 유효 record 수이며 0이면 mean을 정의할 별도 fallback이 필요합니다." },
        ]}
        assumptions={["Timezone·daylight-saving·boundary equality 처리가 명시돼 있습니다.", "Late update와 duplicate record의 version selection이 deterministic합니다.", "min_periods와 empty-window fallback을 training·serving에 동일하게 적용합니다."]}
        interpretation="Rolling mean 값만 저장하지 말고 window count와 freshness를 함께 두면 sparse history와 실제 낮은 level을 구분하기 쉽습니다."
      />

      <ExplainedFormula
        question="EMA는 과거를 모두 쓰면서 최근 값에 더 큰 비중을 어떻게 줄까?"
        idea={<>현재 cutoff 이전에 확정된 새 값이 들어올 때 이전 상태를 (1−α)만큼 남기고 새 값을 α만큼 섞습니다. α가 크면 빠르게 반응하고 작으면 오래 기억합니다.</>}
        formula={String.raw`s_n=\alpha y_{n-1}+(1-\alpha)s_{n-1},\qquad 0<\alpha\le1`}
        annotatedFormula={String.raw`s_n=\underbrace{\alpha y_{n-1}+(1-\alpha)s_{n-1},\qquad 0<\alpha\le1}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`\alpha y_{n-1}+(1-\alpha)s_{n-1},\qquad 0<\alpha\le1`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","현재 cutoff 이전에 확정된 새 값이 들어올 때 이전","상태를 (1−α)만큼 남기고 새 값을 α만큼 섞습니다."] },
        ]}
        terms={[
          { symbol: "s_n", name: "EMA state", description: "n번째 prediction row에서 사용할 cutoff 이전의 exponentially weighted summary입니다." },
          { symbol: "y_(n−1)", name: "latest available value", description: "현재 target이 아니라 직전에 확정돼 사용할 수 있는 관측값입니다." },
          { symbol: "α", name: "smoothing factor", description: "새 관측에 줄 weight이며 반응 속도와 noise suppression을 함께 바꿉니다." },
        ]}
        assumptions={["Observation 간격이 일정하거나 irregular interval을 반영한 time-decay version을 사용합니다.", "Initial state와 warm-up policy를 기록합니다.", "α는 validation horizon과 regime 변화에 맞춰 선택합니다."]}
        interpretation="EMA는 고정 길이 window가 아니라 먼 과거의 weight가 지수적으로 작아지는 stateful summary입니다."
      />

      <div className="not-prose my-8"><RollingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          짧은 window는 변화에 빠르게 반응하지만 noise가 큽니다. 긴 window는 안정적인 대신 regime change를 늦게 반영합니다. 여러 window를 늘어놓기 전에 각
          window가 나타내는 업무 시간 척도를 적고 seeded ablation으로 품질·latency·feature freshness를 비교합니다.
        </p>
      </div>
    </section>
  );
}
