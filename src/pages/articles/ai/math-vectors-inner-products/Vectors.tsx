import ExplainedFormula from "@/components/ui/explained-formula";

export default function Vectors() {
  return (
    <section id="vectors" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Scalar와 vector: 숫자를 묶는 규칙부터 시작하기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Vector는 화살표 모양 자체가 아니라 <strong>어떤 의미의 좌표를 어떤 순서로
          묶었는지</strong>가 핵심입니다. 예를 들어 x=(3,4)는 평면의 위치일 수도 있고,
          상품의 가격과 평점을 묶은 feature일 수도 있습니다. 두 vector를 더하려면 차원이
          같고 각 좌표의 의미도 대응해야 합니다. 키와 나이를 위치 좌표처럼 더하면 계산은
          가능해도 해석은 성립하지 않습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Vector를 더하거나 scalar 배율로 늘리면 각 좌표는 어떻게 바뀔까요?"
        idea={<>같은 위치의 좌표끼리 더하고, scalar는 모든 좌표에 같은 배율로 곱합니다. 이 두 연산이 여러 방향을 조합하는 linear combination의 출발점입니다.</>}
        formula={String.raw`x=(3,4),quad y=(-1,2)qquad\Longrightarrow\qquad x+y=(2,6),\quad 2x=(6,8)`}
        annotatedFormula={String.raw`x=\underbrace{(3,4),quad y=(-1,2)qquad\Longrightarrow\qquad x+y=(2,6),\quad 2x=(6,8)}_{\text{vector addition 계산}}`}
        operations={[
          { expression: String.raw`(3,4),quad y=(-1,2)qquad\Longrightarrow\qquad x+y=(2,6),\quad 2x=(6,8)`, annotation: ["vector addition이(가) 식의 결과에 기여하는","방식을 계산합니다.","같은 위치의 좌표끼리 더하고, scalar는 모든 좌표에 같은","배율로 곱합니다."] },
        ]}
        terms={[
          { symbol: "x,y", name: "2차원 vector", description: "각각 두 개의 대응하는 좌표를 가진 대상입니다." },
          { symbol: "2", name: "scalar", description: "방향은 유지하면서 vector의 모든 성분과 길이를 두 배로 만듭니다." },
          { symbol: "x+y", name: "vector addition", description: "첫 좌표끼리, 둘째 좌표끼리 더한 새 vector입니다." },
        ]}
        assumptions={["두 vector의 dimension과 각 coordinate의 의미가 같아야 합니다.", "좌표의 단위가 다르면 normalization이나 단위 변환 없이 크기를 비교하지 않습니다."]}
        interpretation="Vector 연산은 좌표별 계산이지만 결과는 다시 방향과 크기를 가진 하나의 대상입니다. 차원이 같다는 사실만으로 두 representation의 의미까지 같아지는 것은 아닙니다."
      />
    </section>
  );
}
