import ExplainedFormula from "@/components/ui/explained-formula";

export default function DotProduct() {
  return (
    <section id="dot-product" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Dot product: 두 방향의 일치 정도를 scalar로 줄이기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Dot product는 같은 위치의 coordinate를 곱해 모두 더합니다. 결과가 양수면 두
          vector가 대체로 같은 방향, 0이면 직각, 음수면 반대 방향 성분이 크다는 뜻입니다.
          다만 raw 값에는 두 vector의 길이도 함께 들어 있으므로 방향만 비교하려면 길이로
          나눈 cosine similarity를 사용합니다.
        </p>
      </div>
      <ExplainedFormula
        question="u=(3,4)와 v=(4,−3)은 왜 dot product가 0일까요?"
        idea={<>같은 coordinate끼리의 기여를 더하면 첫 축의 +12와 둘째 축의 −12가 정확히 상쇄됩니다. 기하학적으로는 두 vector가 직각이라 서로의 방향 성분이 0이라는 뜻입니다.</>}
        formula={String.raw`u\cdot v=\sum_{j=1}^{d}u_jv_j=3\times4+4\times(-3)=0=\lVert u\rVert\lVert v\rVert\cos 90^\circ`}
        terms={[
          { symbol: "u_jv_j", name: "coordinate별 기여", description: "같은 축에서 두 vector가 같은 부호면 양수, 반대 부호면 음수입니다." },
          { symbol: String.raw`u\cdot v`, name: "dot product", description: "모든 coordinate 기여를 합친 scalar입니다." },
          { symbol: String.raw`\cos\theta`, name: "방향의 일치", description: "두 길이의 영향을 제거했을 때 남는 −1부터 1 사이의 방향 관계입니다." },
        ]}
        assumptions={["두 vector가 같은 dimension과 좌표계를 사용합니다.", "Angle 식은 Euclidean inner-product space에서 0이 아닌 vector에 사용합니다."]}
        interpretation="Dot product 0은 이 좌표계에서 두 방향이 orthogonal하다는 뜻입니다. 두 vector 중 하나가 zero vector인 경우에는 angle을 정의할 수 없으므로 '90도'라고 해석하지 않습니다."
      />
    </section>
  );
}
