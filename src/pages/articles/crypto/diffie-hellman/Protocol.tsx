import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import DHFlowViz from "./viz/DHFlowViz";

export default function Protocol() {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        프로토콜 흐름: parameter → ephemeral 공개값 → 같은 group element
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          장난감 F₂₃*에서 g=5, Alice secret a=6, Bob secret b=15로 계산합니다.
          공개값은 A=5⁶ mod23=8, B=5¹⁵ mod23=19입니다. 이 예는 메시지 순서와
          등식의 직관만 주며 실제 보안은 group order 22가 너무 작아 없습니다.
        </p>
      </div>
      <DHFlowViz />
      <ExplainedFormula
        question="서로 다른 secret을 가진 두 참여자가 왜 같은 shared group element를 얻을까요?"
        idea="Exponentiation이 같은 base에서 지수 곱셈으로 합성되므로 상대 공개값에 자기 exponent를 적용하는 두 순서가 같습니다. Elliptic-curve 표기에서는 B=[b]G와 [a]B=[ab]G로 바뀝니다."
        formula={String.raw`A=g^a,\quad B=g^b,\qquad K_A=B^a=g^{ba}=g^{ab}=A^b=K_B`}
        annotatedFormula={String.raw`A=\underbrace{g^a,\quad B=g^b,\qquad K_A=B^a=g^{ba}=g^{ab}=A^b=K_B}_{\text{raw DH output 계산}}`}
        operations={[
          { expression: String.raw`g^a,\quad B=g^b,\qquad K_A=B^a=g^{ba}=g^{ab}=A^b=K_B`, annotation: ["raw DH output이(가) 식의 결과에 기여하는 방식을","계산합니다.","Exponentiation이 같은 base에서 지수 곱셈으로","합성되므로 상대 공개값에 자기 exponent를 적용하는 두"] },
        ]}
        terms={[
          { symbol: "G,g", name: "agreed group and generator", description: "Order와 encoding, membership rule까지 고정한 public domain입니다." },
          { symbol: "a,b", name: "secret exponents", description: "CSPRNG로 생성하고 지정한 exponent/scalar 범위에서 해석합니다." },
          { symbol: "A,B", name: "ephemeral public values", description: "검증 후 peer identity와 transcript에 결속할 공개 입력입니다." },
          { symbol: "K", name: "raw DH output", description: "바로 AEAD key로 쓰지 않고 KDF input keying material로 넘깁니다." },
        ]}
        assumptions={[
          "Public value가 기대한 group/subgroup과 encoding policy를 통과합니다.",
          "Exponent가 예측 불가능하고 session/domain 사이에 재사용되지 않습니다.",
          "등식은 peer authentication, key confirmation, KDF domain separation을 제공하지 않습니다.",
        ]}
        interpretation="장난감 예에서 Alice는 19⁶ mod23=2, Bob은 8¹⁵ mod23=2를 얻습니다. 공격자 Mallory가 A와 B를 자기 공개값으로 바꿔 두 개의 다른 K를 만들 수 있으므로 같은 값을 계산했다는 사실만으로 상대가 누구인지 알 수 없습니다."
      />
      <div id="paper-rfc7748-x25519" className="scroll-mt-24">
        <CitationBlock source="RFC 7748 · X25519 and X448" href="https://www.rfc-editor.org/rfc/rfc7748.html" citeKey={2}>
          문제: 현대 elliptic-curve DH의 curve, scalar 처리, byte encoding과 test
          vector를 interoperable하게 고정합니다. 기여: X25519/X448 function,
          little-endian input/output, ladder와 DH 절차를 규정합니다. 전제: RFC의
          scalar decoding·u-coordinate acceptance와 all-zero output 처리 지침을
          그대로 따릅니다. 근거 범위: X25519/X448 primitive와 DH 사용입니다.
          비주장: peer authentication, transcript KDF, 모든 side-channel과 application
          key lifecycle을 자동 해결하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
