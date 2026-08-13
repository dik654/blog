import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import MetricMattersViz from "./viz/MetricMattersViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">평가 지표는 모델 점수표가 아니라, 틀렸을 때 생기는 결과를 숫자로 옮긴 계약입니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          병원에서는 환자를 놓친 오류가, 스팸 필터에서는 정상 메일을 막은 오류가 더 비쌀 수 있습니다. 검색에서는 정답 문서가
          20등에 있는 것보다 2등에 있는 편이 낫고, 수요 예측에서는 1개씩 열 번 틀린 경우와 한 번에 10개를 틀린 경우를 다르게
          다룰 수 있습니다. 그러므로 metric 이름부터 고르지 말고 <strong>누가, 어떤 단위에, 어떤 action을 내리며, 각 오류의 비용이
          무엇인지</strong> 먼저 적어야 합니다.
        </p>
        <p>
          이 글에서 prediction은 model이 내는 score·probability·수치·ranking을 모두 뜻하고, action은 그 prediction을 실제 결정으로
          바꾼 결과를 뜻합니다. 예를 들어 연체 probability 0.73은 prediction이고, threshold를 적용해 심사 대기열로 보내는 것은
          action입니다. Offline metric은 이 action의 실제 결과를 대신 측정하는 proxy이므로 둘을 같은 것으로 보면 안 됩니다.
        </p>
      </div>

      <ExplainedFormula
        question="좋은 metric은 궁극적으로 어떤 양을 작게 만들려는 것일까요?"
        idea={<>배포 환경에서 만날 사례를 확률적으로 뽑고, prediction을 action으로 바꿨을 때 생기는 비용을 평균냅니다. Metric은 이 기대 비용을 제한된 evaluation data에서 근사합니다.</>}
        formula={String.raw`R(f,a)=\mathbb E_{Z\sim P_{\mathrm{deploy}}}\!\left[c\!\left(a(f(X)),Y,Z\right)\right],\qquad \widehat R=\frac{\sum_{i=1}^{n}w_i\,c_i}{\sum_{i=1}^{n}w_i}`}
        terms={[
          { symbol: "f(X)", name: "prediction", description: "입력 X에서 model이 만든 수치·score·probability·ranked list입니다." },
          { symbol: "a", name: "decision policy", description: "Prediction을 threshold·top-k·예약량 같은 실제 action으로 바꾸는 규칙입니다." },
          { symbol: "c", name: "error cost", description: "Action과 결과 Y가 만났을 때 발생한 손실이며 subgroup·시간·처리 비용 Z에 따라 달라질 수 있습니다." },
          { symbol: "Pdeploy", name: "deployment distribution", description: "배포 뒤 실제로 만날 사례·query·entity의 분포입니다." },
          { symbol: "w_i", name: "evaluation weight", description: "한 evaluation unit이 최종 평균에 기여하는 사전 고정 가중치입니다." },
        ]}
        assumptions={[
          "Evaluation row와 배포에서 의사결정이 내려지는 unit이 일치해야 합니다.",
          "Cost 또는 proxy metric의 방향·단위·weight를 candidate 결과를 보기 전에 고정합니다.",
          "Evaluation distribution이 배포 분포와 다르면 importance weighting이나 별도 slice가 필요하며, 숫자 하나가 그 차이를 없애 주지는 않습니다.",
        ]}
        interpretation="False negative 비용이 false positive의 20배라면 accuracy 1% 차이보다 expected cost가 더 중요한 비교가 될 수 있습니다. 반대로 비용을 모르면 임의의 숫자를 business outcome처럼 해석할 수 없습니다."
      />

      <div className="not-prose my-8"><MetricMattersViz /></div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          평균을 낼 때도 순서가 중요합니다. 한 환자에게 영상 1,000장이 있고 다른 환자에게 10장이 있다면 영상을 바로 평균낼 경우
          첫 환자가 100배 크게 반영됩니다. 검색도 결과가 많은 head query가 전체 행을 지배할 수 있습니다. 먼저 의사결정 단위 안에서
          metric을 만들고, 그다음 query·환자·고객을 평균한 뒤, 마지막에 지역이나 언어 같은 slice를 집계해야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="행이 많은 사용자나 query가 전체 점수를 독점하지 않게 하려면 어떤 순서로 평균내야 할까요?"
        idea={<>먼저 가장 작은 관측값으로 unit별 점수를 만들고, unit을 동등하게 평균한 다음, 필요할 때만 사전에 정한 slice weight를 적용합니다.</>}
        formula={String.raw`m_u=\operatorname{reduce}_{i\in I_u}\ell_i,\qquad M_s=\frac{1}{|U_s|}\sum_{u\in U_s}m_u,\qquad M=\sum_s\omega_s M_s`}
        terms={[
          { symbol: "I_u", name: "observations for unit u", description: "한 query·환자·고객처럼 같은 의사결정 단위에 속한 관측들의 index 집합입니다." },
          { symbol: "m_u", name: "unit metric", description: "한 unit 내부 관측을 metric 의미에 맞게 합친 값입니다." },
          { symbol: "U_s", name: "units in slice s", description: "언어·지역·시간대 등 같은 slice에 포함된 평가 unit 집합입니다." },
          { symbol: "omega_s", name: "slice weight", description: "배포 비중 또는 안전 정책에 따라 사전에 정한 slice 가중치이며 합은 보통 1입니다." },
        ]}
        assumptions={[
          "행 평균·unit macro 평균·traffic-weighted 평균 중 어떤 population을 추정하는지 명시합니다.",
          "한 unit의 반복 관측은 독립 표본 수를 늘린 것으로 해석하지 않습니다.",
          "Worst-slice와 subgroup minimum은 전체 평균과 별도 guardrail로 보고합니다.",
        ]}
        interpretation="Query A가 100회, B가 1회 등장해도 query macro 평균에서는 두 query가 각각 절반을 차지합니다. 실제 traffic 경험을 추정할 때만 100:1 weight를 의도적으로 사용합니다."
      />

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          이제 이 계약을 회귀, 분류와 ranking에 차례로 적용합니다. 이 글은 metric의 정의·집계·선택 경계를 소유하고, class imbalance의
          sampling·focal loss나 교차검증의 fold 설계는 해당 글로 연결합니다. 이렇게 경계를 나누면 같은 개념을 여러 글에서 조금씩 다르게
          설명하는 일을 막을 수 있습니다.
        </p>
      </div>
      <ContentBoundary article="evaluation-metrics" />
    </section>
  );
}
