import Math from "@/components/ui/math";
import FormulaGuide from "@/components/ui/formula-guide";
import FinalExpViz from "./viz/FinalExpViz";

export default function FinalExp() {
  return (
    <section id="final-exp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Final Exponentiation 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          페어링의 두 번째 단계. Miller Loop 출력 f를{" "}
          <Math>{"f^{(p^{12}-1)/r}"}</Math>로 변환하여 GT 원소를 만든다.
        </p>
        <p>~3000-bit 지수를 인수분해:</p>
        <Math display>
          {
            "\\frac{p^{12}-1}{r} = (p^6 - 1) \\cdot (p^2 + 1) \\cdot \\frac{p^4 - p^2 + 1}{r}"
          }
        </Math>
        <FormulaGuide
          title="Final exponent를 세 인수로 나누는 이유"
          terms={[
            {
              symbol: "p",
              name: "기저체의 characteristic",
              description:
                "BN254의 Fp 크기를 정하며 Fp12의 전체 곱셈군 크기 p¹²−1을 결정합니다.",
            },
            {
              symbol: "r",
              name: "곡선 부분군의 차수",
              description: "최종 결과가 들어갈 r차 부분군 GT의 크기입니다.",
            },
            {
              symbol: "p^6-1,\\;p^2+1",
              name: "easy part",
              description:
                "Frobenius map과 역원 계산을 활용해 일반 거듭제곱보다 싸게 처리할 수 있습니다.",
            },
            {
              symbol: "(p^4-p^2+1)/r",
              name: "hard part",
              description:
                "cyclotomic subgroup 안에서 addition chain과 곡선 파라미터를 이용해 최적화하는 핵심 구간입니다.",
            },
          ]}
          assumptions={[
            "Miller loop 출력은 Fp12의 0이 아닌 원소이며 BN254의 embedding degree는 12입니다.",
            "단순한 3000-bit 제곱·곱 횟수가 아니라 Frobenius와 cyclotomic squaring 비용으로 구현을 비교해야 합니다.",
          ]}
          interpretation="거대한 지수를 그대로 계산하지 않고 값싼 easy part와 최적화가 필요한 hard part로 분리해, Miller loop의 임의 원소를 정확히 GT 부분군으로 보냅니다."
        />
        <p>각 인수를 순서대로 처리. 약 5,000 Fp 곱셈.</p>
      </div>
      <div className="not-prose">
        <FinalExpViz />
      </div>
    </section>
  );
}
