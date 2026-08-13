import ContextViz from "./viz/ContextViz";
import type { CodeRef } from "@/components/code/types";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Mempool은 합의 전 transaction의 입구와 재검증을 맡는다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Mempool은 합의가 아니라 proposal 후보를 준비하는 local buffer다. 각
          노드는 자신이 받은 transaction을 ABCI <code>CheckTx</code>로
          검증하고, 현재 head가 바뀌면 포함·제거·재검증 상태를 갱신한다.
        </p>

        {/* ── Mempool interface ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Mempool interface & 구현체
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Mempool interface 핵심 메서드
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">
                  CheckTx(tx, callback, txInfo) error
                </code>{" "}
                — TX 검증
              </li>
              <li>
                <code className="text-xs">RemoveTxByKey(txKey) error</code> — TX
                제거
              </li>
              <li>
                <code className="text-xs">
                  ReapMaxBytesMaxGas(maxBytes, maxGas) Txs
                </code>{" "}
                — 블록 제안용
              </li>
              <li>
                <code className="text-xs">
                  Update(height, txs, results, preFn, postFn) error
                </code>{" "}
                — 블록 후 정리
              </li>
              <li>
                <code className="text-xs">
                  TxsAvailable() &lt;-chan struct{}
                </code>{" "}
                — TX 도착 알림
              </li>
              <li>
                <code className="text-xs">Size() int</code> /{" "}
                <code className="text-xs">SizeBytes() int64</code>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              왜 interface 추상화?
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>트랜잭션 받기·제안·커밋 경계 안정화</li>
              <li>실제 보관 전략과 테스트 대체 가능</li>
              <li>애플리케이션의 proposal policy와 노드 멤풀을 분리</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              번들된 스냅샷: CListMempool
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>concurrent linked list 기반</li>
              <li>링크드 리스트 순회와 key map 조합</li>
              <li>중복 제거 via cache</li>
              <li>recheck cursor와 gossip 소비자 지원</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">
              현재 설정 경계
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">flood</code> — 검증된 tx를 노드가
                gossip
              </li>
              <li>
                <code className="text-xs">app</code> — 보관·제안 선택을 app
                경계에 위임
              </li>
              <li>
                <code className="text-xs">nop</code> — CometBFT 멤풀을 사용하지
                않음
              </li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">
              전체 Flow
            </div>
            <div className="text-sm text-muted-foreground">
              TX 수신 → <code className="text-xs">CheckTx</code> (ABCI) →{" "}
              <code className="text-xs">addTx()</code> → Gossip to peers → Block
              inclusion (<code className="text-xs">PrepareProposal</code>) →
              Post-commit cleanup (<code className="text-xs">Update</code>)
            </div>
          </div>
        </div>
        <p className="leading-7">
          핵심 lifecycle은{" "}
          <strong>
            CheckTx → 보관/전파 → proposal 후보 → commit 후 update
          </strong>
          다. 다만 현재 구현은 flood·app·nop 경로를 구분하므로, 예전 CListMempool
          하나를 모든 노드의 현재 기본값으로 읽으면 안 된다.
        </p>
      </div>
    </section>
  );
}
