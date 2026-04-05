import { codeRefs } from './codeRefs';
import EvidencePoolViz from './viz/EvidencePoolViz';
import type { CodeRef } from '@/components/code/types';

export default function Evidence({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="evidence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EvidencePool 추적</h2>
      <div className="not-prose mb-8">
        <EvidencePoolViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── EvidencePool 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">EvidencePool — 증거 수집 & 관리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/evidence/pool.go
type Pool struct {
    logger log.Logger
    valToLastHeight valToLastHeightMap

    evidenceStore dbm.DB
    evidenceList  *clist.CList  // concurrent list
    evidenceSize  uint32

    // 만료 관리
    state        sm.State
    blockStore   BlockStore
    evpoolConfig *config.EvidenceConfig

    // Rate-limiting
    consensusBuffer []Evidence

    pruningHeight  int64
    dbKeyLayout    EvidenceDBKey
}

// Evidence 수명주기:
// 1. AddEvidence(ev)
//    - ValidateBasic
//    - 중복 체크
//    - evidenceStore 저장
//    - evidenceList 추가 (gossip)
//
// 2. CheckEvidence (매 블록 검증)
//    - max_age 확인
//    - validator 존재 확인
//    - double-spend 방지
//
// 3. Block 포함 (PrepareProposal)
//    - PendingEvidence(maxCount) 호출
//    - 가장 오래된 것부터 반환
//    - 최대 N개 (체인 설정)
//
// 4. 블록 커밋 후
//    - MarkEvidenceAsCommitted(block.Evidence)
//    - 더 이상 pending 아님
//
// 5. Pruning
//    - max_age 지난 Evidence 삭제
//    - 백그라운드 goroutine

// 만료 (MaxAgeNumBlocks):
const DefaultMaxAge = 100000  // ~1 week @ 6s block time

// 만료 이유:
// - 너무 오래된 validator 서명 검증 불가
// - unbonded validator는 slash 대상 아님
// - DB 크기 제한

// 메인넷 기준:
// Cosmos Hub: max_age_num_blocks = 1_000_000 (~2 months)
// Osmosis: max_age_num_blocks = 1_000_000`}
        </pre>
        <p className="leading-7">
          EvidencePool이 <strong>evidence 전체 lifecycle 관리</strong>.<br />
          Add → Check → Include → Commit → Prune 5단계.<br />
          max_age 지나면 자동 삭제 → DB 크기 제한.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 증거 만료(MaxAgeNumBlocks)</strong> — 밸리데이터 세트가 변경되면 과거 서명 검증 불가.<br />
          만료 기간 내에만 증거 제출 가능.
        </p>
      </div>
    </section>
  );
}
