import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">이벤트 시퀀스는 한 entity의 유효한 과거를 순서째 보존한 sample입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          <em>상품 보기 → 장바구니 → 결제</em>와 <em>결제 → 장바구니 → 상품 보기</em>는
          event count가 같아도 의미가 다릅니다. 클릭·거래·의료 기록처럼 순서와
          간격이 target에 영향을 주면, 독립 row나 단순 count로는 이 차이를
          보존할 수 없습니다. 같은 entity에서 cutoff 당시 available한 event를
          정렬해 하나의 variable-length input으로 묶습니다.
        </p>
        <p>
          그렇다고 sequence model부터 선택하지는 않습니다. Count·recency·lag처럼
          어떤 순서를 버리는지 명확한 flat baseline을 먼저 만들고, 순서 또는 먼
          event 관계가 실제 validation gain을 낼 때 RNN·CNN·Transformer를
          추가합니다. 길어진 input이 더 많은 정보와 더 큰 padding·attention 비용을
          동시에 가져온다는 점도 함께 측정합니다.
        </p>
        <p>
          Entity·origin·horizon·available-time 정의는{" "}
          <Link to="/ai/time-features">시계열 feature 글</Link>이 소유합니다.
          Attention의 Q·K·V 계산은 <Link to="/ai/attention-theory">attention 글</Link>,
          Transformer block은 <Link to="/ai/transformer-architecture">architecture 글</Link>을
          재사용하며, 여기서는 event sequence input과 prediction mask만 확장합니다.
        </p>
      </div>

      <ContentBoundary article="sequence-modeling-tabular" />

      <ExplainedFormula
        question="Forecast origin c에서 model에 들어갈 event sequence를 어떻게 정의할까?"
        idea={<>같은 entity i의 records 중 available time이 cutoff 이하인 것만 고르고 event time과 tie-break key로 안정적으로 정렬합니다. 그 결과의 길이 Lᵢ,𝚌는 entity마다 다를 수 있습니다.</>}
        formula={String.raw`\begin{aligned}\mathcal H_{i,c}&=\{e:e.\mathrm{entity}=i,\ t^{\mathrm{avail}}_e\le c\},\\S_{i,c}&=\operatorname{sort}_{(t^{\mathrm{event}},k_{\mathrm{tie}})}(\mathcal H_{i,c}),\\S_{i,c}&=(e_1,\ldots,e_{L_{i,c}}).\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\mathcal H_{i,c}&=\underbrace{\{e:e.\mathrm{entity}=i,\ t^{\mathrm{avail}}_e\le c\},}_{\text{허용 경계 판정}}\\S_{i,c}&=\underbrace{\operatorname{sort}_{(t^{\mathrm{event}},k_{\mathrm{tie}})}(\mathcal H_{i,c}),}_{\text{오른쪽 항으로 결과 계산}}\\S_{i,c}&=\underbrace{(e_1,\ldots,e_{L_{i,c}}).}_{\text{오른쪽 항으로 결과 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`\{e:e.\mathrm{entity}=i,\ t^{\mathrm{avail}}_e\le c\},`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","같은 entity i의 records 중 available","time이 cutoff 이하인 것만 고르고 event","time과 tie-break key로 안정적으로 정렬합니다."] },
          { expression: String.raw`\operatorname{sort}_{(t^{\mathrm{event}},k_{\mathrm{tie}})}(\mathcal H_{i,c}),`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","같은 entity i의 records 중 available","time이 cutoff 이하인 것만 고르고 event","time과 tie-break key로 안정적으로 정렬합니다."] },
          { expression: String.raw`(e_1,\ldots,e_{L_{i,c}}).`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","같은 entity i의 records 중 available","time이 cutoff 이하인 것만 고르고 event","time과 tie-break key로 안정적으로 정렬합니다."] },
        ]}
        terms={[
          { symbol: "S_i,c", name: "event-sequence sample", description: "Entity i와 cutoff c에 조건부인 ordered input입니다." },
          { symbol: "t_avail≤c", name: "availability filter", description: "Prediction 당시 실제로 알 수 있던 records만 허용합니다." },
          { symbol: "k_tie", name: "tie-break key", description: "같은 event timestamp의 순서를 재현하는 ingestion sequence·event ID 같은 보조 key입니다." },
          { symbol: "L_i,c", name: "valid length", description: "Padding 전 실제 event 수이며 row마다 다릅니다." },
        ]}
        assumptions={["Entity key와 source deduplication rule이 고정돼 있습니다.", "Event time·available time·timezone이 training과 serving에서 같습니다.", "Truncation은 이 집합을 만든 뒤 별도 policy로 적용합니다."]}
        interpretation="Event sequence는 원본 log 전체가 아니라 특정 prediction question에서 볼 수 있었던 ordered view입니다."
      />

      <div className="not-prose my-8"><OverviewViz /></div>
    </section>
  );
}
