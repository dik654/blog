import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        피처 엔지니어링은 예측 순간의 현실을 한 행으로 만드는 일입니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          8월 1일 09:00에 고객 C-1042의 연체를 예측한다고 합시다. 7월 24일에
          도착한 신용등급 B와 cutoff 전 거래 12건은 쓸 수 있지만, 같은 날
          14:20에 생긴 연체 처리 결과는 제외합니다. 그 결과 row에는
          <code>tx_count_30d=12</code>와 <code>credit_grade=B</code>가 남습니다.
        </p>
        <h3>그림을 보기 전에 결과를 예상해 보세요</h3>
        <ol>
          <li>Event가 cutoff 전에 일어났어도 system 도착 시각이 cutoff 뒤라면 그 record를 쓸 수 있을까요?</li>
          <li>8월 1일 14:20의 연체 처리 결과를 09:00 prediction row에 넣어도 될까요?</li>
          <li>같은 고객이 train과 validation에 섞여도 random split이면 leakage가 자동으로 사라질까요?</li>
        </ol>
        <p>
          세 답은 모두 <strong>아니요</strong>입니다. Event time과 available time이
          모두 cutoff 이하여야 하며, 반복 고객은 배포 단위에 맞는 group·time
          split으로 분리해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8"><OverviewViz /></div>
      <ContentBoundary article="feature-engineering" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          원본 record를 그대로 넣기 어려운 이유도 여기에 있습니다. 거래 log는 여러 행이고 model은 보통 한 prediction entity를 고정 길이 vector로
          받습니다. 따라서 최근 30일 거래 횟수처럼 event를 집계하거나 매출과 거래 수에서 객단가를 계산하고, category를 model이 처리할 숫자로 바꿉니다. 이 변환에는 항상
          entity, cutoff time, source, 단위, 결측·새 category 처리 규칙이 따라야 합니다.
        </p>
        <p>
          이 글은 <Link to="/cs/ai/deep-learning-overview#learning-loop">input feature와 target, train·validation·test</Link>,{" "}
          <Link to="/cs/ai/math-variance-sampling#variance">평균과 분산</Link>을
          재사용합니다. 먼저 예측 행의 시간 경계를 고정한 뒤 수치형 변환,
          category 인코딩, interaction과 집계로 확장하고, 마지막에 selection과
          training-serving parity를 확인합니다.
        </p>
      </div>

      <ExplainedFormula
        question="한 피처가 미래 정보를 보지 않았다는 조건을 수식으로 어떻게 적을까?"
        idea={<>예측 대상 entity e와 cutoff time t₀를 먼저 고정합니다. 피처 함수 g<sub>j</sub>에는 event가 일어난 시각뿐 아니라 실제 system에 도착한 시각도 t₀ 이하인 record만 넣습니다. 뒤늦게 입력된 정보까지 과거 event라는 이유로 사용하면 당시에는 알 수 없었던 값을 보게 됩니다.</>}
        formula={String.raw`\begin{aligned}
\mathcal R(e,t_0)=\{r:\;&\operatorname{entity}(r)=e,\\
&t_{\mathrm{event}}(r)\le t_0,\\
&t_{\mathrm{available}}(r)\le t_0\},\\
x_j(e,t_0)&=g_j\!\left(\mathcal R(e,t_0)\right).
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
\mathcal R(e,t_0)=\{r:\;&\operatorname{entity}(r)=e,\\
&\underbrace{t_{\mathrm{event}}(r)\le t_0}_{\text{cutoff 전에 발생}},\\
&\underbrace{t_{\mathrm{available}}(r)\le t_0}_{\text{cutoff 전에 system에 도착}}\},\\
x_j(e,t_0)&=\underbrace{g_j\!\left(\mathcal R(e,t_0)\right)}_{\text{허용된 record만 feature로 변환}}.
\end{aligned}`}
        operations={[
          { expression: String.raw`t_{\mathrm{event}}(r)\le t_0`, annotation: ["현실의 사건이 prediction cutoff 뒤라면 제외합니다."] },
          { expression: String.raw`t_{\mathrm{available}}(r)\le t_0`, annotation: ["과거 사건이어도 system 도착이 cutoff 뒤라면 제외합니다."] },
          { expression: String.raw`g_j\!\left(\mathcal R(e,t_0)\right)`, annotation: ["두 시간 조건을 통과한 같은 entity의 record만 j번째 feature로 바꿉니다."] },
        ]}
        terms={[
          { symbol: "e", name: "prediction entity", description: "고객·설비·주문처럼 예측 한 건의 기준이 되는 대상입니다." },
          { symbol: "t₀", name: "cutoff time", description: "Prediction을 내린다고 가정한 시각입니다. 이후 정보는 피처 계산에서 제외합니다." },
          { symbol: "t_event", name: "event time", description: "거래나 측정이 현실에서 발생한 시각입니다." },
          { symbol: "t_available", name: "available time", description: "해당 record가 실제 feature pipeline에서 읽을 수 있게 된 시각입니다." },
          { symbol: "g_j", name: "feature transform", description: "허용된 record를 j번째 숫자 또는 category로 바꾸는 versioned 함수입니다." },
          { symbol: "R(e,t₀)", name: "eligible records", description: "Entity와 두 시간 조건을 모두 만족해 cutoff에서 실제로 사용할 수 있는 record 집합입니다." },
        ]}
        assumptions={["모든 row에 entity와 cutoff time이 정의돼 있습니다.", "Backfill·지연 도착을 구분할 available time을 기록하거나 보수적으로 근사합니다.", "Target이 확정되는 시각과 prediction cutoff를 별도로 관리합니다."]}
        interpretation="Point-in-time correctness는 timestamp column 하나를 필터링하는 요령이 아니라, 당시 시스템이 알고 있던 세계를 재현하는 계약입니다. 이 계약을 만족하지 못하면 model이 아니라 dataset이 미래를 본 것입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>누출은 target column을 복사했을 때만 생기지 않습니다</h3>
        <p>
          Target leakage는 prediction 시점에 정당하게 사용할 수 없는 정보가
          feature 생성 과정으로 들어간 경우를 뜻합니다. 전체 dataset 평균으로 결측값을 채우거나 validation label을 target encoding에 포함하면
          <em> split leakage</em>가 생깁니다.
        </p>
        <p>
          예측 뒤의 event를 집계하면 <em>temporal leakage</em>, 결과 처리 column을 원인처럼 쓰면 <em>target proxy leakage</em>입니다. 무작위
          split은 사용자나 시간이 반복되는 문제에서 이 관계를 자동으로 끊지 못합니다.
        </p>

        <div id="paper-leakage" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · 사용할 자격이 있는 정보인가</p>
          <p className="mt-2 text-sm font-semibold">Leakage in Data Mining: Formulation, Detection, and Avoidance</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Kaufman 등은 leakage를 target을 추론하는 데 정당하게 사용할 수 없는 정보가 학습에 들어간 문제로 정식화하고 observation별 legitimacy와
            learn–predict separation을 제안했습니다. 이는 시간 필터 하나로 모든 누출을 막는다는 주장이 아니라, 실제 의사결정 시점과 데이터 생성 과정을 먼저 정의해야
            한다는 근거입니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1145/2382577.2382579" target="_blank" rel="noreferrer">원 논문의 leakage 정의와 회피 절차 보기</a>
        </div>

        <h3>좋은 피처는 네 번의 질문을 통과합니다</h3>
        <p>
          피처는 cutoff 시점에 계산할 수 있어야 하고 통계나 mapping은 train fold에서만 학습해야 합니다. Batch training과 online serving도 같은 source,
          단위, version, fallback을 사용해야 합니다.
        </p>
        <p>
          같은 split과 seed에서 피처를 뺀 baseline보다 품질이나 운영 비용이 실제로 좋아져야 합니다. 이 조건을 코드, data lineage, parity test,
          ablation 결과로 남긴 것이 피처 계약입니다.
        </p>
      </div>
    </section>
  );
}
