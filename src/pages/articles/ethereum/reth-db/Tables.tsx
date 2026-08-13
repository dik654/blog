import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Tables({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="tables" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Typed table은 Rust type과 disk bytes 사이의 schema contract다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("db-tables", codeRefs["db-tables"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Table&lt;Key,Value&gt;은 잘못된 종류의 record를 같은 bucket에 쓰지 못하게 하지만 disk에는 결국 bytes가 저장됩니다. 따라서
          schema는 table ID, key/value codec version, byte ordering, duplicate-key policy와 logical owner를 함께 가져야 합니다.
          Block number key가 lexicographic order에서도 숫자 순서를 유지하려면 fixed-width big-endian 같은 order-preserving codec이 필요합니다.
        </p>
        <h3>Block 1,000 write set</h3>
        <p>
          Header(1000), canonical_hash(1000), receipts(block→range), account/storage change와 stage checkpoint를 하나의 write transaction에
          넣되 canonical marker는 모든 dependent record가 준비된 뒤 갱신합니다. Secondary index는 primary record에서 재구축할 수 있는지,
          그렇지 않다면 같은 atomic boundary에 반드시 들어가는지 owner를 명시합니다.
        </p>
        <p>
          Schema를 바꿀 때는 versioned decoder·migration cursor·old/new row parity를 두고, unknown version·partial row·duplicate conflict는
          fail closed합니다. Migration manifest는 source/target generation과 마지막 검증 key를 durable하게 기록하고, concurrent reader는
          한 generation만 pin합니다. Dual-read parity가 끝난 뒤 manifest를 원자적으로 target으로 바꾸며, crash 시 cursor부터 idempotent하게
          재개하거나 old snapshot으로 rollback합니다. Compile-time type이 기존 disk bytes의 migration과 semantic compatibility를 자동
          보장하지 않습니다.
        </p>
      </div>
    </section>
  );
}
