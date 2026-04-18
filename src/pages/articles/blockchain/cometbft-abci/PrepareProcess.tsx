import { codeRefs } from './codeRefs';
import PrepareProposalViz from './viz/PrepareProposalViz';
import ProcessProposalViz from './viz/ProcessProposalViz';
import type { CodeRef } from '@/components/code/types';

export default function PrepareProcess({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="prepare-process" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PrepareProposal & ProcessProposal</h2>

      {/* ── PrepareProposal 구현 ── */}
      <h3 className="text-lg font-semibold mb-3 mt-6">PrepareProposal 코드 추적</h3>
      <div className="not-prose mb-8">
        <PrepareProposalViz onOpenCode={open} />
      </div>

      <div className="not-prose mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Request 구조체</p>
            <p className="text-xs text-muted-foreground mb-2"><code>RequestPrepareProposal</code> — proposer만 수신</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">MaxTxBytes</code> — 블록 최대 크기</li>
              <li><code className="text-xs">Txs [][]byte</code> — mempool TX 후보 목록</li>
              <li><code className="text-xs">LocalLastCommit</code> — vote extension 포함 커밋</li>
              <li><code className="text-xs">Height</code>, <code className="text-xs">Time</code>, <code className="text-xs">ProposerAddress</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Response 구조체</p>
            <p className="text-xs text-muted-foreground mb-2"><code>ResponsePrepareProposal</code></p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">Txs [][]byte</code> — 앱이 선택한 최종 TX 목록</li>
            </ul>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3 mb-1">앱이 할 수 있는 것</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>TX 제거 (mempool 필터링)</li>
              <li>TX 순서 변경 (MEV-resistant ordering)</li>
              <li>TX 추가 (oracle data, cross-chain)</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4 mb-3">
          <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">Cosmos SDK 기본 구현 — <code>DefaultPrepareProposal</code></p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
            <div className="rounded bg-muted/50 p-2 text-center">
              <p className="text-xs font-medium mb-1">1. mempool TX 순회</p>
              <p className="text-xs">후보 TX를 순서대로 탐색</p>
            </div>
            <div className="rounded bg-muted/50 p-2 text-center">
              <p className="text-xs font-medium mb-1">2. 크기 체크</p>
              <p className="text-xs"><code className="text-[10px]">MaxTxBytes</code> 초과 시 중단</p>
            </div>
            <div className="rounded bg-muted/50 p-2 text-center">
              <p className="text-xs font-medium mb-1">3. 유효성 재검증</p>
              <p className="text-xs">invalid TX skip, valid만 추가</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3">
            <p className="text-xs font-semibold mb-1">dYdX 활용</p>
            <p className="text-xs text-muted-foreground">orderbook 상태 포함, MEV 방어 순서, oracle 가격 주입</p>
          </div>
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3">
            <p className="text-xs font-semibold mb-1">Skip MEV 활용</p>
            <p className="text-xs text-muted-foreground">vote extension ordering 적용, block builder 통합</p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PrepareProposal이 <strong>proposer의 block 구성 권한</strong>.<br />
          TX 필터링/재정렬/추가 자유롭게 — app이 block 내용 결정.<br />
          dYdX, Skip MEV 등이 적극 활용.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 제안자만 PrepareProposal을 호출</strong> — 앱이 TX 순서 변경, 필터링, 추가 가능.<br />
          나머지 검증자는 ProcessProposal로 제안을 검증.
        </p>
      </div>

      {/* ── ProcessProposal ── */}
      <h3 className="text-lg font-semibold mb-3 mt-8">ProcessProposal 코드 추적</h3>
      <div className="not-prose mb-8">
        <ProcessProposalViz onOpenCode={open} />
      </div>

      <div className="not-prose mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Request 구조체</p>
            <p className="text-xs text-muted-foreground mb-2"><code>RequestProcessProposal</code> — 모든 validator 수신</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">Txs [][]byte</code> — 제안된 TX 목록</li>
              <li><code className="text-xs">ProposedLastCommit</code> — 이전 블록 커밋 정보</li>
              <li><code className="text-xs">Hash</code> — 블록 해시</li>
              <li><code className="text-xs">Height</code>, <code className="text-xs">Time</code>, <code className="text-xs">ProposerAddress</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Response 구조체</p>
            <p className="text-xs text-muted-foreground mb-2"><code>ResponseProcessProposal</code></p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">Status</code> — <code className="text-xs">ACCEPT</code> 또는 <code className="text-xs">REJECT</code></li>
            </ul>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-3 mb-1">SDK 기본 구현</p>
            <p className="text-xs text-muted-foreground">모든 TX 재검증 → 하나라도 invalid면 <code className="text-xs">REJECT</code></p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">REJECT 시나리오</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>invalid TX 포함</li>
              <li>허용되지 않은 TX 순서</li>
              <li>app-specific rule 위반</li>
              <li>vote extension mismatch</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold mb-2">투표 결과 영향</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">ACCEPT</code> → <code className="text-xs">prevote(block_hash)</code></li>
              <li><code className="text-xs">REJECT</code> → <code className="text-xs">prevote(nil)</code></li>
              <li>2/3+ REJECT → round 실패 → 다음 round</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">악의 proposer: accept 못 받으면 reward 없음, 슬래싱 가능</p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ProcessProposal이 <strong>validator의 block 검증 권한</strong>.<br />
          ACCEPT/REJECT 선택 → prevote 결정.<br />
          2/3+ REJECT → round 실패 → 악의 proposer 처벌.
        </p>

        <p className="text-sm border-l-2 border-sky-500/50 pl-3 mt-4">
          <strong>💡 REJECT 시 nil prevote</strong> — 충분한 노드가 거부하면 해당 라운드 타임아웃, 다음 라운드로 진행.
        </p>
      </div>
    </section>
  );
}
