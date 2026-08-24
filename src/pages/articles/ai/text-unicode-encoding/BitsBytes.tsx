import ExplainedFormula from "@/components/ui/explained-formula";

export default function BitsBytes() {
  return (
    <section id="bits-bytes" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Bit는 두 상태, byte는 bit 여덟 개를 묶은 저장 단위다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Bit 하나는 0 또는 1의 두 상태를 가집니다. Bit가 하나 늘어날 때마다 가능한 pattern 수가 두 배가 되므로, 여덟 bit를 묶은 byte 하나에는 256가지 pattern이 있습니다. Text file의 크기와 UTF-8 길이는 보통 이 byte 단위로 셉니다.
        </p>
      </div>
      <ExplainedFormula
        question="8개의 binary 자리가 서로 독립적으로 0 또는 1일 때 몇 가지 pattern을 만들까?"
        idea={<>각 자리마다 두 선택지가 있고 여덟 자리의 선택 수를 곱합니다. 따라서 2를 여덟 번 곱한 2⁸개 pattern이 생기며, unsigned 정수로 읽으면 0부터 255까지입니다.</>}
        formula={String.raw`1\ \mathrm{byte}=8\ \mathrm{bits},\qquad 2^8=256,\qquad 00000000_2\ldots11111111_2=0\ldots255`}
        annotatedFormula={String.raw`1\ \mathrm{byte}=\underbrace{8\ \mathrm{bits},\qquad 2^8=256,\qquad 00000000_2\ldots11111111_2=0\ldots255}_{\text{eight-bit unit 계산}}`}
        operations={[
          { expression: String.raw`8\ \mathrm{bits},\qquad 2^8=256,\qquad 00000000_2\ldots11111111_2=0\ldots255`, annotation: ["eight-bit unit이(가) 식의 결과에 기여하는 방식을","계산합니다.","각 자리마다"] },
        ]}
        terms={[
          { symbol: String.raw`\mathrm{bit}`, name: "binary digit", description: "0 또는 1인 한 자리입니다." },
          { symbol: String.raw`\mathrm{byte}`, name: "eight-bit unit", description: "파일 크기와 UTF-8 code unit을 세는 기본 묶음입니다." },
          { symbol: "2^8", name: "number of patterns", description: "각각 두 선택인 여덟 자리의 조합 수입니다." },
        ]}
        assumptions={["현대 일반-purpose system의 8-bit byte를 사용합니다."]}
        interpretation="Byte 하나가 문자 하나라는 뜻은 아닙니다. UTF-8에서는 code point 하나가 1~4 byte를 사용하고, 사용자에게 보이는 grapheme 하나는 여러 code point로 구성될 수 있습니다."
      />
    </section>
  );
}
