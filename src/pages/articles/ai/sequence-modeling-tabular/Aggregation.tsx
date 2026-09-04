import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import AggregationViz from "./viz/AggregationViz";

export default function Aggregation() {
  return (
    <section id="aggregation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Flat summary는 순서를 없애는 대신 무엇을 남길지 정한 압축입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sequence model이 언제나 첫 선택은 아닙니다. Event별 count, 마지막 발생 후 경과 시간, 최근 window의 합계처럼 고정 길이 feature를 만들면 강한
          GBDT baseline을 빠르게 세울 수 있습니다. 이 변환은 정보 일부를 의도적으로 버리는 압축입니다. 무엇을 버렸는지 알아야 sequence model의 추가 비용이
          필요한지도 판단할 수 있습니다.
        </p>
        <p>
          Lag·rolling window의 시간 경계는 <Link to="/ai/time-features">시계열 feature 글</Link>에서
          다룹니다. 이 글에서는 바로 이웃한 event의 순서를 남기는 bigram count와
          transition probability를 살펴봅니다. 예를 들어 <code>A→B</code> 횟수는
          전체 A·B count만으로는 보이지 않는 짧은 순서를 보존합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Event a 다음에 b가 나타나는 경향을 고정 길이 feature로 어떻게 만들까?"
        idea={<>먼저 인접한 event pair의 횟수를 세고, 같은 시작 event에서 나가는 전체 횟수로 나눕니다. 관측되지 않은 전이에 확률 0을 단정하지 않도록 작은 smoothing 값 α를 더할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}N_{ab}&=\sum_{j=1}^{L-1}\mathbf 1[a_j=a,\ a_{j+1}=b],\\N_{a\bullet}&=\sum_{b^{\prime}\in\mathcal V}N_{ab^{\prime}},\\\widehat P(b\mid a)&=\frac{N_{ab}+\alpha}{N_{a\bullet}+\alpha|\mathcal V|}.\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}N_{ab}&=\underbrace{\sum_{j=1}^{L-1}\mathbf 1[a_j=a,\ a_{j+1}=b],}_{\text{오른쪽 항으로 결과 계산}}\\N_{a\bullet}&=\underbrace{\sum_{b^{\prime}\in\mathcal V}N_{ab^{\prime}},}_{\text{event vocabulary 계산}}\\\widehat P(b\mid a)&=\underbrace{\frac{N_{ab}+\alpha}{N_{a\bullet}+\alpha|\mathcal V|}.}_{\text{기준량당 비율}}\end{aligned}`}
        operations={[
          { expression: String.raw`\sum_{j=1}^{L-1}\mathbf 1[a_j=a,\ a_{j+1}=b],`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","먼저 인접한 event pair의 횟수를 세고, 같은 시작","event에서 나가는 전체 횟수로 나눕니다."] },
          { expression: String.raw`\sum_{b^{\prime}\in\mathcal V}N_{ab^{\prime}},`, annotation: ["event vocabulary이(가) 식의 결과에 기여하는","방식을 계산합니다.","먼저 인접한 event pair의 횟수를 세고, 같은 시작","event에서 나가는 전체 횟수로 나눕니다."] },
          { expression: String.raw`\frac{N_{ab}+\alpha}{N_{a\bullet}+\alpha|\mathcal V|}.`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","먼저 인접한 event pair의 횟수를 세고, 같은 시작","event에서 나가는 전체 횟수로 나눕니다."] },
        ]}
        terms={[
          { symbol: "N_ab", name: "transition count", description: "Sequence에서 a 바로 다음에 b가 나온 횟수입니다." },
          { symbol: "1[·]", name: "indicator", description: "조건이 맞으면 1, 아니면 0을 더하는 셈 함수입니다." },
          { symbol: "V", name: "event vocabulary", description: "Training fold에서 정한 가능한 event type 집합입니다." },
          { symbol: "α", name: "smoothing strength", description: "관측이 적은 전이의 0 또는 1 확률을 완화하는 값이며 α=0이면 단순 빈도입니다." },
        ]}
        assumptions={["Event가 stable tie-break rule로 정렬돼 있습니다.", "Vocabulary·rare-event mapping·smoothing 값은 training fold에서만 정합니다.", "분모가 작은 entity의 추정치는 support count와 함께 사용합니다."]}
        interpretation="이 feature는 바로 이웃한 한 단계의 순서를 보존하지만 더 긴 경로와 event 사이의 실제 시간 간격은 보존하지 않습니다."
      />

      <div className="not-prose my-8"><AggregationViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>같은 bigram을 가진 두 sequence도 전체 경로는 다를 수 있습니다</h3>
        <p>
          <code>ABACA</code>와 <code>ACABA</code>는 event count가 모두 A=3,
          B=1, C=1이고, 인접 transition도 AB·BA·AC·CA가 각각 한 번입니다.
          따라서 unigram과 bigram feature만 받는 모델에는 두 입력이 같습니다.
          그러나 “B를 거친 뒤 C로 갔는가”처럼 더 긴 순서를 묻는 target에는 서로
          다른 evidence가 됩니다. 이것이 summary collision입니다.
        </p>
        <p>
          Trigram·최근 event 위치·time gap을 추가하면 일부 collision을 줄일 수 있습니다. 대신 vocabulary와 sequence 길이가 커질수록
          feature가 빠르게 희소해집니다. Minimum support, top-k vocabulary, hashing 같은 정책은 training fold에서 정하고 unknown
          bucket까지 serving artifact에 넣습니다.
        </p>
        <p>
          최종 비교에서는 같은 cutoff와 split을 사용한 recency/count GBDT, order-aware flat model, sequence model을 나란히 둡니다.
          Sequence model의 gain이 긴 history나 특정 transition slice에서만 생기는지 확인하면 평균 점수 뒤에 가려진 representation 이득이
          드러납니다.
        </p>
      </div>
    </section>
  );
}
