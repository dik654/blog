import { codeRefs } from "./codeRefs";
import EvidencePoolViz from "./viz/EvidencePoolViz";
import type { CodeRef } from "@/components/code/types";

export default function Evidence({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="evidence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EvidencePool 추적</h2>
      <div className="not-prose mb-8">
        <EvidencePoolViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── EvidencePool 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          EvidencePool — 증거 수집 & 관리
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Pool 핵심 필드
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">evidenceStore dbm.DB</code> — 증거
                영구 저장
              </li>
              <li>
                <code className="text-xs">evidenceList *clist.CList</code> —
                gossip용 concurrent list
              </li>
              <li>
                <code className="text-xs">evidenceSize uint32</code>
              </li>
              <li>
                <code className="text-xs">state sm.State</code> /{" "}
                <code className="text-xs">blockStore BlockStore</code> — 만료
                관리
              </li>
              <li>
                <code className="text-xs">consensusBuffer []Evidence</code> —
                rate-limiting
              </li>
              <li>
                <code className="text-xs">pruningHeight int64</code>
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
              만료 (MaxAgeNumBlocks)
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <code className="text-xs">MaxAgeNumBlocks</code>와{" "}
                <code className="text-xs">MaxAgeDuration</code>을 함께 평가
              </p>
              <p>
                값은 체인의 consensus parameters에 포함되며 애플리케이션별로
                다름
              </p>
              <p>
                이유: 검증할 validator 이력과 노드가 보존할 evidence 범위를
                유한하게 유지
              </p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              Evidence 수명주기 5단계
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>1. AddEvidence</strong> —{" "}
                <code className="text-xs">ValidateBasic</code> → 중복 체크 →{" "}
                <code className="text-xs">evidenceStore</code> 저장 →{" "}
                <code className="text-xs">evidenceList</code> 추가 (gossip)
              </p>
              <p>
                <strong>2. CheckEvidence</strong> — 매 블록 검증: max_age 확인 +
                validator 존재 확인 + double-spend 방지
              </p>
              <p>
                <strong>3. Block 포함</strong> —{" "}
                <code className="text-xs">PendingEvidence(maxCount)</code> →
                가장 오래된 것부터 반환 (최대 N개)
              </p>
              <p>
                <strong>4. 커밋 후</strong> —{" "}
                <code className="text-xs">
                  MarkEvidenceAsCommitted(block.Evidence)
                </code>{" "}
                → pending 해제
              </p>
              <p>
                <strong>5. Pruning</strong> — max_age 지난 Evidence 삭제
                (백그라운드 goroutine)
              </p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          EvidencePool은 evidence를 받아 검증하고 proposal에 넣은 뒤 commit 여부를
          추적하는 <strong>전체 lifecycle</strong>을 관리한다. 이후
          만료 경계를 넘은 pending evidence는 prune하여 검증 범위와 저장 비용을
          제한한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 증거 만료</strong> — block 수와 wall-clock duration 조건을
          같이 확인해 두 시간축 모두에서 적절한 이력을 보존한다.
          만료했다는 사실이 서명 수학적 검증 자체를 불가능하게 만든다기보다,
          합의가 받아들일 수 있는 evidence 창을 넘었다는 뜻이다.
        </p>
      </div>
    </section>
  );
}
