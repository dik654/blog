import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function FixedBytesInternal({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="fixed-bytes" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">FixedBytes&lt;N&gt;은 길이 invariant를 constructor에서 한 번 증명한다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("fixed-bytes-struct", codeRefs["fixed-bytes-struct"])} />
        <CodeViewButton onClick={() => onCodeRef("fixed-bytes-addr", codeRefs["fixed-bytes-addr"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          `FixedBytes&lt;20&gt;` 안에 값이 들어온 뒤에는 길이가 20이라는 전제를 매 호출마다 다시 검사하지 않아도 됩니다. 그러나 `&amp;[u8]`에서 만드는
          경계에서는 exact length를 검사해야 합니다. Zero padding·truncation은 Address 변환이나 hash 절단처럼 protocol이 명시한 함수에서만
          수행합니다.
        </p>
        <p>
          같은 내부 배열을 감싸더라도 Address와 B160은 의미가 다를 수 있습니다. Transparent layout이 FFI·serialization byte identity까지
          자동으로 보장하지는 않으므로 ABI, RLP, serde와 database codec 각각의 구현을 version fixture로 확인합니다. Unsafe cast는
          alignment·length·validity 전제가 모두 증명되는 좁은 내부 경계가 아니면 사용하지 않습니다.
        </p>
      </div>
    </section>
  );
}
