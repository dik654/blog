import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Usage() {
  return (
    <section id="usage" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        한 점만 필요하면 barycentric form을 쓴다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          매 query마다 전체 coefficient polynomial을 전개할 필요는 없습니다.
          고정된 xᵢ에 대해 barycentric weight를 한 번 precompute하면 새로운
          z에서의 L(z)를 O(n) field operation으로 평가할 수 있습니다. 단 z가
          표본점과 같으면 분모가 0이므로 해당 y값을 직접 반환합니다.
        </p>
      </div>
      <ExplainedFormula
        question="고정된 표본에서 새 점 z의 보간값을 전개 없이 어떻게 구할까요?"
        idea="각 basis의 고정 denominator를 weight wᵢ로 미리 저장하고, 공통 factor를 약분한 barycentric ratio를 계산합니다."
        formula={String.raw`w_i=\left(\prod_{j\ne i}(x_i-x_j)\right)^{-1},\qquad L(z)=\frac{\sum_i\frac{w_i y_i}{z-x_i}}{\sum_i\frac{w_i}{z-x_i}}`}
        annotatedFormula={String.raw`w_i=\underbrace{\left(\prod_{j\ne i}(x_i-x_j)\right)^{-1},\qquad L(z)=\frac{\sum_i\frac{w_i y_i}{z-x_i}}{\sum_i\frac{w_i}{z-x_i}}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\left(\prod_{j\ne i}(x_i-x_j)\right)^{-1},\qquad L(z)=\frac{\sum_i\frac{w_i y_i}{z-x_i}}{\sum_i\frac{w_i}{z-x_i}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","각 basis의 고정 denominator를 weight","wᵢ로 미리 저장하고, 공통 factor를 약분한","barycentric ratio를 계산합니다."] },
        ]}
        terms={[
          {
            symbol: "w_i",
            name: "barycentric weight",
            description:
              "표본 x 좌표만으로 한 번 계산하는 inverse product입니다.",
          },
          {
            symbol: "z",
            name: "query point",
            description: "interpolant 값을 알고 싶은 새 field 원소입니다.",
          },
          {
            symbol: "y_i",
            name: "sample value",
            description: "xᵢ에서의 알려진 평가값입니다.",
          },
        ]}
        assumptions={[
          "z가 xᵢ와 같으면 ratio 대신 yᵢ를 직접 반환합니다.",
          "모든 denominator inverse는 같은 field에서 계산합니다.",
        ]}
        interpretation="x 좌표가 고정된 protocol에서는 weight를 재사용할 수 있습니다. 모든 coefficient가 필요하면 일반 보간 O(n²)보다 단위근 도메인의 INTT 같은 구조화된 알고리즘이 적합합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>어떤 방법을 선택할까요?</h3>
        <p>
          임의의 점 몇 개에서 한 번 복원한다면 Lagrange 식이 단순합니다. 같은 x
          좌표에서 많은 query를 처리한다면 barycentric weight를
          precompute합니다. 도메인이 2의 거듭제곱 크기의 roots of unity이고 전체
          평가값과 coefficient를 반복해서 오간다면{" "}
          <Link to="/crypto/fft">NTT·INTT</Link>가 O(n log n) 구조를 제공합니다.
          NTT는 별개의 보간 정의가 아니라 특수한 평가 도메인에서 같은 linear
          map을 빠르게 계산하는 방법입니다.
        </p>
      </div>

      <div
        id="paper-barycentric-interpolation"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          논문 읽기 · barycentric form
        </p>
        <p className="mt-2 text-sm font-semibold">
          Berrut &amp; Trefethen (2004), Barycentric Lagrange Interpolation
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          문제는 Lagrange polynomial을 효율적이고 수치적으로 안정적으로 평가하는
          방법입니다. 논문은 두 barycentric form과 실수 floating-point에서의
          특성을 정리합니다. 이 글은 algebraic identity와 precomputation 구조를
          finite field에 재사용하지만, 실수의 rounding-error 결론을 finite-field
          구현에 그대로 적용하지 않습니다.
        </p>
        <a
          href="https://doi.org/10.1137/S0036144502417715"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
        >
          논문 원문 보기
        </a>
      </div>
    </section>
  );
}
