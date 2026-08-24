import ExplainedFormula from "@/components/ui/explained-formula";

export default function DFT() {
  return (
    <section id="dft" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        NTT는 단위근 Vandermonde matrix다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          coefficient aⱼ는 xʲ의 배율이고, output yₖ는 다항식을 ωᵏ에 대입한
          값입니다. Direct NTT는 n개의 output마다 n개 coefficient를 더하므로
          O(n²) field operation이 필요합니다. 빠른 알고리즘은 이 정의를 바꾸지
          않고 matrix의 반복 패턴만 factorization합니다.
        </p>
      </div>
      <ExplainedFormula
        question="계수 벡터를 roots-of-unity 평가값으로 어떻게 바꿀까요?"
        idea="k번째 행에는 평가점 ωᵏ의 0승부터 n−1승까지를 놓습니다. 각 행과 coefficient vector의 dot product가 f(ωᵏ)입니다."
        formula={String.raw`y_k=f(\omega^k)=\sum_{j=0}^{n-1}a_j\omega^{jk},\qquad \mathbf y=W\mathbf a,\ W_{k,j}=\omega^{kj}`}
        annotatedFormula={String.raw`y_k=\underbrace{f(\omega^k)=\sum_{j=0}^{n-1}a_j\omega^{jk},\qquad \mathbf y=W\mathbf a,\ W_{k,j}=\omega^{kj}}_{\text{primitive n-th root 계산}}`}
        operations={[
          { expression: String.raw`f(\omega^k)=\sum_{j=0}^{n-1}a_j\omega^{jk},\qquad \mathbf y=W\mathbf a,\ W_{k,j}=\omega^{kj}`, annotation: ["primitive n-th root이(가) 식의 결과에","기여하는 방식을 계산합니다.","k번째 행에는 평가점 ωᵏ의 0승부터 n−1승까지를 놓습니다."] },
        ]}
        terms={[
          {
            symbol: "a_j",
            name: "coefficient",
            description: "다항식 f(x)의 xʲ 계수입니다.",
          },
          {
            symbol: String.raw`\omega`,
            name: "primitive n-th root",
            description:
              "정확히 n번 거듭제곱할 때 처음 1로 돌아오는 field 원소입니다.",
          },
          {
            symbol: "y_k",
            name: "evaluation",
            description: "k번째 도메인 점 ωᵏ에서의 f 값입니다.",
          },
          {
            symbol: "W",
            name: "NTT matrix",
            description:
              "서로 다른 roots를 행으로 가진 Vandermonde matrix입니다.",
          },
        ]}
        assumptions={[
          "primitive n-th root ω가 field 안에 존재합니다.",
          "평가점 1,ω,…,ω^(n−1)은 서로 다릅니다.",
        ]}
        interpretation="F₁₇, n=4, ω=4에서 f=1+2x+3x²+4x³의 output은 [10,7,15,6]입니다. Direct 계산은 16개 matrix entry를 쓰지만 butterfly는 같은 합을 재사용합니다."
      />
    </section>
  );
}
