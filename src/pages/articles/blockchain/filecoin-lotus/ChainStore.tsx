import ChainStoreViz from './viz/ChainStoreViz';
import StateMgrViz from './viz/StateMgrViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ChainStore({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="chainstore" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ChainStore &amp; StateManager</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p className="leading-7">
          Lotus 노드의 <strong>핵심 데이터 레이어</strong>.<br />
          ChainStore: block/TipSet 저장.<br />
          StateManager: 상태 쿼리 + 마이그레이션 담당.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">ChainStore 구조체 추적</h3>
      <ChainStoreViz onOpenCode={openCode} />

      <h3 className="text-lg font-semibold mt-8 mb-3">StateManager 구조체 추적</h3>
      <StateMgrViz onOpenCode={openCode} />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── ChainStore 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ChainStore 구조체 상세</h3>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">ChainStore 구조체 <code className="text-xs bg-muted px-1 py-0.5 rounded">chain/store/store.go</code></h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Storage</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><code className="text-xs">chainBlockstore</code> — <code className="text-xs">blockstore.Blockstore</code> block data</li>
                <li><code className="text-xs">stateBlockstore</code> — <code className="text-xs">blockstore.Blockstore</code> state tree (split)</li>
                <li><code className="text-xs">chainLocalBlockstore</code> — 로컬 블록</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Chain Tip</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><code className="text-xs">heaviest</code> — <code className="text-xs">*types.TipSet</code> 현재 chain tip</li>
                <li><code className="text-xs">bestTips</code> — <code className="text-xs">chan *types.TipSet</code> tip 업데이트 채널</li>
                <li><code className="text-xs">reorgCh</code> — <code className="text-xs">chan&lt;- reorg</code> reorg 이벤트</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Index</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><code className="text-xs">tipsets</code> — <code className="text-xs">map[abi.ChainEpoch][]types.TipSetKey</code></li>
                <li><code className="text-xs">cindex</code> — <code className="text-xs">*ChainIndex</code> epoch 빠른 조회</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Key Methods</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><code className="text-xs">Load()</code> — boot-up chain reload</li>
                <li><code className="text-xs">PutTipSet()</code> — new tipset 추가</li>
                <li><code className="text-xs">GetHeaviestTipSet()</code> — 현재 tip</li>
                <li><code className="text-xs">GetBlock()</code> / <code className="text-xs">WalkChain()</code></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">TipSet 구조체</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">cids</code> — <code className="text-xs">[]cid.Cid</code> block CIDs</li>
              <li><code className="text-xs">blks</code> — <code className="text-xs">[]*BlockHeader</code></li>
              <li><code className="text-xs">height</code> — <code className="text-xs">abi.ChainEpoch</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Blockstore Split 목적</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>chainBlockstore</strong> — block data (영구 보존)</li>
              <li><strong>stateBlockstore</strong> — state tree (snapshot 가능)</li>
              <li>분리 → state pruning으로 disk 절약</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          ChainStore: <strong>tipset 저장 + heaviest tracking</strong>.<br />
          dual blockstore (chain + state) 분리 관리.<br />
          ChainIndex로 과거 epoch 빠른 조회.
        </p>

        {/* ── StateManager 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateManager 상세</h3>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">StateManager 구조체 <code className="text-xs bg-muted px-1 py-0.5 rounded">chain/stmgr/stmgr.go</code></h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Core</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><code className="text-xs">cs</code> — <code className="text-xs">*store.ChainStore</code></li>
                <li><code className="text-xs">ex</code> — <code className="text-xs">*executor.Executor</code></li>
                <li><code className="text-xs">newVM</code> — <code className="text-xs">NewVMFunc</code> VM 생성자</li>
                <li><code className="text-xs">Syscalls</code> — <code className="text-xs">vm.SyscallBuilder</code></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-xs text-muted-foreground mb-1">Cache & Upgrade</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><code className="text-xs">stCache</code> — <code className="text-xs">*lru.Cache[TipSetKey, stCacheEntry]</code></li>
                <li><code className="text-xs">upgradeSchedule</code> — hard fork 스케줄</li>
                <li>vesting states (Ignition/Calico)</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Key Methods</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">TipSetState()</code> — 상태 계산</li>
              <li><code className="text-xs">Call()</code> — read-only query</li>
              <li><code className="text-xs">CallWithGas()</code> — write simulation</li>
              <li><code className="text-xs">LoadActor()</code> / <code className="text-xs">GetActor()</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">State Computation</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>tipset 입력</li>
              <li>parent state load</li>
              <li>messages 적용 (BLS → Secp)</li>
              <li>state tree delta 계산</li>
              <li>new state root 반환</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Network Upgrades</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Ignition (2020)</li>
              <li>Calico (2021)</li>
              <li>Shark (2023)</li>
              <li>FEVM rollout</li>
              <li>각 upgrade: state migration</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          StateManager: <strong>상태 계산 + 쿼리 + 마이그레이션</strong>.<br />
          stCache LRU 캐싱으로 re-computation 회피.<br />
          network upgrade (hard forks) 관리.
        </p>

        {/* ── 통합 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ChainStore ↔ StateManager 통합</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Flow 1: 새 tipset 적용</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>ChainSync가 peers로부터 tipset 수신</li>
              <li><code className="text-xs">PutTipSet(tipset)</code></li>
              <li><code className="text-xs">TipSetState(tipset)</code> 호출</li>
              <li>Message execution → new state root</li>
              <li><code className="text-xs">ParentStateRoot</code>와 비교</li>
              <li>valid면 accept + heaviest 업데이트</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Flow 2: State Query</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>RPC: <code className="text-xs">GetActor(addr, tipset)</code></li>
              <li>StateManager가 tipset state load</li>
              <li>StateTree traversal (HAMT)</li>
              <li><code className="text-xs">Actor</code> struct 반환</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Flow 3: Message 실행</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><code className="text-xs">ApplyMessage()</code></li>
              <li>VM invocation → Actor method call</li>
              <li>state tree 업데이트</li>
              <li>gas accounting</li>
              <li>receipt 반환</li>
            </ol>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Storage & Persistence</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Blockstore</strong> — content-addressed (Badger)</li>
              <li><strong>Datastore</strong> — key-value (LevelDB)</li>
              <li><strong>Cache</strong> — in-memory LRU</li>
              <li>총 disk: ~500-800 GiB (pruning 시 ~10 GiB)</li>
              <li>Checkpoint: 1200 epochs recent + daily archival</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Performance</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>state computation: <strong>100-500ms</strong> per tipset</li>
              <li>HAMT traversal: <strong>O(log n)</strong></li>
              <li>cache hit rate: <strong>90%+</strong> typical</li>
              <li className="pt-1 border-t border-border mt-1">Bottleneck: disk I/O, VM 실행, BLS 검증, migration</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          ChainStore + StateManager: <strong>데이터 저장 + 상태 계산 분리</strong>.<br />
          new tipset → apply → validate → accept.<br />
          500-800 GiB disk, 100-500ms state computation.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "split blockstore"인가</strong> — state 크기 관리.<br />
          chain data: 영구 보존 필요 (history).<br />
          state data: snapshot 가능 (현재만 중요).<br />
          splitstore = state 주기적 pruning → disk 절약.
        </p>
      </div>
    </section>
  );
}
