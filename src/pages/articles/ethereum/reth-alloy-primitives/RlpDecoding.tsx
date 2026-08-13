import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function RlpDecoding({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="rlp-decoding" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">안전한 RLP decode는 header를 읽기 전에 allocation과 소비 범위를 정한다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("rlp-decode-header", codeRefs["rlp-decode-header"])} />
        <CodeViewButton onClick={() => onCodeRef("rlp-decode-exact", codeRefs["rlp-decode-exact"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <ol>
          <li>전체 input byte cap을 먼저 적용하고 첫 byte가 요구하는 header 길이가 남아 있는지 확인합니다.</li>
          <li>Length-of-length의 leading zero·overflow와 declared payload가 남은 input 안에 있는지 검사합니다.</li>
          <li>String/list kind와 상위 schema의 기대 kind·field count를 맞춥니다.</li>
          <li>Bounded subslice 안에서 child를 decode하고 마지막에 남은 bytes가 0인지 확인합니다.</li>
        </ol>
        <p>
          예를 들어 0xb8 0x02 0xaa는 “2-byte string”을 선언하지만 payload가 한 byte뿐이므로 InputTooShort입니다. 0x81 0x01은
          0x01 하나로 표현할 수 있어 non-canonical이고, valid object 뒤에 0x00을 붙인 input은 prefix object만 읽는 API와
          exact-object API를 구분하지 않으면 smuggling이 됩니다.
        </p>
        <p>
          Decoder error는 truncated, non-canonical, overflow, wrong kind, schema mismatch, trailing bytes로 나눕니다. Fuzz·boundary
          fixture에서는 panic·unbounded allocation·partial state mutation이 없어야 하며 오류의 peer 책임은 호출 문맥에서 정합니다.
        </p>
      </div>
    </section>
  );
}
