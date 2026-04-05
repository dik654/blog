import SyncDetailViz from './viz/SyncDetailViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function TipsetValidation({ onCodeRef }: Props) {
  return (
    <section id="tipset-validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tipset 검증 — Syncer.Sync() 내부</h2>
      <p className="text-sm text-muted-foreground mb-4">
        sync.go의 Sync() 함수가 4단계 파이프라인을 순차 실행<br />
        각 step의 코드 보기 버튼으로 실제 소스 확인 가능
      </p>
      <div className="not-prose mb-8">
        <SyncDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Sync() 내부 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Syncer.Sync() 구현 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// sync.go Syncer.Sync() 구조:

func (syncer *Syncer) Sync(ctx context.Context, maybeHead *types.TipSet) error {
    // 1. Determine sync target
    base, err := syncer.store.GetHeaviestTipSet()

    // 2. Check if maybeHead is ahead
    if !isHeavier(maybeHead, base) {
        return nil  // already caught up
    }

    // 3. Find common ancestor
    fts, err := syncer.collectHeaders(ctx, maybeHead, base)
    // walks backward until common ancestor

    // 4. Fetch full tipsets
    for tipset := range missingTipsets {
        fullTs, err := syncer.fetchTipset(ctx, tipset)
    }

    // 5. Validate each tipset
    for _, ts := range fullTipsets {
        err := syncer.ValidateTipset(ctx, ts)
        if err != nil {
            return err  // invalid chain
        }
    }

    // 6. Apply to chain
    err = syncer.store.PutTipSet(ctx, maybeHead)
    // heaviest updated if appropriate

    return nil
}

// ValidateTipset:
// 1. parent consistency check
// 2. per-block validation (parallel)
// 3. message aggregation
// 4. state computation
// 5. receipts match

// 실제 코드 (chain/sync.go):
// - Sync(): main entry
// - collectHeaders(): backward walk
// - fetchTipset(): BlockSync 호출
// - ValidateTipset(): consistency
// - ValidateBlock(): per block

// Failure handling:
// - invalid block → chain rejected
// - missing data → peer request
// - timeout → retry with different peer
// - bad state → drop + ban peer`}
        </pre>
        <p className="leading-7">
          Syncer.Sync: <strong>target → ancestor → fetch → validate → apply</strong>.<br />
          invalid 시 chain 전체 rejected.<br />
          bad peer ban으로 공격 방어.
        </p>

        {/* ── BlockSync Protocol ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlockSync Protocol</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BlockSync 프로토콜:

// Request type:
// struct BlockSyncRequest {
//     Head: [cid.Cid]           // tipset to sync from
//     Length: uint64            // how many tipsets back
//     Options: uint64           // BSOpt flags
// }

// BSOpt flags:
// - BSOptBlocks: include block data
// - BSOptMessages: include messages

// Response type:
// struct BlockSyncResponse {
//     Chain: []BSTipSet         // requested tipsets
//     Status: uint64            // 0=ok, 1=partial, 2=notfound
//     Message: string
// }

// Efficient bulk fetching:
// - request 100 tipsets at once
// - parallel to different peers
// - load balance across peers
// - retry on failure

// Block validation during fetch:
// - header verification
// - signature check
// - parent link consistency
// - skip invalid immediately

// Parallelism:
// - 5-10 concurrent requests
// - staggered to avoid overload
// - peer scoring (reputation)
// - automatic peer selection

// Optimization:
// - Bitswap 기반 (IPFS)
// - CID-based deduplication
// - cache frequently requested
// - local-first lookup

// Performance:
// - ~100 tipsets per request
// - ~1-10 sec per request
// - depends on peer bandwidth
// - typical: 1000-10000 blocks/min

// Error handling:
// - peer unreachable → retry with another
// - partial response → merge + request remainder
// - stale data → discard + refetch
// - banned peer → avoid

// 실제 code:
// chain/blocksync/client.go
// chain/blocksync/server.go
// chain/blocksync/protocol.go`}
        </pre>
        <p className="leading-7">
          BlockSync: <strong>bulk tipset fetch (100 at once)</strong>.<br />
          parallel to multiple peers, Bitswap 기반.<br />
          1000-10000 blocks/min throughput.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 bulk fetch (100 tipsets)인가</strong> — 네트워크 효율.<br />
          single request: RTT overhead 큼.<br />
          bulk: amortize RTT + batch verification.<br />
          optimal batch size는 bandwidth × latency product.
        </p>
      </div>
    </section>
  );
}
