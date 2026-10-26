import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function FixedBytesInternal({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="fixed-bytes" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">외부 바이트는 타입 안으로 들어올 때 길이를 검사합니다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("fixed-bytes-struct", codeRefs["fixed-bytes-struct"])} />
        <CodeViewButton onClick={() => onCodeRef("fixed-bytes-addr", codeRefs["fixed-bytes-addr"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>FixedBytes&lt;20&gt;</code> 안에 값이 들어온 뒤에는 길이가 20인지 매번 다시 셀 필요가 없습니다. alloy-primitives의
          <code>TryFrom&lt;&amp;[u8]&gt;</code>는 입력 slice가 정확히 N바이트일 때만 값을 만듭니다. 따라서 19바이트 주소는
          자동으로 0을 채우지 않고 실패합니다.
        </p>
        <p>
          반면 CREATE 주소 계산은 32바이트 digest의 마지막 20바이트를 취하라고 프로토콜이 명시합니다. 이 절단은 임의 변환이 아니라
          이름과 범위가 정해진 단계입니다. 길이 오류를 숨기는 자동 padding과 규칙이 요구하는 변환을 구별해야 합니다.
        </p>
      </div>
    </section>
  );
}
