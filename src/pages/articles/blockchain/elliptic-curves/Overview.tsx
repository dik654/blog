import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">타원곡선 암호는 곡선의 모양이 아니라 점들의 유한군을 사용한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          실수 평면의 부드러운 곡선 그림은 덧셈 법칙을 떠올리는 직관일 뿐입니다. 구현은 prime field Fp의 좌표 (x,y) 가운데 curve equation을 만족하는 점과 point at infinity O를 모아 유한한 아벨군을 만듭니다. Secret scalar k로 [k]P를 계산하는 것은 빠르지만 P,[k]P에서 k를 찾는 elliptic-curve DLP가 비싸다는 비대칭을 서명·키 교환·commitment에 사용합니다.
        </p>
        <p>
          이 글은 point addition, scalar multiplication, prime-order subgroup validation, affine/Jacobian 표현과 BN254 G1·G2의 타입 경계를 구현 관점에서 연결합니다. Mod p 산술과 inverse는 <Link to="/crypto/finite-field-theory">유한체 정본</Link>, square-root attack의 의미는 <Link to="/crypto/discrete-log">DLP 정본</Link>을 재사용합니다. Pairing의 Miller loop·final exponentiation은 후속 <Link to="/crypto/pairing">pairing 글</Link>에서 확장합니다.
        </p>
      </div>
      <ContentBoundary article="elliptic-curves" />
      <ExplainedFormula
        question="Short-Weierstrass 식이 실제로 nonsingular curve를 만들었는지 어떻게 확인할까요?"
        idea="Curve에 cusp나 self-intersection이 생기면 tangent 기반 group law가 깨집니다. Discriminant가 0이 아닌 parameter만 사용해 그런 singularity를 제외합니다."
        formula={String.raw`E/\mathbb F_p:\ y^2=x^3+ax+b,\qquad 4a^3+27b^2\not\equiv0\pmod p`}
        terms={[
          { symbol: "p", name: "base-field modulus", description: "좌표 arithmetic을 환원하는 odd prime입니다." },
          { symbol: "a,b", name: "curve coefficients", description: "Curve instance를 정하는 field elements입니다." },
          { symbol: "O", name: "point at infinity", description: "Affine 좌표 밖에 추가한 point-addition identity입니다." },
        ]}
        assumptions={["Characteristic 2·3의 특수식을 제외한 short-Weierstrass form입니다.", "표준 curve의 parameter를 사용하며 임의 a,b를 security parameter로 채택하지 않습니다."]}
        interpretation="BN254 G1은 a=0,b=3이므로 discriminant 조건은 27·9≠0 mod p입니다. Curve 위에 있다는 사실만으로 prime-order subgroup membership이나 safe parameter selection이 끝나지는 않습니다."
      />
      <div id="paper-sec1-elliptic-curve" className="scroll-mt-24">
        <CitationBlock source="SECG SEC 1 v2.0 · Elliptic Curve Cryptography" href="https://www.secg.org/sec1-v2.pdf" citeKey={1}>
          문제: Elliptic-curve domain parameter·key·point encoding과 validation을 interoperable하게 정의합니다. 기여: field/curve parameter, octet conversion, public-key validation과 scheme primitives를 제공합니다. 전제: 선택한 curve/domain parameter와 validation level을 고정합니다. 근거 범위: SEC 1이 규정한 ECC algorithm·representation입니다. 비주장: BN254 pairing·모든 curve의 현재 security level·특정 library의 constant-time 구현을 자동 보장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
