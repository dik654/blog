import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function INTT() {
  return (
    <section id="intt" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        INTT는 inverse root와 n⁻¹을 쓰는 같은 transform이다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Roots-of-unity의 geometric sum은 서로 다른 두 column의 inner product를
          0으로 만들고 같은 column에서는 n을 만듭니다. 따라서 inverse matrix는
          ω를 ω⁻¹로 바꾸고 전체를 n⁻¹로 scale한 형태입니다. 이는
          <Link to="/crypto/lagrange"> Lagrange 보간</Link>을 단위근 도메인에
          특화한 빠른 계산입니다.
        </p>
      </div>
      <ExplainedFormula
        question="평가값 y에서 원래 coefficient a를 어떻게 복원할까요?"
        idea="순방향 NTT에서 회전 방향을 반대로 바꾸면 각 coefficient만 n배 남고 나머지는 상쇄됩니다. 마지막에 field inverse n⁻¹을 곱해 정규화합니다."
        formula={String.raw`a_j=n^{-1}\sum_{k=0}^{n-1}y_k\omega^{-jk},\qquad \sum_{k=0}^{n-1}\omega^{k(i-j)}=\begin{cases}n&i=j\\0&i\ne j\end{cases}`}
        annotatedFormula={String.raw`a_j=\underbrace{n^{-1}}_{\text{normalization 계산}}\sum_{k=0}^{n-1}y_k\omega^{-jk},\qquad \sum_{k=0}^{n-1}\omega^{k(i-j)}=\begin{cases}n&i=j\\0&i\ne j\end{cases}`}
        operations={[
          { expression: String.raw`n^{-1}`, annotation: ["normalization이(가) 식의 결과에 기여하는 방식을","계산합니다.","순방향 NTT에서 회전 방향을 반대로 바꾸면 각","coefficient만 n배 남고 나머지는 상쇄됩니다."] },
        ]}
        terms={[
          {
            symbol: String.raw`\omega^{-1}`,
            name: "inverse root",
            description: "같은 subgroup을 반대 순서로 순회하는 root입니다.",
          },
          {
            symbol: "n^{-1}",
            name: "normalization",
            description: "field에서 n·n⁻¹=1을 만족하는 값입니다.",
          },
          {
            symbol: "a_j",
            name: "recovered coefficient",
            description: "xʲ의 원래 coefficient입니다.",
          },
          {
            symbol: "y_k",
            name: "evaluation",
            description: "ωᵏ에서의 입력 다항식 값입니다.",
          },
        ]}
        assumptions={[
          "field characteristic가 n을 나누지 않아 n⁻¹이 존재합니다.",
          "y는 같은 ω 순서로 계산된 n개 evaluation입니다.",
        ]}
        interpretation="구현은 같은 radix-2 kernel에 inverse twiddle을 넣고 마지막 scale pass를 적용할 수 있습니다. Forward와 inverse의 bit-order 계약이 다르면 수학은 맞아도 배열 순서가 틀립니다."
      />
    </section>
  );
}
