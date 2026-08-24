import ExplainedFormula from "@/components/ui/explained-formula";
import LagViz from "./viz/LagViz";

export default function Lag() {
  return (
    <section id="lag" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Lag를 만들기 전에 “k step 전”과 “Δ시간 전”을 구분합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          매일 정확히 한 번 측정된 series에서는 한 row 전과 하루 전이 같습니다.
          그러나 거래처럼 event 간격이 불규칙하면 이전 7개 거래와 최근 7일은
          전혀 다른 질문입니다. Observation lag는 정렬된 같은 entity의 k번째
          이전 값을, duration lag는 cutoff−Δ 부근에 존재하거나 as-of join으로
          확정된 값을 가져옵니다.
        </p>
        <p>
          Target 자체가 늦게 확정되는 문제에서는 event time만 빠르다고 사용할 수
          없습니다. 예를 들어 7월 매출이 8월 5일에 정산된다면 8월 1일 cutoff의
          lag-1 “7월 매출”은 아직 모르는 값입니다. Available time 조건을 통과한
          record 중 무엇을 lag로 삼을지 tie·duplicate·late-arrival 규칙까지 정해야
          재현할 수 있습니다.
        </p>
      </div>

      <ExplainedFormula
        question="같은 entity의 k번째 이전 관측값을 현재 forecasting row에 어떻게 붙일까?"
        idea={<>Entity별로 유효한 record를 시간순으로 정렬한 뒤 현재 index n보다 k칸 앞의 값을 선택합니다. Difference는 두 확정된 lag level을 빼 level보다 변화를 강조합니다.</>}
        formula={String.raw`\operatorname{lag}_k(i,n)=y_{i,n-k},\qquad \Delta_k y_{i,n}=y_{i,n}-y_{i,n-k}`}
        annotatedFormula={String.raw`\operatorname{lag}_k(i,n)=\underbrace{y_{i,n-k},\qquad \Delta_k y_{i,n}=y_{i,n}-y_{i,n-k}}_{\text{변화량 계산}}`}
        operations={[
          { expression: String.raw`y_{i,n-k},\qquad \Delta_k y_{i,n}=y_{i,n}-y_{i,n-k}`, annotation: ["인접한 level의 차이를 남겨 변화량을 계산합니다.","Entity별로 유효한 record를 시간순으로 정렬한 뒤","현재 index n보다"] },
        ]}
        terms={[
          { symbol: "i", name: "entity", description: "Lag가 다른 매장·사용자·sensor history로 넘어가지 않게 하는 group key입니다." },
          { symbol: "n", name: "ordered observation index", description: "Event/available-time 정책으로 정렬하고 중복을 처리한 뒤의 entity 내부 순서입니다." },
          { symbol: "k", name: "observation lag", description: "시간 길이가 아니라 몇 개의 관측을 뒤로 갈지 정하는 양의 정수입니다." },
          { symbol: "Δ_k y", name: "k-step difference", description: "현재 level과 k-step 전 level의 차이이며 y와 같은 단위를 가집니다." },
        ]}
        assumptions={["Series가 entity 내부에서 안정적으로 정렬되고 timestamp tie 규칙이 있습니다.", "선택된 두 값 모두 prediction cutoff에 available합니다.", "Irregular events에서 k steps를 k hours/days로 해석하지 않습니다."]}
        interpretation="Lag는 model이 기억을 갖게 하는 것이 아니라 과거 값을 현재 row의 별도 column으로 복사하는 feature map입니다."
      />

      <div className="not-prose my-8"><LagViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>History 부족과 lag 후보 선택도 정보입니다</h3>
        <p>
          첫 k개 row에는 lag-k가 없습니다. 0이 실제 관측값인 domain이라면 이를
          임의로 0으로 채우지 않고 missing value와 <code>history_length</code> 또는
          <code>lag_available</code> indicator를 함께 둡니다. Duration lag에서 정확한
          timestamp가 없을 때 forward fill을 허용할지, 최대 허용 stale time은
          얼마인지도 artifact에 기록합니다.
        </p>
        <p>
          ACF는 같은 series의 값이 lag k만큼 떨어졌을 때 선형적으로 함께 움직이는
          정도를 보여 주므로 후보를 좁히는 진단입니다. Trend·seasonality와 split
          경계를 그대로 둔 높은 ACF가 새로운 기간의 예측력을 보장하지는 않습니다.
          업무 주기에서 제안한 lag set을 horizon별 rolling-origin validation으로
          비교합니다.
        </p>
      </div>
    </section>
  );
}
