import ExplainedFormula from "@/components/ui/explained-formula";
import CodePanel from "@/components/ui/code-panel";
import PrimeReprViz from "./viz/PrimeReprViz";

const representationCode = `// 교육용 계약: limb는 little-endian radix 2^64
struct FieldElement([u64; 4]);

fn decode_canonical(bytes: [u8; 32]) -> Result<FieldElement, DecodeError> {
    let x = parse_little_endian(bytes);
    if x >= MODULUS { return Err(DecodeError::NonCanonical); }
    Ok(to_montgomery(x))
}

fn encode_canonical(x: FieldElement) -> [u8; 32] {
    little_endian_bytes(from_montgomery(x))
}`;

export default function PrimeRepr() {
  return (
    <section id="prime-repr" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Canonical bytes와 내부 limb를 같은 값으로 연결한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Limb는 큰 정수의 고정 폭 조각입니다. 네 개의 <code>u64</code>는
          256-bit 저장공간을 제공하지만, 이것이 자동으로 Fp 원소가 되는 것은
          아닙니다. 외부 입력은 먼저 byte order를 정하고 <code>0≤x&lt;p</code>를
          확인해야 하며, 내부 Montgomery 값은 serialization 전에 normal
          residue로 복원해야 합니다.
        </p>
      </div>
      <PrimeReprViz />
      <ExplainedFormula
        question="little-endian limb 네 개는 어떤 하나의 정수를 뜻할까요?"
        idea="각 limb를 2⁶⁴ 진법의 한 자리로 읽습니다. 낮은 index가 낮은 자리이므로 carry도 index 0에서 3 방향으로 흐릅니다."
        formula={String.raw`x=l_0+2^{64}l_1+2^{128}l_2+2^{192}l_3`}
        annotatedFormula={String.raw`x=\underbrace{l_0+2^{64}l_1+2^{128}l_2+2^{192}l_3}_{\text{수학적 정수 계산}}`}
        operations={[
          { expression: String.raw`l_0+2^{64}l_1+2^{128}l_2+2^{192}l_3`, annotation: ["수학적 정수이(가) 식의 결과에 기여하는 방식을 계산합니다.","각 limb를 2⁶⁴ 진법의 한 자리로 읽습니다."] },
        ]}
        terms={[
          { symbol: "x", name: "수학적 정수", description: "환원이나 Montgomery 변환 전후 의미를 별도로 표시할 값입니다." },
          { symbol: "l_i", name: "64-bit limb", description: "0≤l_i<2⁶⁴인 little-endian radix 자리입니다." },
          { symbol: "p", name: "field modulus", description: "Canonical field residue의 범위 0≤x<p를 정합니다." },
        ]}
        assumptions={[
          "이 식은 limb 배열의 수학적 값만 정하며 외부 byte order는 별도 wire 규격입니다.",
          "네 limb는 256-bit 공간을 표현하지만 field 원소는 canonical 범위 검사를 통과해야 합니다.",
        ]}
        interpretation="[5,1,0,0]은 5+2⁶⁴입니다. 반대로 [5,0,0,1]은 전혀 다른 수입니다. x=p를 받아 0으로 조용히 환원하면 같은 field 원소에 여러 encoding이 생기므로 canonical decoder는 거부해야 합니다."
      />
      <CodePanel
        title="표현 경계 의사코드"
        code={representationCode}
        defaultOpen
        annotations={[
          { lines: [1, 2], color: "sky", note: "고정한 radix·limb order" },
          { lines: [4, 8], color: "emerald", note: "canonical 검사 뒤 내부 표현으로" },
          { lines: [10, 12], color: "amber", note: "normal residue로 돌아온 뒤 encode" },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>덧셈의 한 번 감산은 입력 불변식에 기대는 최적화다</h3>
        <p>
          두 입력이 모두 <code>[0,p)</code>이면 합은 <code>[0,2p)</code>이므로
          carry를 포함해 정확히 계산한 뒤 p를 최대 한 번 빼면 됩니다. 하지만
          non-canonical 입력을 허용했거나 256-bit overflow를 버렸다면 이 근거가
          사라집니다. 조건부 감산은 secret 값에 따른 branch나 memory access를
          만들지 않도록 target code까지 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
