import TipsetDetailViz from './viz/TipsetDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function Tipset({ onCodeRef }: Props) {
  return (
    <section id="tipset" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tipset 선택</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        같은 에폭에서 같은 부모를 공유하는 블록들의 집합 = Tipset<br />
        Heaviest Chain Rule로 정규 체인을 선택
      </p>
      <div className="not-prose mb-8">
        <TipsetDetailViz onOpenCode={onCodeRef} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Tipset Structure ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Tipset 구조 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Tipset structure:

type TipSet struct {
    cids    []cid.Cid          // block CIDs
    blks    []*BlockHeader     // blocks (sorted)
    height  abi.ChainEpoch     // epoch
}

// TipSet 조건:
// 1. 같은 epoch (height)
// 2. 같은 parents (ParentTipsetKey)
// 3. 같은 parent_state_root
// 4. 모든 blocks valid (independently)

// Ordering within tipset:
// - blocks sorted by miner's ticket
// - ticket = VRF output
// - deterministic ordering

// TipSet CIDs:
// - 각 block의 CID 리스트
// - sorted (for deterministic TipSet identity)
// - unique tipset identifier

// TipsetKey:
// type TipSetKey struct {
//     value []byte
// }
// // encoded list of CIDs

// Genesis tipset:
// - height 0
// - single block (genesis)
// - special case

// Multiple blocks per epoch:
// - 여러 winning miners
// - each produces own block
// - all sharing same parents
// - 모든 blocks가 tipset에 포함

// Empty tipset:
// - no miner won this epoch
// - null round
// - next epoch references skipped one
// - chain weight still increases

// 실제 예시:
// Epoch 100:
// - miner A won: block_A
// - miner B won: block_B
// - miner C won: block_C
//
// TipSet {
//   cids: [A, B, C] (sorted)
//   blks: [block_A, block_B, block_C]
//   height: 100
// }
//
// Epoch 101 blocks reference TipSet(epoch=100) as parents`}
        </pre>
        <p className="leading-7">
          Tipset: <strong>같은 epoch + 같은 parents blocks 집합</strong>.<br />
          deterministic ordering (by ticket).<br />
          null rounds (no winner) 가능.
        </p>

        {/* ── Heaviest Chain Rule ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Heaviest Chain Rule</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Heaviest Chain Rule:

// Chain selection:
// - node가 여러 candidate chain 관찰
// - heaviest chain = canonical
// - weight 기반 비교

// Weight function:
// chain_weight(T) = sum of epoch_weights
// epoch_weight = log2(total_power) * (wR * #blocks + wP)

// Fork choice:
// if new_chain.weight > current.weight:
//     reorg to new_chain
// elif new_chain.weight == current.weight:
//     tie-break (lexicographic CID)

// Reorg cost:
// - rollback current chain
// - apply new chain
// - update state
// - expensive if deep

// Finality assumption:
// - 900 epochs = 7.5h
// - below this: reorg 이론 가능
// - beyond this: "finalized"
// - F3: fast finality (2-5 min)

// Tie-breaking:
// - equal weight 드묾
// - lexicographic by tipset cid
// - deterministic

// Canonical chain:
// - heaviest observed
// - updated continuously
// - reorg-capable

// 공격 저항:
// - log scaling 공격 완화
// - small miners 참여 incentive
// - storage power 비례 공격 비용

// Null rounds handling:
// - epoch without blocks
// - next epoch increases weight still
// - previous tipset 참조 유지
// - chain 계속 성장

// 예시:
// epoch 100: TipSet A (weight += 5000)
// epoch 101: null round (no blocks)
// epoch 102: TipSet B (references A, weight += 5000)
// chain continues despite null round

// Orphan blocks:
// - block not in canonical chain
// - invalidated by reorg
// - miner loses reward
// - wasted computation`}
        </pre>
        <p className="leading-7">
          Heaviest Chain: <strong>log-scaled weight → canonical chain</strong>.<br />
          reorg 가능, tie-break lexicographic.<br />
          null rounds 허용, 900 epoch finality.
        </p>

        {/* ── TipsetKey in Practice ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TipsetKey in Practice</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TipsetKey 사용:

// 1. Chain reference:
//    ChainGetTipSetByKey(tsk) → TipSet
//    - API parameter
//    - 어떤 tipset 지정
//    - historic query

// 2. State lookups:
//    StateGetActor(addr, tsk) → Actor
//    - 특정 tipset 기준 state
//    - read-only query

// 3. Block references:
//    - block header의 Parents field
//    - ParentsTipSetKey

// 4. Heavier tipset comparison:
//    IsHeavier(ts1, ts2) → bool
//    - fork choice에서 사용

// Encoding:
// - list of CIDs concatenated
// - CBOR encoded
// - deterministic

// Practical queries:
//
// lotus state list-actors --tipset <key>
// lotus chain get-block <cid>
// lotus chain list --tipset <key>

// Gateway API:
// - filter by tipset
// - bridge contracts 사용
// - snapshot queries

// Performance:
// - lookup: O(1) in TipSet cache
// - chain traversal: O(depth)
// - state reconstruction: expensive

// Caching:
// - recent tipsets in memory
// - LRU eviction
// - ~1000 tipsets cached
// - disk for older

// 특수 케이스:

// EmptyTipSet:
// - null round representation
// - no blocks
// - height + parents만

// ForkTipSet:
// - 같은 height, 다른 parents
// - canonical chain 중 하나

// Genesis:
// - special TipSet (height 0)
// - single block
// - hardcoded`}
        </pre>
        <p className="leading-7">
          TipsetKey: <strong>state query + chain reference primary key</strong>.<br />
          API queries, fork choice, block references.<br />
          LRU cache (~1000), O(1) lookup.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "tipset" 개념인가</strong> — throughput + fairness.<br />
          single leader (Bitcoin): 초당 7 TX 한계.<br />
          Tipset (5 winners/epoch): parallel block production.<br />
          throughput 5x + miners 공정 분배 + censorship resistance.
        </p>
      </div>
    </section>
  );
}
