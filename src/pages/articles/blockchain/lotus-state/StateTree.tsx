import { codeRefs } from './codeRefs';
import StateTreeViz from './viz/StateTreeViz';
import type { CodeRef } from '@/components/code/types';

export default function StateTree({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="state-tree" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StateTree & 스냅샷</h2>
      <div className="not-prose mb-8">
        <StateTreeViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 스냅샷과 IPLD</strong> — 에폭마다 새 state root 생성
          <br />
          변경 안 된 HAMT 노드는 이전 에폭과 공유 (구조적 공유)
          <br />
          lotus chain export로 경량 스냅샷 추출 → 빠른 동기화
        </p>

        {/* ── StateTree 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateTree &amp; IPLD 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// StateTree 구조:

type StateTree struct {
    root *hamt.Node         // HAMT: IDAddress → Actor
    version types.StateTreeVersion
    info cid.Cid           // metadata
    Store cbor.IpldStore
    snaps *stateSnaps      // snapshot layers
}

// State tree versions:
// - V0: original
// - V1: added info field
// - V2: added DataCap
// - V3: FVM compatibility
// - V4: EVM actors
// - V5: current (2024)

// Top-level entries:
// - key: ActorID (f0 address)
// - value: Actor struct {Code, Head, CallSeqNum, Balance}

// StateRoot:
// - HAMT root CID
// - represents entire chain state
// - stored in block.ParentStateRoot

// IPLD (InterPlanetary Linked Data):
// - content-addressed graph
// - CBOR encoded nodes
// - CID-based links
// - IPFS compatible

// Structural Sharing:
// - immutable data structures
// - path copying on updates
// - unchanged subtrees shared
// - dramatic memory savings

// Example (1M accounts, 1 update):
// - full copy: 1M actors rebuilt
// - structural sharing: ~6 nodes changed
// - 99.9%+ reused

// Snapshot creation:
// lotus chain export <path> --tipset <key> --recent-stateroots <n>
// - serialize IPLD graph
// - CAR format
// - compressed (zstd)
// - portable across nodes

// Snapshot import:
// lotus daemon --import <path>
// - parse CAR
// - rebuild state locally
// - verify CIDs
// - ~4 hours for mainnet

// State pruning:
// - old epochs gc'd
// - recent state kept
// - configurable retention
// - split blockstore (chain vs state)

// Performance:
// - state tree load: 100-500ms
// - single actor lookup: <10ms
// - bulk traversal: millions actors/sec
// - snapshot creation: ~10 min

// Block size:
// - mainnet state: ~150 GB
// - compressed snapshot: ~80 GB
// - recent + metadata: ~200 GB`}
        </pre>
        <p className="leading-7">
          StateTree: <strong>HAMT (ActorID → Actor) + IPLD</strong>.<br />
          structural sharing으로 snapshot 효율.<br />
          mainnet state ~150 GB, snapshot export ~80 GB.
        </p>
      </div>
    </section>
  );
}
