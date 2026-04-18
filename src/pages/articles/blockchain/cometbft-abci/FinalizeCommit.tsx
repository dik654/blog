import { codeRefs } from './codeRefs';
import FinalizeBlockViz from './viz/FinalizeBlockViz';
import CommitViz from './viz/CommitViz';
import type { CodeRef } from '@/components/code/types';

export default function FinalizeCommit({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="finalize-commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FinalizeBlock & Commit</h2>

      <h3 className="text-lg font-semibold mb-3">FinalizeBlock — 블록 실행</h3>
      <div className="not-prose mb-6"><FinalizeBlockViz onOpenCode={open} /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── FinalizeBlock 구조 ── */}
        <div className="not-prose mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Request 구조체</p>
              <p className="text-xs text-muted-foreground mb-2"><code>RequestFinalizeBlock</code></p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code className="text-xs">Txs [][]byte</code> — 확정된 TX 목록</li>
                <li><code className="text-xs">DecidedLastCommit</code> — 이전 블록 커밋</li>
                <li><code className="text-xs">Misbehavior</code> — 악의 행위 증거</li>
                <li><code className="text-xs">Hash</code>, <code className="text-xs">Height</code>, <code className="text-xs">Time</code>, <code className="text-xs">ProposerAddress</code></li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Response 구조체</p>
              <p className="text-xs text-muted-foreground mb-2"><code>ResponseFinalizeBlock</code></p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><code className="text-xs">Events []Event</code> — module 이벤트</li>
                <li><code className="text-xs">TxResults []*ExecTxResult</code> — TX 실행 결과</li>
                <li><code className="text-xs">ValidatorUpdates</code> — validator 변경</li>
                <li><code className="text-xs">ConsensusParamUpdates</code> — 합의 파라미터 변경</li>
                <li><code className="text-xs">AppHash []byte</code> — 새 state root</li>
              </ul>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 mb-3">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">Cosmos SDK 내부 실행 흐름 — <code>BaseApp.FinalizeBlock</code></p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="text-xs font-medium mb-1">1. BeginBlock</p>
                <p className="text-xs">module hooks 호출</p>
              </div>
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="text-xs font-medium mb-1">2. DeliverTx x N</p>
                <p className="text-xs">각 TX 순차 실행</p>
              </div>
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="text-xs font-medium mb-1">3. EndBlock</p>
                <p className="text-xs">validator updates 수집</p>
              </div>
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="text-xs font-medium mb-1">4. ComputeAppHash</p>
                <p className="text-xs">state root 계산</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3">
              <p className="text-xs font-semibold mb-1">ABCI 1.0 (이전)</p>
              <p className="text-xs text-muted-foreground">BeginBlock + N x DeliverTx + EndBlock = N+2 호출</p>
            </div>
            <div className="rounded-lg border border-dashed border-green-500/30 bg-green-500/5 p-3">
              <p className="text-xs font-semibold mb-1">ABCI 2.0 (현재)</p>
              <p className="text-xs text-muted-foreground">FinalizeBlock 1회 — overhead 감소 + 병렬화 여지</p>
            </div>
          </div>
        </div>

        <p className="leading-7">
          FinalizeBlock이 <strong>ABCI 2.0의 핵심 통합 메서드</strong>.<br />
          모든 TX를 한 번에 처리 → overhead 감소 + 병렬화 여지.<br />
          ValidatorUpdates 반환 → 다음 validator set 결정.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4 mb-8">
          <strong>💡 ABCI v2 핵심 변경</strong> — BeginBlock/DeliverTx/EndBlock을 FinalizeBlock 하나로 통합.<br />
          앱은 모든 TX를 한 번에 받아 처리, TxResults + ValidatorUpdates + AppHash 반환.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">Commit — 상태 영구 저장</h3>
      <div className="not-prose mb-6"><CommitViz onOpenCode={open} /></div>
      <div className="not-prose mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Request / Response</p>
            <p className="text-xs text-muted-foreground mb-1">Request: 빈 구조체 (파라미터 없음)</p>
            <p className="text-xs text-muted-foreground"><code>ResponseCommit</code></p>
            <ul className="text-sm space-y-1 text-muted-foreground mt-1">
              <li><code className="text-xs">RetainHeight int64</code> — 이 높이 이하 pruning 가능</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">SDK 구현 — <code>BaseApp.Commit</code></p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><span className="font-medium">1.</span> IAVL tree → disk flush (<code className="text-xs">cms.Commit()</code>)</li>
              <li><span className="font-medium">2.</span> state version tracking</li>
              <li><span className="font-medium">3.</span> pruning hint 계산 (<code className="text-xs">RetainHeight</code>)</li>
              <li><span className="font-medium">4.</span> <code className="text-xs">CommittedBlockEvent</code> 발행</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">정순: App → CometBFT (안전)</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>App.Commit() — disk에 app state 저장</li>
              <li>CometBFT state.Save() — state.db 저장</li>
              <li>중간 crash 시 → WAL replay → idempotent 복구</li>
            </ul>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">역순: CometBFT → App (위험)</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>CometBFT가 "block N 저장됨" 기록</li>
              <li>App crash → state 미저장</li>
              <li>재시작 시 N+1 요청 → 불일치 발생</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-muted-foreground/30 p-3">
          <p className="text-xs font-semibold mb-1">Pruning</p>
          <p className="text-xs text-muted-foreground"><code>RetainHeight</code> 이하 블록은 CometBFT가 prune 가능. archive node는 <code>retain_height = 0</code> (전체 유지).</p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Commit이 <strong>app state를 disk에 영구 저장</strong>.<br />
          App.Commit → CometBFT.Save 순서 중요 (crash safety).<br />
          RetainHeight로 cometbft pruning 힌트 제공.
        </p>

        <p className="text-sm border-l-2 border-sky-500/50 pl-3 mt-4">
          <strong>💡 Commit 순서</strong> — 앱 Commit() 후에 CometBFT state.Save() 호출.<br />
          역순이면 크래시 복구 시 앱/CometBFT 상태 불일치 발생.
        </p>
      </div>
    </section>
  );
}
