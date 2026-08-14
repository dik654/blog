import CorrelationViz from "./viz/CorrelationViz";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Correlation() {
  return (
    <section id="correlation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상관계수는 관계를 찾는 출발점이지 피처 점수가 아니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Pearson 상관계수는 선형 관계를, Spearman 순위 상관계수는 단조 관계를
          요약합니다. 둘을 함께 보면 직선에 가깝게 변하는 피처와 값의 순서만
          함께 움직이는 피처를 구분할 수 있습니다. 하지만 상관이 낮아도
          U자형 관계나 특정 집단에서만 나타나는 신호는 강할 수 있고, 상관이
          높아도 누출이나 공통 원인 때문에 생긴 관계일 수 있습니다.
        </p>
        <p>
          따라서 전체 heatmap만 보지 말고 target별 분포, scatter plot,
          시간·group·source별 slice를 함께 봅니다. 관계가 split마다 유지되는지
          확인한 뒤에야 변환이나 interaction 후보로 올리는 편이 안전합니다.
        </p>
      </div>
      <div className="not-prose my-8"><CorrelationViz /></div>
      <ExplainedFormula
        question="Pearson correlation은 두 변수의 선형 동행을 어떤 단위 없는 값으로 만들까요?"
        idea={<>각 값에서 평균을 뺀 deviation의 곱을 더하고, 두 변수의 deviation 크기로 나눕니다. 단위를 제거해 −1에서 1 사이의 선형 동행을 요약하지만 원인 방향이나 비선형 관계는 남기지 않습니다.</>}
        formula={String.raw`\begin{aligned}
r_{xy}&=\frac{\sum_i(x_i-\bar{x})(y_i-\bar{y})}
{\sqrt{\sum_i(x_i-\bar{x})^2}\sqrt{\sum_i(y_i-\bar{y})^2}},\\
x=[1,2,3],\ y=[2,4,6]&\Rightarrow r_{xy}=1.
\end{aligned}`}
        terms={[
          { symbol: String.raw`\bar{x},\bar{y}`, name: "sample means", description: "각 변수의 reference sample 평균입니다." },
          { symbol: "r_xy", name: "Pearson correlation", description: "두 변수의 centered linear co-movement를 정규화한 값입니다." },
          { symbol: "i", name: "paired row", description: "같은 analysis unit에서 관측한 x와 y의 짝입니다." },
        ]}
        assumptions={[
          "각 x_i와 y_i가 같은 unit·시점의 올바른 pair입니다.",
          "두 변수의 variation이 0이 아니며 극단값과 slice mixture를 별도로 확인합니다.",
          "r=1은 이 sample의 완전한 선형 관계이지 x가 y의 원인이라는 증거가 아닙니다.",
        ]}
        interpretation="y=2x인 세 점은 r=1입니다. 그러나 숨은 group이 x와 y를 함께 바꾸었을 수 있고, U자형처럼 강한 비선형 관계는 r≈0으로 보일 수도 있습니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>중복 피처와 다중공선성은 목적에 따라 다르게 다룬다</h3>
        <p>
          다중공선성은 특히 선형 모델의 계수와 불확실성을 해석할 때 문제입니다.
          VIF나 피처 간 상관계수는 진단에 도움을 주지만, 하나의 고정 임계값으로
          자동 삭제하면 서로 다른 의미를 가진 피처까지 잃을 수 있습니다.
          coefficient stability가 목적이라면 중복 피처를 합치거나 regularization을
          적용하고, 예측 성능이 목적이라면 cross-validation으로 제거 전후를
          비교합니다.
        </p>
        <p>
          트리 모델에서도 상관된 피처가 성능에 아무 영향이 없다고 단정할 수는
          없습니다. 중요도가 여러 피처로 나뉘고 sampling이나 regularization에
          따라 선택되는 피처가 달라질 수 있으므로, 해석할 때는 permutation
          importance와 grouped importance를 함께 검토합니다.
        </p>
      </div>
    </section>
  );
}
