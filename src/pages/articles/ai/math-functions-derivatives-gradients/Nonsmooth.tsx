import ExplainedFormula from "@/components/ui/explained-formula";

export default function Nonsmooth() {
  return (
    <section id="nonsmooth" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">매끈하지 않은 점: ReLU와 subgradient</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모든 유용한 함수가 모든 점에서 미분 가능한 것은 아닙니다. ReLU는 0의 왼쪽
          기울기가 0이고 오른쪽 기울기가 1이라 표준 derivative가 하나로 정해지지 않습니다.
          그렇다고 학습 전체를 포기하지는 않습니다. Convex 함수에서는 그 점을 받치는
          직선의 기울기 범위를 subgradient로 정의하고, 구현은 그중 일관된 값을 선택합니다.
        </p>
      </div>
      <ExplainedFormula
        question="ReLU는 x=0에서 derivative가 없는데 역전파를 어떻게 실행할까요?"
        idea={<>0을 제외한 곳의 기울기는 명확합니다. 0에서는 가능한 subgradient 범위 [0,1] 가운데 framework가 convention 하나를 정해 계산을 계속합니다.</>}
        formula={String.raw`\operatorname{ReLU}(x)=\max(0,x),\qquad \partial\operatorname{ReLU}(0)=[0,1],\qquad \text{implementation often uses }0`}
        terms={[
          { symbol: String.raw`\max(0,x)`, name: "piecewise function", description: "음수에서는 0, 양수에서는 입력을 그대로 반환합니다." },
          { symbol: String.raw`\partial\operatorname{ReLU}(0)`, name: "subdifferential", description: "0에서 convex subgradient로 허용되는 기울기들의 집합입니다." },
          { symbol: "0", name: "implementation convention", description: "Autodiff가 정확히 0에 도달했을 때 선택하는 대표값이며 유일한 수학적 derivative라는 뜻은 아닙니다." },
        ]}
        assumptions={["여기서 [0,1]은 convex-analysis의 subgradient 집합입니다.", "미분 불가능 지점에서 임의 값을 정해도 모든 optimization 문제가 자동으로 수렴하는 것은 아닙니다."]}
        interpretation="|x|의 0에서는 subgradient가 [−1,1]이고 ReLU의 0에서는 [0,1]입니다. 왼쪽·오른쪽 기울기가 다르다는 사실과 구현이 선택한 backward 값을 구분해야 합니다."
      />
    </section>
  );
}
