import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">이산로그는 group element에서 숨은 scalar를 되찾는 문제다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          공개키 암호에서 signer는 secret scalar x를 고르고 공개 group element Y=gˣ 또는 additive notation의 Y=[x]G를 공개합니다. x에서 Y로 가는 scalar multiplication은 double-and-add나 square-and-multiply로 빠르지만, Y만 보고 x를 되찾는 discrete logarithm problem(DLP)은 적절한 큰 subgroup에서 비싸다고 가정합니다. “유한체의 로그”라는 표현보다 <strong>고정 generator에 대한 group element의 지수 좌표를 찾는 문제</strong>라고 읽는 편이 정확합니다.
        </p>
        <p>
          먼저 group·generator·order를 고정해야 문제의 범위가 정해집니다. g가 order q인 subgroup을 생성하면 x는 mod q에서만 유일하고, Y가 그 subgroup 밖에 있으면 해가 없습니다. Field arithmetic와 multiplicative order는 <Link to="/crypto/finite-field-theory#prime-field">유한체 정본</Link>, elliptic-curve point group의 구현은 <Link to="/crypto/elliptic-curves">타원곡선 정본</Link>에서 이어집니다.
        </p>
      </div>
      <ContentBoundary article="discrete-log" />
      <CryptoFoundationsViz mode="dlp-asymmetry" />
      <ExplainedFormula
        question="큰 x에서도 gˣ을 왜 빠르게 계산할 수 있을까요?"
        idea="x를 binary로 분해하고 매 bit마다 현재 값을 square한 뒤 bit가 1일 때만 g를 곱합니다. 지수 크기가 아니라 지수를 적는 bit 수에 비례합니다."
        formula={String.raw`x=\sum_{i=0}^{\ell-1}b_i2^i\quad\Longrightarrow\quad g^x=\prod_{i:b_i=1}g^{2^i},\qquad \ell=\lfloor\log_2x\rfloor+1`}
        terms={[
          { symbol: "b_i", name: "exponent bit", description: "x의 i번째 binary digit로 0 또는 1입니다." },
          { symbol: "g^{2^i}", name: "successive squares", description: "직전 값을 한 번 square해 얻는 group element입니다." },
          { symbol: "\ell", name: "bit length", description: "필요한 square step 수의 크기를 정합니다." },
        ]}
        assumptions={["Group operation과 equality가 효율적이고 g·Y encoding이 canonical합니다.", "Side-channel이 중요한 secret exponent 구현은 constant-time algorithm을 별도로 사용합니다."]}
        interpretation="x=13=1101₂이면 g,g²,g⁴,g⁸을 만들고 g·g⁴·g⁸을 곱합니다. 약 log₂x step이라는 정방향 비용만으로 역방향이 어렵다는 사실이 증명되지는 않으며, 다음 절의 공격을 따로 분석해야 합니다."
      />
      <div id="paper-pollard-dlp" className="scroll-mt-24">
        <CitationBlock source="Pollard (1978) · Monte Carlo Methods for Index Computation (mod p)" href="https://doi.org/10.1090/S0025-5718-1978-0491431-9" citeKey={1}>
          문제: 큰 cyclic group의 index, 즉 discrete logarithm을 큰 lookup table 없이 찾습니다. 기여: pseudo-random walk와 collision을 이용한 rho method를 제시해 기대 O(√q) group operations와 작은 memory trade-off를 만듭니다. 전제: group order·partition/walk와 collision equation이 유효합니다. 근거 범위: 논문의 algorithm과 분석 범위입니다. 비주장: 모든 구체 group에서 최선의 공격이 generic rho이거나 256-bit modulus가 곧 128-bit security라는 뜻은 아닙니다.
        </CitationBlock>
      </div>
    </section>
  );
}
