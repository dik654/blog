import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Primitives({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="primitives" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Address·B256·U256은 width가 아니라 허용 연산까지 구분한다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("primitives-addr", codeRefs["primitives-addr"])} />
        <CodeViewButton onClick={() => onCodeRef("primitives-u256", codeRefs["primitives-u256"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Address는 20-byte account identifier, B256은 32-byte opaque digest, U256은 256-bit unsigned arithmetic value입니다.
          B256와 U256은 폭이 같지만 B256에 덧셈을 하거나 U256을 그대로 hash identity로 비교하는 API는 의미를 흐립니다. Newtype은
          이 실수를 compile-time conversion 경계로 밀어냅니다.
        </p>
        <p>
          FixedBytes&lt;N&gt;은 정확히 N bytes를 요구하므로 19-byte address는 padding 없이 거절합니다. Byte order는 conversion마다
          명시합니다. 예를 들어 32-byte big-endian U256에서 마지막 byte 0x0f는 값 15지만 little-endian limb 배열의 첫 limb가 15인
          내부 표현과 wire byte sequence는 다릅니다.
        </p>
        <p>
          `as` cast나 unchecked slice는 짧고 빠르지만 length·overflow evidence를 지웁니다. External bytes는 checked constructor로
          받고, truncate·pad가 protocol rule인 경우에만 함수 이름과 source/target width를 receipt에 남깁니다.
        </p>
      </div>
    </section>
  );
}
