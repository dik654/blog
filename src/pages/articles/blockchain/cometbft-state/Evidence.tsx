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
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Pool 핵심 필드</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">evidenceStore dbm.DB</code> — 증거 영구 저장</li>
              <li><code className="text-xs">evidenceList *clist.CList</code> — gossip용 concurrent list</li>
              <li><code className="text-xs">evidenceSize uint32</code></li>
              <li><code className="text-xs">state sm.State</code> / <code className="text-xs">blockStore BlockStore</code> — 만료 관리</li>
              <li><code className="text-xs">consensusBuffer []Evidence</code> — rate-limiting</li>
              <li><code className="text-xs">pruningHeight int64</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">만료 (MaxAgeNumBlocks)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>기본값 <code className="text-xs">100000</code> (~1 week @ 6s block)</p>
              <p>Cosmos Hub: <code className="text-xs">1_000_000</code> (~2 months)</p>
              <p>이유: 오래된 validator 서명 검증 불가 + unbonded validator는 slash 대상 아님 + DB 크기 제한</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">Evidence 수명주기 5단계</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>1. AddEvidence</strong> — <code className="text-xs">ValidateBasic</code> → 중복 체크 → <code className="text-xs">evidenceStore</code> 저장 → <code className="text-xs">evidenceList</code> 추가 (gossip)</p>
              <p><strong>2. CheckEvidence</strong> — 매 블록 검증: max_age 확인 + validator 존재 확인 + double-spend 방지</p>
              <p><strong>3. Block 포함</strong> — <code className="text-xs">PendingEvidence(maxCount)</code> → 가장 오래된 것부터 반환 (최대 N개)</p>
              <p><strong>4. 커밋 후</strong> — <code className="text-xs">MarkEvidenceAsCommitted(block.Evidence)</code> → pending 해제</p>
              <p><strong>5. Pruning</strong> — max_age 지난 Evidence 삭제 (백그라운드 goroutine)</p>
            </div>
          </div>
        </div>
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
