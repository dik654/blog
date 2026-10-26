import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  FeatureAvailabilityLocator,
  FeatureAvailabilityReturn,
} from "../shared/EvaluationContractPathLocator";
import PredictionTimeFeatureFlowViz from "./PredictionTimeFeatureFlowViz";

export default function PredictionTimeFeatureArticle() {
  return (
    <div className="space-y-16">
      <FeatureAvailabilityLocator />
      <PredictionTimeFeatureFlowViz />

      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">과거에 일어난 일과 그때 알 수 있었던 일은 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            검사 시행 시각은 09:50이지만 결과가 시스템에 확정된 시각은 10:20입니다. 10:00 예측은 이 결과를 사용할 수 없습니다. 나중에 데이터베이스를 조회하면 보이는 값이라도 당시 입력에는 없었기 때문입니다.
          </p>
          <p>
            이 글은 제품을 고르지 않습니다. 한 예측 행이 읽은 원본 기록의 <strong>사건 시각</strong>과 <strong>도착 시각</strong>을 분리하고, 입력 마감에서 실제로 허용된 값을 다시 만드는 메커니즘만 설명합니다.
          </p>
        </div>
        <ContentBoundary article="prediction-time-feature-availability" />
        <TermBreakdown
          title="한 입력값의 시간 경계"
          items={[
            {
              term: "사건 시각",
              description: "검사·결제·센서 측정처럼 현실의 사건이 일어난 시각입니다.",
            },
            {
              term: "도착 시각",
              description: "예측 시스템이 그 기록을 실제로 조회할 수 있게 된 시각입니다.",
            },
            {
              term: "입력 마감",
              description: "한 예측 행이 볼 수 있는 정보의 마지막 위치입니다.",
              boundary: "벽시계가 같을 때는 로그 위치나 스냅숏 식별자로 포함 범위를 고정합니다.",
            },
          ]}
        />
      </section>

      <section id="lineage" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">입력값에서 원본 기록까지 거꾸로 추적합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>recent_risk</code>라는 숫자만 저장하면 왜 검사 결과가 빠졌는지 알 수 없습니다. 환자와 원본 기록의 식별자, 사건·도착 시각, 집계 구간, 결합 규칙, 누락 대체 규칙과 버전을 함께 남겨야 합니다. 그래야 10시 입력과 10시 20분 뒤 다시 조회한 입력이 왜 다른지 설명할 수 있습니다.
          </p>
          <pre aria-label="예측 시점에 사용할 기록을 고르는 설명용 SQL">
            <code>{`-- 같은 환자의 원본 기록만 찾습니다.\nWHERE patient_id = :patient_id\n-- 예측 뒤에 일어난 사건을 먼저 제외합니다.\n  AND event_at <= :cutoff\n-- 과거 사건이어도 늦게 도착한 기록은 제외합니다.\n  AND available_at <= :cutoff\n-- 벽시계가 같다면 고정한 snapshot 위치까지만 읽습니다.\n  AND commit_offset <= :cutoff_offset`}</code>
          </pre>
          <p>
            위 SQL은 특정 제품의 복사 가능한 설정이 아니라 판정 순서를 보여주는 설명용 예시입니다. 실제 저장소에서는 유효 시간, 시스템 시간, 수정 이력과 동점 규칙을 해당 엔진의 자료형과 transaction snapshot에 맞춰야 합니다.
          </p>
        </div>
      </section>

      <section id="fixture" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">가장 늦게 도착한 의존 기록을 입력 마감과 비교합니다</h2>
        <ExplainedFormula
          question="집계값 하나의 도착 시각을 왜 원본 중 가장 늦은 시각으로 봅니까?"
          idea={
            <p>
              집계값이 참조한 기록이 모두 도착해야 같은 값을 계산할 수 있습니다. 하나라도 늦으면 완성된 집계값은 그보다 앞선 시점에 존재하지 않았습니다.
            </p>
          }
          formula={String.raw`S_i=\{r\in\operatorname{lineage}(x_i)\mid e_r\le c_i\},\quad a_i^{\mathrm{feat}}=\max_{r\in S_i}a_r,\quad \mathrm{allow}_i=\mathbf1[a_i^{\mathrm{feat}}\le c_i]`}
          annotatedFormula={String.raw`\begin{aligned}S_i&=\underbrace{\{r\in\operatorname{lineage}(x_i)\mid e_r\le c_i\}}_{\text{입력 마감 전에 일어난 의존 기록}}\\a_i^{\mathrm{feat}}&=\underbrace{\max_{r\in S_i}a_r}_{\text{그중 가장 늦은 시스템 도착}}\\\mathrm{allow}_i&=\underbrace{\mathbf1[a_i^{\mathrm{feat}}\le c_i]}_{\text{마감까지 실제로 완성됐을 때만 허용}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{lineage}(x_i)`,
              annotation: ["입력값이 읽은 원본 ID를 따라가", "의존 기록을 복원"],
            },
            {
              expression: String.raw`\max_{r\in S_i}a_r`,
              annotation: ["도착 시각 중 최댓값을 골라", "집계값의 완성 시각을 계산"],
            },
            {
              expression: String.raw`\mathbf1[a_i^{\mathrm{feat}}\le c_i]`,
              annotation: ["완성 시각을 입력 마감과 비교해", "사용 여부를 결정"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`e_r`,
              name: "사건 시각",
              description: "원본 기록 r의 사건이 현실에서 일어난 시각입니다.",
            },
            {
              symbol: String.raw`a_r`,
              name: "도착 시각",
              description: "원본 기록 r을 예측 시스템이 읽을 수 있게 된 시각입니다.",
            },
            {
              symbol: String.raw`c_i`,
              name: "입력 마감",
              description: "예측 행 i가 볼 수 있는 마지막 시각과 스냅숏 위치입니다.",
            },
          ]}
          assumptions={[
            "모든 시각을 같은 시간대와 clock 기준으로 비교합니다.",
            "같은 벽시계 시각의 순서는 스냅숏 식별자나 로그 위치로 고정합니다.",
            "누락 대체는 feature 명세에 미리 정의된 경우에만 사용합니다.",
          ]}
          interpretation="활력 기록은 09:42에 도착해 허용됩니다. 검사 기록은 사건이 09:50이어도 10:20에 도착했으므로 10:00 입력에서 제외됩니다. 두 기록을 모두 요구하는 집계값의 완성 시각은 10:20입니다."
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">이 판정 하나로 모든 데이터 누수가 사라지지는 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            도착 시각을 지켜도 전체 자료로 미리 학습한 scaler, 미래 수정본을 읽는 최신값 결합, 배치와 온라인에서 서로 다른 누락 대체 규칙이 남을 수 있습니다. 원본 도착 경계, fold 안에서만 학습한 상태, 시점 일치 결합(point-in-time join), 배치·온라인 동등성을 서로 다른 검사로 유지해야 합니다.
          </p>
          <p>
            Feast 0.66.0의 공식 문서는 기본 시점 일치 결합이 사건 시각만 제한하며, 당시 실제로 존재한 수정본까지 제한하려면 <code>filter_by_created_timestamp=True</code>가 필요하다고 구분합니다. 이 옵션도 생성 시각 필드가 실제 도착 시각을 뜻한다는 전제가 있어야 합니다. BigQuery의 공식 함수 역시 대상별 입력 마감에 맞는 feature timestamp를 요구합니다.
          </p>
          <ul>
            <li>
              <a href="https://github.com/feast-dev/feast/blob/v0.66.0/docs/getting-started/concepts/point-in-time-joins.md">
                Feast v0.66.0 · Point-in-time joins
              </a>
            </li>
            <li>
              <a href="https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/bigqueryml-syntax-entity-feature-time">
                Google Cloud · ML.ENTITY_FEATURES_AT_TIME
              </a>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            공식 문서는 2026년 10월 26일에 다시 확인했습니다. 제품 기능의 존재는 실제 환경의 시간 품질이나 누수 방지 결과를 대신 증명하지 않습니다.
          </p>
        </div>
      </section>

      <FeatureAvailabilityReturn />
    </div>
  );
}
