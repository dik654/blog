import { codeRefs } from './codeRefs';
import BlockStoreViz from './viz/BlockStoreViz';
import type { CodeRef } from '@/components/code/types';

export default function BlockStoreSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="blockstore" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlockStore 추적</h2>
      <div className="not-prose mb-8">
        <BlockStoreViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── BlockStore struct ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">BlockStore — Part 단위 저장</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/store/store.go
type BlockStore struct {
    db dbm.DB
    mtx cmtsync.RWMutex
    base, height int64  // oldest, newest heights
}

// Key 레이아웃 (goleveldb 기준):
// BH:{height} → BlockMeta (블록 요약)
// P:{height}:{partIndex} → block part
// SC:{height} → seenCommit (이 노드가 본 commit)
// C:{height} → extendedCommit (validator 서명)

// SaveBlock 흐름:
func (bs *BlockStore) SaveBlock(
    block *types.Block,
    blockParts *types.PartSet,
    seenCommit *types.Commit,
) {
    // 1. BlockMeta 저장
    blockMeta := types.NewBlockMeta(block, blockParts)
    bs.saveBlockMeta(blockMeta)

    // 2. 각 Part 저장 (65KB 단위)
    for i := 0; i < blockParts.Total(); i++ {
        part := blockParts.GetPart(i)
        bs.saveBlockPart(block.Height, i, part)
    }

    // 3. Commits 저장
    bs.saveBlockCommit(block.Height, block.LastCommit)
    bs.saveSeenCommit(block.Height, seenCommit)

    // 4. Batch commit (atomic)
    bs.db.SetSync(...)
}

// LoadBlock 흐름:
// 1. BlockMeta 조회 → Part 수 확인
// 2. 각 Part 로드 + 재조립
// 3. Block 구조체 복원

// Part 분할 이유:
// - Block 크기: 수 KB ~ 수 MB (variable)
// - DB write: 작은 단위가 효율적
// - P2P gossip: Part 단위로 전파
// - 동일 구조로 저장 → 네트워크/저장 통합

// Size 추정 (Cosmos Hub):
// - BlockMeta: ~1 KB per block
// - Block Parts: ~100 KB per block (average)
// - 연간 블록 ~5M → ~500 GB total`}
        </pre>
        <p className="leading-7">
          BlockStore는 <strong>Part 단위 (65KB) 분할 저장</strong>.<br />
          P2P gossip과 동일 구조 → unified data model.<br />
          BlockMeta + Parts + Commits 원자적 저장.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 파트 분할 저장</strong> — 블록이 수 MB까지 커질 수 있어 한 번에 전송 불가.<br />
          65KB 파트로 분할해 P2P 전파하고, 저장소에도 동일 구조로 기록.
        </p>
      </div>
    </section>
  );
}
