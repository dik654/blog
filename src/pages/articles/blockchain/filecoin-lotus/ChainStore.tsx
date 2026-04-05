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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ChainStore (chain/store/store.go):

type ChainStore struct {
    chainBlockstore  blockstore.Blockstore   // blocks storage
    stateBlockstore  blockstore.Blockstore   // state storage (split)
    chainLocalBlockstore blockstore.Blockstore

    heaviestLk       sync.RWMutex
    heaviest         *types.TipSet           // current tip

    bestTips         chan *types.TipSet      // tip updates
    pubLk            sync.Mutex

    tstLk            sync.Mutex
    tipsets          map[abi.ChainEpoch][]types.TipSetKey

    cindex           *ChainIndex             // epoch index

    reorgCh          chan<- reorg            // reorg events
    headChangePubNotify *pubsub.PubSub
}

// Key methods:
// - Load(): boot-up chain reload
// - PutTipSet(): add new tipset
// - GetHeaviestTipSet(): current tip
// - GetTipSetByCid(): lookup by cid
// - GetBlock(): fetch block
// - WalkChain(): traverse ancestors

// Blockstore split:
// - chainBlockstore: block data
// - stateBlockstore: state tree
// - 목적: state snapshot 분리 관리

// TipSet:
// type TipSet struct {
//     cids    []cid.Cid        // block cids
//     blks    []*BlockHeader
//     height  abi.ChainEpoch
// }

// Heaviest TipSet:
// - 현재 chain tip
// - weight 기반 선택
// - reorg 시 업데이트

// ChainIndex:
// - epoch → tipset CID 매핑
// - 과거 tipset 빠른 조회
// - skipping for efficiency (every 4 epochs)`}
        </pre>
        <p className="leading-7">
          ChainStore: <strong>tipset 저장 + heaviest tracking</strong>.<br />
          dual blockstore (chain + state) 분리 관리.<br />
          ChainIndex로 과거 epoch 빠른 조회.
        </p>

        {/* ── StateManager 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateManager 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// StateManager (chain/stmgr/stmgr.go):

type StateManager struct {
    cs       *store.ChainStore
    lookupIDFunc func(ctx context.Context, addr address.Address)
                    (address.Address, error)

    stCache     *lru.Cache[types.TipSetKey, stCacheEntry]
    compWait    map[string]chan struct{}

    stlk        sync.Mutex
    ex          *executor.Executor

    newVM       NewVMFunc
    Syscalls    vm.SyscallBuilder

    preIgnitionVesting  []msig0.State
    postIgnitionVesting []msig0.State
    postCalicoVesting   []msig0.State

    genesisMsigLk sync.Mutex
    upgradeSchedule stmgr.UpgradeSchedule
}

// Key methods:
// - TipSetState(): 주어진 tipset의 상태 계산
// - Call(): read-only state query
// - CallWithGas(): write simulation
// - LoadActor(): specific actor load
// - GetActor(): actor state
// - ResolveToDeterministicAddress(): ID address lookup

// State Computation:
// 1. take tipset
// 2. load parent state
// 3. apply messages in order (BLS then Secp)
// 4. compute state tree delta
// 5. return new state root

// Caching:
// - stCache: computed states cached
// - avoid re-computation
// - LRU eviction

// Network upgrades:
// - UpgradeSchedule: planned hard forks
// - each upgrade: state migration
// - examples:
//   - Ignition (2020)
//   - Calico (2021)
//   - Shark (2023)
//   - FEVM rollout

// Actor loading:
// - all state in actor hierarchy
// - GetActor(address) → Actor struct
// - lazy-load via HAMT traversal`}
        </pre>
        <p className="leading-7">
          StateManager: <strong>상태 계산 + 쿼리 + 마이그레이션</strong>.<br />
          stCache LRU 캐싱으로 re-computation 회피.<br />
          network upgrade (hard forks) 관리.
        </p>

        {/* ── 통합 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ChainStore ↔ StateManager 통합</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ChainStore ↔ StateManager 협력:

// Flow 1: 새 tipset 적용
// 1. ChainSync가 peers로부터 tipset 받음
// 2. ChainStore.PutTipSet(tipset)
// 3. StateManager.TipSetState(tipset) 호출
// 4. Message execution → new state root
// 5. compare with tipset.ParentStateRoot
// 6. valid면 ChainStore accepts
// 7. heaviest 업데이트 (필요 시)

// Flow 2: State query
// 1. RPC request: GetActor(addr, tipset)
// 2. StateManager가 tipset state load
// 3. StateTree traversal (HAMT)
// 4. return Actor struct

// Flow 3: Message 실행
// 1. StateManager.ApplyMessage()
// 2. VM invocation
// 3. Actor method call
// 4. state tree 업데이트
// 5. gas accounting
// 6. return receipt

// Storage layers:
// - Blockstore: content-addressed storage
// - Datastore: key-value (Badger/LevelDB)
// - Cache: in-memory LRU
// - Snapshot: state bundling

// Persistence:
// - chainBlockstore: badger directory
// - stateBlockstore: separate (splitstore option)
// - ~500-800 GiB 총 disk usage
// - pruning optional (~10 GiB retained)

// Checkpoint (Filecoin):
// - 1200 epochs recent: active state
// - archival snapshots: every 1-day
// - genesis to current: ~2+ years data

// Performance:
// - state computation: 100-500ms per tipset
// - HAMT traversal: O(log n)
// - cache hit rate: 90%+ typical

// Bottlenecks:
// - disk I/O (state loading)
// - message execution (VM)
// - signature verification (BLS)
// - state migration (upgrades)`}
        </pre>
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
