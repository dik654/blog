import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";

const routes = [
  ["데이터 계약", "한 row가 누구의 어느 시점을 나타내며 어떤 column을 사용할 수 있는가"],
  ["강한 출발점", "동일 split의 CatBoost·LightGBM과 단순 MLP/ResNet은 어느 정도인가"],
  ["표현 기회", "embedding·interaction·multimodal·pretraining이 실제 병목을 해결하는가"],
  ["운영 판정", "여러 seed의 품질·calibration·latency·memory가 추가 복잡성을 정당화하는가"],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        테이블 딥러닝은 “row를 어떤 표현으로 바꿀 것인가”에서 출발합니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          은행의 고객 표 한 줄에는 나이 42세, 지역 서울, 최근 30일 결제액
          37만 원처럼 뜻과 단위가 다른 column이 나란히 놓입니다. 순서가 의미인
          문장이나 가까운 pixel이 연결된 이미지와 달리, 표에는 모든 문제에
          공통인 이웃 구조가 없습니다. 따라서 모델은 column의 의미를 보존하면서
          한 row 안의 조건부 관계를 찾아야 합니다.
        </p>
        <p>
          수치형·범주형 feature가 섞인 중소 규모 표에서는 tree boosting이 강한
          baseline인 경우가 많습니다. Tree는 scale 정규화 없이 threshold를 찾고,
          불규칙한 구간 경계를 작은 data에서도 직접 만들 수 있기 때문입니다.
          TabNet은 row마다 여러 차례 feature를 골라 처리하고, FT-Transformer는
          각 column을 vector token으로 바꿔 상호작용을 학습하지만 어느 구조도
          모든 표에서 기본 승자는 아닙니다.
        </p>
        <p>
          이 글은 <Link to="/ai/feature-engineering">예측 시점과 누출 없는 feature</Link>,{" "}
          <Link to="/ai/gradient-boosting">GBDT의 계산과 비교 계약</Link>,{" "}
          <Link to="/ai/attention-theory#self-attention">self-attention의 정본 설명</Link>을
          재사용합니다. 전처리와 attention을 다시 정의하지 않고, 이들이 tabular
          representation에서 맡는 역할과 선택 근거만 확장합니다.
        </p>
      </div>

      <ContentBoundary article="tabular-deep-learning" />

      <ExplainedFormula
        question="서로 뜻이 다른 column을 neural model은 어떤 공통 경로로 prediction까지 보낼까?"
        idea={<>먼저 schema가 raw row를 단위와 category가 명확한 feature vector로 바꾸고, encoder가 task에 유용한 representation을 학습합니다. Prediction head는 그 representation만 받아 target 형식의 output을 냅니다.</>}
        formula={String.raw`\hat y_i=h_{\phi}\!\left(\operatorname{Enc}_{\theta}\!\left(T_{\text{schema}}(x_i)\right)\right)`}
        terms={[
          { symbol: "x_i", name: "raw row", description: "한 entity와 cutoff에 해당하는 수치형·범주형 관측값입니다." },
          { symbol: "T_schema", name: "schema transform", description: "단위·결측·category vocabulary·available-time 규칙을 적용하며 training과 serving에서 같아야 합니다." },
          { symbol: "Enc_θ", name: "learned encoder", description: "TabNet step이나 FT-Transformer block으로 row representation을 만드는 학습 함수입니다." },
          { symbol: "h_φ", name: "prediction head", description: "Representation을 class logit이나 regression value로 바꿉니다." },
        ]}
        assumptions={["각 row의 entity·cutoff·target horizon이 먼저 정의돼 있습니다.", "Schema transform은 training fold에서만 fit하고 serving artifact로 고정합니다.", "Representation의 복잡성은 같은 split과 tuning budget의 baseline에서 검증합니다."]}
        interpretation="딥러닝의 추가 가치는 schema 규칙을 없애는 데 있지 않습니다. 같은 유효 input에서 encoder가 baseline보다 재사용 가능한 representation을 학습하는지가 핵심입니다."
      />

      <figure data-viz="tabular-reading-route" className="not-prose my-8 min-w-0 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
        <figcaption>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary/75">Reading route</p>
          <p className="mt-2 text-lg font-semibold">Architecture 이름보다 네 질문을 순서대로 확인합니다</p>
        </figcaption>
        <div className="mt-6 overflow-hidden rounded-lg border border-border/70">
          {routes.map(([title, body], index) => (
            <div key={title} className={`grid min-w-0 gap-2 px-4 py-4 sm:grid-cols-[2.5rem_9rem_1fr] ${index ? "border-t border-border/60" : ""}`}>
              <p className="text-xs font-bold text-primary/70">0{index + 1}</p>
              <p className="font-semibold">{title}</p>
              <p className="text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </figure>
    </section>
  );
}
