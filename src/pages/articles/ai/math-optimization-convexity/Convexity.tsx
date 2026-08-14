import ExplainedFormula from "@/components/ui/explained-formula";
import ConvexChordViz from "./viz/ConvexChordViz";

export default function Convexity() {
  return (
    <section id="convexity" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Convexity: 두 점 사이의 함수가 chord 위로 솟지 않는 구조
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Convex 함수에서는 graph의 두 점을 잇는 선분이 함수 graph보다
          아래로 내려가지 않습니다. 이 구조 때문에 local minimum은 global
          minimum이고, 미분 가능한 convex 함수에서 gradient가 0인 점은 global
          minimizer입니다. 단순히 그릇처럼 보인다는 인상보다 inequality와 domain을
          확인해야 합니다.
        </p>
      </div>
      <ConvexChordViz />
      <ExplainedFormula
        question="함수가 convex인지 두 점과 그 사이의 비율로 어떻게 표현할까요?"
        idea={
          <>
            x와 y를 λ:(1−λ)로 섞은 입력의 함수값이, 두 함수값을 같은
            비율로 섞은 chord보다 크지 않아야 합니다.
          </>
        }
        formula={String.raw`\begin{aligned}
          z&=\lambda x+(1-\lambda)y \\
          f(z)&\le \lambda f(x)+(1-\lambda)f(y) \\
          0&\le\lambda\le1
        \end{aligned}`}
        terms={[
          {
            symbol: String.raw`\lambda`,
            name: "mixing weight",
            description: "두 점 사이 어디를 볼지 정하는 0과 1 사이의 비율입니다.",
          },
          {
            symbol: "z=\lambda x+(1-\lambda)y",
            name: "interpolated input",
            description: "x와 y를 잇는 선분 위의 입력입니다.",
          },
          {
            symbol: String.raw`\lambda f(x)+(1-\lambda)f(y)`,
            name: "chord height",
            description: "두 graph point를 잇는 직선의 높이입니다.",
          },
        ]}
        assumptions={[
          "함수의 domain 자체가 convex set이어야 두 점 사이가 domain 안에 남습니다.",
          "모든 x,y와 모든 λ∈[0,1]에서 inequality가 성립해야 합니다.",
        ]}
        interpretation="x²은 convex지만 −x²은 chord 위로 솟는 concave 함수입니다. x⁴−x²은 구간에 따라 굽음이 달라 전체 실수에서 nonconvex입니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>x²은 정의를 제곱차 하나로 검산할 수 있습니다</h3>
        <p>
          Chord의 높이 <code>λx²+(1−λ)y²</code>에서 섞은 입력의
          제곱 <code>(λx+(1−λ)y)²</code>을 빼면
          <code>λ(1−λ)(x−y)²</code>이 남습니다. λ∈[0,1]에서 모든
          항이 0 이상이므로 chord가 graph 아래로 내려가지 않고, 이로써
          x²의 convexity를 정의에서 바로 확인할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
