import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function BabyGiant() {
  return (
    <section id="baby-giant" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Baby-step Giant-step: 시간과 메모리를 √q로 맞바꾼다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          q개 지수를 차례로 시험하는 대신 x를 i·m+j로 분해합니다. j 방향의 baby-step gʲ를 hash table에 저장하고, Y에 g⁻ᵐ을 반복 곱하는 giant-step이 table과 만나는 순간 i,j를 얻습니다. 이는 연산을 없애는 것이 아니라 동일한 중간값을 저장해 meet-in-the-middle하는 time–memory trade-off입니다.
        </p>
      </div>
      <CryptoFoundationsViz mode="bsgs-grid" />
      <ExplainedFormula
        question="왜 baby table과 giant walk의 만남이 x를 복원할까요?"
        idea="m=ceil(√q)로 두면 0≤x&lt;q인 모든 지수를 x=im+j로 쓸 수 있습니다. Y=gˣ의 양변에 g⁻ⁱᵐ을 곱하면 저장한 baby-step gʲ와 같아집니다."
        formula={String.raw`m=\lceil\sqrt q\rceil,\quad x=im+j,\quad Y(g^{-m})^i=g^j\quad\Longrightarrow\quad x=im+j\pmod q`}
        annotatedFormula={String.raw`m=\underbrace{\lceil\sqrt q\rceil,\quad x=im+j,\quad Y(g^{-m})^i=g^j\quad\Longrightarrow\quad x=im+j\pmod q}_{\text{subgroup order 계산}}`}
        operations={[
          { expression: String.raw`\lceil\sqrt q\rceil,\quad x=im+j,\quad Y(g^{-m})^i=g^j\quad\Longrightarrow\quad x=im+j\pmod q`, annotation: ["subgroup order이(가) 식의 결과에 기여하는 방식을","계산합니다.","m=ceil(√q)로 두면 0≤x q인 모든 지수를","x=im+j로 쓸 수 있습니다."] },
        ]}
        terms={[
          { symbol: "q", name: "subgroup order", description: "찾는 exponent가 mod q에서 놓이는 후보 공간 크기입니다." },
          { symbol: "m", name: "split width", description: "Baby와 giant 두 축을 비슷한 크기로 만드는 ceil(√q)입니다." },
          { symbol: "j", name: "baby index", description: "Table에 저장한 gʲ의 위치입니다." },
          { symbol: "i", name: "giant index", description: "Y에서 gᵐ 단위로 뒤로 이동한 횟수입니다." },
        ]}
        assumptions={["Y가 g가 생성하는 알려진 order q subgroup 안에 있어 해가 존재합니다.", "Group equality와 inverse가 정확하고 table key encoding이 canonical합니다."]}
        interpretation="q=16이면 m=4이고 Y=5, g=3에서 g⁻⁴≡4 mod 17입니다. 5·4≡3이 baby table의 j=1과 만나므로 i=1, x=1·4+1=5입니다. 일반 비용은 O(√q) time과 O(√q) memory입니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Pollard rho와 실제 security bits</h3>
        <p>
          Pollard rho는 group element를 pseudo-random walk로 순회하다 collision을 찾아 선형 congruence를 풀어 log를 얻습니다. 저장 table을 줄이고 기대 O(√q) group operations를 유지하지만 probabilistic runtime, distinguished points와 parallelization 조건이 있습니다. Prime-order q가 약 2²⁵⁶이면 generic square-root scale은 약 2¹²⁸이지만, 이것을 곧바로 “128-bit 보안”으로 보고하려면 curve-specific attacks, multi-target, hardware, protocol leakage와 quantum threat를 함께 제외하거나 평가해야 합니다.
        </p>
      </div>
      <div id="paper-shanks-bsgs" className="scroll-mt-24">
        <CitationBlock source="Shanks (1971) · Class number, a theory of factorization, and genera" href="https://www.ams.org/books/pspum/020/" citeKey={2}>
          문제: 큰 순환 구조에서 index와 관련 number-theoretic 값을 전수 탐색보다 빠르게 계산합니다. 기여: baby-step/giant-step의 meet-in-the-middle 전략으로 알려진 방법의 고전적 출처입니다. 전제: finite cyclic group operation·order bound·table lookup이 가능합니다. 근거 범위: square-root time–memory algorithm의 기원과 구조입니다. 비주장: 오늘날 모든 DLP implementation의 최적 constant·parallel speedup·curve별 security를 정하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
