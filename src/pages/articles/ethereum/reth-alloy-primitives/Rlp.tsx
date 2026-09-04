import CodeViewButton from "@/components/code/CodeViewButton";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Rlp({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="rlp" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">RLP는 값의 의미가 아니라 byte string과 list의 길이를 canonical하게 적는다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("rlp-traits", codeRefs["rlp-traits"])} />
        <CodeViewButton onClick={() => onCodeRef("rlp-derive", codeRefs["rlp-derive"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          RLP(Recursive Length Prefix)는 byte string과 그 list만 구분합니다. Address·nonce·transaction이라는 의미와 field 순서는
          상위 schema가 정합니다. 같은 bytes라도 schema가 다르면 다른 object입니다. 0x00..0x7f인 한 byte는 자기 자신이고 길이 0..55의
          string/list는 kind와 payload length를 prefix 한 byte에 담습니다. 더 길면 length-of-length를 사용합니다.
        </p>
        <h3>숫자 15와 1024의 worked example</h3>
        <p>
          Integer는 unsigned big-endian minimal bytes로 바꾼 뒤 byte string으로 encode합니다. 15는 0x0f 하나라 그대로 0x0f입니다.
          1024는 0x0400 두 bytes라 short-string prefix 0x82를 붙여 0x82 04 00이 됩니다. 1024를 0x00 04 00으로 쓰면 leading
          zero가 있는 non-canonical 표현이며 같은 수의 byte identity가 둘이 생기므로 거절해야 합니다.
        </p>
        <h3>Schema가 소유하는 것</h3>
        <p>
          Transaction list의 field 개수·순서·optional rule은 RLP 자체가 확인하지 않습니다. Encoder는 예상 length와 실제 출력이
          같아야 하고 decoder는 list payload 끝을 정확히 소비해야 합니다. Round-trip test도 decode(encode(x))=x뿐 아니라 다시
          encode한 bytes가 원본 canonical bytes와 같은지 검사합니다.
        </p>
      </div>
    </section>
  );
}
