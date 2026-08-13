import MempoolViz from "./viz/MempoolViz";
import MempoolFlowViz from "./viz/MempoolFlowViz";
import type { CodeRef } from "@/components/code/types";

const SYNC_COMPARISON = [
  ["기준점 선택", "피벗 블록을 고른다", "신뢰할 height와 block hash를 정한다"],
  ["검증", "헤더 체인을 내려받는다", "light client로 기준점을 검증한다"],
  ["상태 수신", "state trie node를 chunk로 받는다", "application snapshot chunk를 받는다"],
  ["상태 적용", "누락된 trie를 healing한다", "ABCI OfferSnapshot·ApplySnapshotChunk를 호출한다"],
  ["정상 추적", "남은 블록을 실행한다", "snapshot 이후 블록부터 합의를 따라간다"],
] as const;

const REPO_AREAS = [
  ["abci/", "ABCI interface"],
  ["consensus/", "Tendermint BFT state machine"],
  ["mempool/", "CList·CAT mempool"],
  ["p2p/", "MConnection·PEX·peer 관리"],
  ["state/", "block 실행과 state 저장"],
  ["statesync/", "application snapshot 동기화"],
  ["blocksync/", "block store와 block sync reactor"],
  ["evidence/", "double-signing evidence 관리"],
  ["light/", "light client verification"],
  ["proxy/", "application과의 ABCI connection"],
  ["rpc/", "JSON-RPC·WebSocket API"],
] as const;

export default function MempoolStateSync({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="mempool-statesync" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">멤풀과 State Sync: 트랜잭션을 받는 경로와 새 노드가 따라잡는 경로</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 멤풀과 State Sync는 서로 다른 문제를 해결합니다. 멤풀은 아직 블록에 포함되지 않은 트랜잭션을 검증하고 peer에 전파하는 실시간 경로이고, State Sync는 새 노드가 모든 과거 블록을 다시 실행하지 않고 검증된 application state에서 시작하게 하는 bootstrap 경로입니다. 둘을 함께 보면 “새 입력을 어떻게 받는가”와 “기존 상태를 어떻게 따라잡는가”가 분리되어 보입니다.
        </p>
      </div>
      <div className="not-prose my-8">
        <MempoolViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>멤풀에서는 CometBFT가 순서를 관리하고 application이 유효성을 판단합니다</h3>
        <p>
          Ethereum txpool과 마찬가지로 CometBFT mempool도 미확정 트랜잭션의 대기열입니다. 차이는 nonce와 balance 같은 application rule을 consensus engine이 직접 해석하지 않는다는 데 있습니다. CometBFT가 ABCI <code>CheckTx</code>를 호출하면 application이 현재 <code>checkState</code>를 기준으로 트랜잭션을 검증하고, 통과한 항목만 mempool에 남아 gossip됩니다.
        </p>
      </div>
      <div className="not-prose mb-8">
        <MempoolFlowViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>State Sync는 검증된 snapshot에서 실행을 재개합니다</h3>
        <p>
          Ethereum snap sync가 state trie를 chunk 단위로 내려받는다면 CometBFT State Sync는 application이 내놓은 snapshot을 ABCI로 받아 적용합니다. 두 방식 모두 전체 chain history를 처음부터 replay하지 않는다는 목적은 같지만, CometBFT에서는 consensus node가 application state의 내부 형식을 알지 못한다는 점이 중요합니다.
        </p>
      </div>

      <div data-viz="cometbft-state-sync-comparison" className="not-prose my-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="border-b bg-muted/20 px-5 py-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Bootstrap path</p>
          <h3 className="mt-2 text-lg font-bold">Snap sync와 State Sync는 비슷한 목표를 서로 다른 경계에서 해결합니다</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[660px] text-left text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground">
              <tr><th className="px-4 py-3">단계</th><th className="px-4 py-3">Ethereum snap sync</th><th className="px-4 py-3">CometBFT State Sync</th></tr>
            </thead>
            <tbody>
              {SYNC_COMPARISON.map(([phase, ethereum, comet]) => (
                <tr key={phase} className="border-t"><th className="px-4 py-3 font-semibold">{phase}</th><td className="px-4 py-3 text-muted-foreground">{ethereum}</td><td className="px-4 py-3 text-muted-foreground">{comet}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 border-t p-4 sm:grid-cols-2 sm:p-5">
          <div className="rounded-xl border bg-background p-4"><strong className="text-sm">Trust anchor</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">신뢰할 height와 block hash를 운영 설정에 고정합니다.</p></div>
          <div className="rounded-xl border bg-background p-4"><strong className="text-sm">RPC diversity</strong><p className="mt-2 text-xs leading-5 text-muted-foreground">서로 독립적인 RPC server를 두 곳 이상 사용해 snapshot 기준점을 교차 확인합니다.</p></div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>CList Mempool은 삽입·제거와 gossip 순회를 분리합니다</h3>
      </div>
      <div className="not-prose mb-8 grid gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-3 text-sm font-semibold">CListMempool의 핵심 field</p>
          <div className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <code className="text-xs">proxyAppConn</code><span>ABCI <code>AppConnMempool</code></span>
            <code className="text-xs">txs *clist.CList</code><span>동시 접근을 지원하는 주 transaction list</span>
            <code className="text-xs">cache txCache</code><span>이미 본 transaction의 중복 유입 방지</span>
            <code className="text-xs">txsMap</code><span><code>TxKey</code>에서 list element로 가는 빠른 lookup</span>
            <code className="text-xs">height</code><span>현재 block height</span>
            <code className="text-xs">txBytes</code><span>mempool에 보관 중인 총 byte</span>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-4">
            <p className="mb-3 text-sm font-semibold">Transaction lifecycle</p>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li><strong className="text-foreground">1.</strong> transaction을 받으면 비동기로 <code>CheckTx</code>를 호출합니다.</li>
              <li><strong className="text-foreground">2.</strong> 검증을 통과한 transaction을 CList 뒤에 추가합니다.</li>
              <li><strong className="text-foreground">3.</strong> peer별 cursor를 따라 새 항목만 gossip합니다.</li>
              <li><strong className="text-foreground">4.</strong> commit된 block에 포함된 transaction을 제거합니다.</li>
              <li><strong className="text-foreground">5.</strong> 남은 항목은 새 state에서 다시 <code>CheckTx</code>합니다.</li>
            </ol>
          </div>
          <div className="rounded-xl border bg-card p-4">
            <p className="mb-3 text-sm font-semibold">왜 linked list인가</p>
            <p className="text-sm leading-6 text-muted-foreground">
              뒤에 붙이고 이미 commit된 항목을 제거하는 작업은 각각 O(1)이며, peer gossip은 쓰기와 동시에 list를 순회할 수 있습니다. 이 구조 덕분에 block commit과 transaction 전파가 같은 global lock을 오래 점유하지 않습니다. 실제 최대 항목 수와 byte 제한은 node configuration으로 정합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>저장소를 읽을 때는 두 경로부터 시작합니다</h3>
        <p>
          Transaction 유입을 추적하려면 <code>mempool/</code>에서 <code>CheckTx</code>와 recheck를 따라가고, bootstrap을 추적하려면 <code>statesync/</code>에서 ABCI snapshot 호출로 내려가는 편이 빠릅니다. 나머지 package는 아래처럼 각 경계의 구현을 맡습니다.
        </p>
      </div>
      <div className="not-prose grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {REPO_AREAS.map(([path, role]) => (
          <div key={path} className="min-w-0 rounded-xl border bg-card p-3">
            <code className="break-words text-xs font-bold">{path}</code>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
