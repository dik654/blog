import ExplainedFormula from "@/components/ui/explained-formula";
import SvdStagesViz from "./viz/SvdStagesViz";

export default function Svd() {
  return (
    <section id="svd" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">SVD는 회전·축별 scale·회전으로 모든 행렬을 분해한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Singular value decomposition(SVD)은 임의의 m×n 실수 행렬 A를
          <code>UΣVᵀ</code>로 분해합니다. Vᵀ가 input을 서로 직각인 right singular
          direction 좌표로 돌리고, Σ가 각 방향을 singular value만큼 늘리거나 줄인
          뒤, U가 output의 orthonormal direction으로 배치합니다. Singular value가
          크다는 것은 그 방향의 pattern을 A가 강하게 전달한다는 뜻입니다.
        </p>
      </div>
      <SvdStagesViz />
      <ExplainedFormula
        question="SVD의 U, Σ, Vᵀ는 input vector에 어떤 순서로 작용할까요?"
        idea={<>오른쪽에서 왼쪽으로 읽습니다. Vᵀ가 input을 orthonormal coordinate로 바꾸고, diagonal Σ가 방향별 scale만 적용하며, U가 그 성분을 output 공간의 orthonormal directions로 합칩니다.</>}
        formula={String.raw`A=U\Sigma V^\top,\qquad Ax=U\bigl(\Sigma(V^\top x)\bigr),\qquad \sigma_1\ge\sigma_2\ge\cdots\ge0`}
        terms={[
          { symbol: "V", name: "right singular vectors", description: "Input 공간에서 A가 구분하는 orthonormal directions를 column으로 가집니다." },
          { symbol: String.raw`\Sigma`, name: "singular values", description: "각 대응 방향을 얼마나 강하게 전달하는지 나타내는 nonnegative diagonal scale입니다." },
          { symbol: "U", name: "left singular vectors", description: "Scaled component가 놓일 output 공간의 orthonormal directions입니다." },
        ]}
        assumptions={["실수 행렬의 SVD를 사용하며 complex matrix에서는 transpose 대신 conjugate transpose를 씁니다.", "Repeated singular value가 있으면 그 부분공간 안의 singular vectors는 하나로 고정되지 않지만 재구성 결과는 유지됩니다."]}
        interpretation="SVD coordinate 하나에 사람이 읽을 수 있는 의미가 자동으로 붙지는 않습니다. U와 V의 sign도 뒤집을 수 있으며, 중요한 것은 paired directions와 singular value가 함께 만드는 rank-one component입니다."
      />
    </section>
  );
}
