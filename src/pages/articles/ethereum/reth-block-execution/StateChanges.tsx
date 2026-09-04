import type { CodeRef } from "@/components/code/types";

export default function StateChanges({
  onCodeRef: _,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="state-changes" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        BundleState는 rollback용 original과 commit용 present 값을 함께 보존한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Overlay가 current value만 들고 있으면 account A가 10→11로 바뀐 사실은
          알지만 unwind 때 10으로 되돌릴 근거가 없습니다. Bundle은 account의
          original/present 상태, storage original/present, create·destroy·wipe
          상태와 block별 revert 경계를 보존해 forward commit과 rollback 양쪽에서
          같은 change ownership을 사용합니다.
        </p>
        <h3>Block output postconditions</h3>
        <p>
          두 transaction의 receipt 순서, cumulative gas의 마지막 값, logs bloom,
          receipts root와 계산된 post-state root를 header와 비교합니다. 단순히
          final balance가 같아도 receipt status·log·gas가 다르면 같은 execution
          결과가 아닙니다.
        </p>
        <h3>Release gate</h3>
        <p>
          Invalid nonce/signature/intrinsic gas, revert와 exceptional halt,
          create/selfdestruct/storage wipe, fork activation, batch 중간 crash,
          root mismatch와 reorg를 EELS fixture와 base/candidate에 넣습니다.
          Receipt·gas·log·bundle original/present·post-root parity를 통과한 뒤
          tx/s, allocation, state-read count와 commit latency를 비교합니다.
        </p>
        <p>
          Reth v2.2.0 source가 관찰한 bundle과 executor 구조는 구현 snapshot이며 fault injection·receipt
          completeness·rollback artifact는 이 글의 hardening 계약입니다. 둘을 protocol 자체의 필수 type 이름으로 일반화하지 않습니다.
        </p>
      </div>
    </section>
  );
}
