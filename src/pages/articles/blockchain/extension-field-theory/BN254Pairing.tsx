import Math from "@/components/ui/math";
import FormulaGuide from "@/components/ui/formula-guide";
import PairingOverviewViz from "./viz/PairingOverviewViz";

export default function BN254Pairing() {
  return (
    <section id="bn254-pairing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BN254 활용: G2 & 페어링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          페어링(pairing) = 서로 다른 두 군의 점을 입력받아 하나의 값을 출력하는
          함수.
          <br />
          BN254 기준: <Math>{"e: G_1 \\times G_2 \\to G_T"}</Math>.
        </p>
        <p>
          핵심 성질 — <strong>양선형성</strong>:
        </p>
        <Math display>{"e(aP,\\; bQ) = e(P,\\; Q)^{ab}"}</Math>
        <p>
          a, b를 모른 채 aP, bQ만으로 <Math>{"ab"}</Math> 관계를 검증할 수 있다.
          <br />
          Groth16 검증:
        </p>
        <Math display>
          {
            "e(A,\\; B) \\stackrel{?}{=} e(\\alpha,\\beta) \\cdot e(L,\\gamma) \\cdot e(C,\\delta)"
          }
        </Math>
        <FormulaGuide
          title="Groth16 페어링 등식의 역할"
          terms={[
            {
              symbol: "A,\\;B,\\;C",
              name: "증명자가 보낸 proof 원소",
              description:
                "witness와 회로 제약을 만족했다는 주장을 G1·G2의 세 점으로 압축한 값입니다.",
            },
            {
              symbol: "\\alpha,\\beta,\\gamma,\\delta",
              name: "검증키 원소",
              description:
                "trusted setup에서 회로에 맞춰 고정되며 proof가 올바른 관계에 놓였는지 대조합니다.",
            },
            {
              symbol: "L",
              name: "공개 입력의 선형 결합",
              description:
                "공개 입력과 검증키 query를 MSM으로 합쳐 검증식에 포함한 값입니다.",
            },
            {
              symbol: "e:G_1\\times G_2\\to G_T",
              name: "쌍선형 페어링",
              description:
                "서로 다른 두 군의 점 관계를 목표 군 GT의 곱셈 등식으로 옮깁니다.",
            },
          ]}
          assumptions={[
            "A·B·C와 검증키는 같은 곡선·부분군·회로 setup을 사용해야 합니다.",
            "입력 점의 curve membership와 subgroup 검사를 생략하면 등식이 맞아도 안전한 검증이 아닙니다.",
          ]}
          interpretation="왼쪽 proof의 결합 관계가 회로 고정값, 공개 입력, witness 잔여항의 세 관계와 정확히 일치하는지 확인합니다. 등식 하나로 보이지만 내부 비용은 여러 pairing과 공개 입력 MSM입니다."
        />
      </div>
      <div className="not-prose">
        <PairingOverviewViz />
      </div>
    </section>
  );
}
