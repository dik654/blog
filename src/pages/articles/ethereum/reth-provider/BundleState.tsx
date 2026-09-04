import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function BundleState({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="bundle-state" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">BundleState는 실행 결과와 되돌리기 evidence를 함께 들고 있는 overlay다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("bundle-state", codeRefs["bundle-state"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Block 1,001을 실행하면 account A의 balance 10→7, storage slot x의 0→5와 새 bytecode가 생길 수 있습니다. BundleState는
          post value만 캐시하지 않고 original value, changed/touched/self-destruct 상태와 block별 revert journal을 같은 branch identity에
          연결해 commit 전 query와 reorg unwind가 같은 evidence를 사용하게 합니다.
        </p>
        <h3>Overlay revision과 승격</h3>
        <p>
          View receipt에는 parent hash, executed block hash/range, bundle revision과 base generation을 고정합니다. 새
          block을 extend하면 revision이 증가하고 다른 parent branch의 bundle은 섞지 않습니다. DB commit은 bundle write set·revert
          set·receipts와 canonical marker를 원자적 generation으로 승격하며 성공 receipt 뒤에만 cache를 durable로 표시합니다.
        </p>
        <p>
          Crash가 commit 전이면 bundle을 다시 실행할 수 있고 commit 성공 여부가 불명확하면 DB generation과 block marker를 조회해
          reconcile합니다. 단순 retry로 같은 changeset을 두 번 적용하거나 revert journal 없이 post-state만 저장하면 reorg 안전성을 잃습니다.
        </p>
      </div>
    </section>
  );
}
