import ExplainedFormula from "@/components/ui/explained-formula";
import InteractionViz from "./viz/InteractionViz";

export default function Interaction() {
  return (
    <section id="interaction" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Interaction은 “둘이 함께 있을 때” 달라지는 효과를 새 좌표로 만듭니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          광고 노출 횟수의 효과가 신규 고객과 기존 고객에게 다르다면 두 피처의
          영향은 단순히 더해지지 않습니다. 면적, 부채비율, 객단가처럼 곱·비율·
          차이가 독립된 업무 의미를 가질 때도 마찬가지입니다. Tree나 깊은
          network가 일부 관계를 스스로 학습할 수 있지만, 작은 데이터와 선형
          모델에서는 그 관계를 새 좌표로 직접 주면 필요한 함수가 단순해집니다.
        </p>
        <p>
          계산 전에 단위와 정의를 고정해야 합니다. 매출을 거래 수로 나눈 값은
          거래가 없을 때 정의되지 않습니다. 작은 상수를 무조건 분모에 더하기보다
          “거래 없음”, “금액 0”, “기록 누락”을 구분하는 indicator와 fallback을
          정합니다. 두 원본 값이 같은 cutoff에 사용 가능한지도 확인합니다.
        </p>
      </div>

      <ExplainedFormula
        question="선형 모델에 곱 피처 하나를 추가하면 표현할 수 있는 관계가 어떻게 달라질까?"
        idea={<>원래 선형 모델에서는 x₁의 효과 w₁이 x₂와 무관하게 고정됩니다. 곱 x₁x₂를 새 피처로 넣으면 x₁의 기울기가 w₁+w₁₂x₂가 되어, x₂의 값에 따라 x₁의 효과가 달라집니다.</>}
        formula={String.raw`\hat y=b+w_1x_1+w_2x_2+w_{12}x_1x_2,\qquad \frac{\partial \hat y}{\partial x_1}=w_1+w_{12}x_2`}
        terms={[
          { symbol: "x₁, x₂", name: "원본 피처", description: "같은 cutoff에서 사용할 수 있고 단위가 정의된 두 입력입니다." },
          { symbol: "x₁x₂", name: "interaction feature", description: "두 값이 함께 변할 때의 결합 효과를 담는 새 좌표입니다." },
          { symbol: "w₁₂", name: "interaction coefficient", description: "x₂가 변할 때 x₁의 효과가 얼마나 달라지는지 정합니다." },
          { symbol: String.raw`\partial\hat y/\partial x_1`, name: "x₁의 국소 효과", description: "다른 값을 고정했을 때 x₁을 조금 바꾼 prediction 변화율입니다." },
        ]}
        assumptions={["이 식은 linear regression scale에서의 interaction을 설명합니다.", "두 피처의 단위와 중심화 방식에 따라 coefficient 해석이 달라집니다.", "관측 association을 표현할 뿐 causal effect를 자동으로 식별하지 않습니다."]}
        interpretation="Interaction을 추가하면 decision surface가 휘어질 수 있지만, 가능한 모든 조합을 만들 이유는 없습니다. 업무 가설이 있는 항부터 추가하고 main effect도 함께 유지한 채 validation에서 확인합니다."
      />

      <div className="not-prose my-8"><InteractionViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>가능한 모든 조합 대신 가설을 제한합니다</h3>
        <p>
          범주형 교차와 고차 polynomial은 입력 수가 늘수록 조합 수를 빠르게
          늘리고 드문 조합을 만듭니다. EDA나 domain rule에서 근거가 있는
          조합부터 추가하고, regularization과 같은 fold의 ablation으로 확인합니다.
          Hierarchy principle에 따라 interaction을 넣을 때 관련 main effect도
          유지하면 coefficient 해석과 model 안정성이 좋아지는 경우가 많습니다.
        </p>
        <p>
          중요도가 낮다는 이유만으로 바로 제거하지도 않습니다. 상관된 원본
          피처가 대신 사용되거나 특정 subgroup에서만 효과가 있을 수 있으므로,
          전체 metric과 함께 subgroup 성능과 seed별 coefficient 안정성을 봅니다.
        </p>
      </div>
    </section>
  );
}
