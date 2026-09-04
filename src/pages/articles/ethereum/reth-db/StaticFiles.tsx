import CodeViewButton from "@/components/code/CodeViewButton";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function StaticFiles({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="static-files" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Static file은 immutable history를 싸게 읽되 coverage manifest로 DB와 연결한다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("db-static-file", codeRefs["db-static-file"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Finalized·mature history는 append/seal한 segment로 옮겨 mutable DB의 write amplification을 줄일 수 있습니다. 그러나 “파일이
          존재한다”만으로 읽을 수 있는 것은 아닙니다. Segment kind, block range [start,end], row count, codec/schema version,
          checksum과 source DB generation을 manifest에 기록하고 원자적으로 publish해야 합니다.
        </p>
        <h3>Move가 아니라 copy→verify→publish→retire</h3>
        <ol>
          <li>고정한 DB snapshot에서 block 0..999 history를 staging segment에 씁니다.</li>
          <li>Row/root/checksum과 range gap·overlap을 검증하고 fsync policy를 적용합니다.</li>
          <li>Manifest를 atomic switch해 reader가 새 segment를 보게 합니다.</li>
          <li>Provider dual-read parity와 rollback window를 지난 뒤 mutable copy를 prune합니다.</li>
        </ol>
        <p>
          Publish 전 crash는 staging을 버리고 publish 후 prune 전 crash는 두 copy 중 manifest owner를 따릅니다. Prune이 먼저
          일어나거나 manifest가 DB canonical generation과 다르면 history gap이 생기므로 startup reconciliation에서 fail
          closed합니다.
        </p>
        <h3>DB release gate</h3>
        <p>
          Wrong codec, duplicate key, mid-transaction crash, commit 뒤 power-loss simulation, segment truncation·checksum mismatch,
          migration crash와 reorg를 old/new layout에 주입합니다. Logical rows·canonical hash·state root·cursor range·restart recovery parity를
          통과한 뒤 write/read amplification과 disk size를 비교하고 binary·schema·snapshot rollback 절차를 함께 검증합니다.
        </p>
      </div>
    </section>
  );
}
