import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function SaveState({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="save-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SaveState & BlockStore 기록</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('apply-block', codeRefs['apply-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">execution.go — ApplyBlock()</span>
          <CodeViewButton onClick={() => onCodeRef('block-executor', codeRefs['block-executor'])} />
          <span className="text-[10px] text-muted-foreground self-center">BlockExecutor struct</span>
        </div>

        {/* ── Save order ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Save 순서 — App → CometBFT</h3>
        <p className="text-xs text-muted-foreground mb-3"><code>BlockExecutor.Commit(state, block, txResults)</code> — 저장 순서가 crash safety 결정</p>

        <div className="not-prose mb-4">
          <div className="rounded-lg border bg-card p-4 mb-3">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">Commit 내부 4단계</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="text-xs font-medium mb-1">1. App.Commit()</p>
                <p className="text-xs">IAVL tree → disk flush, AppHash 반환</p>
              </div>
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="text-xs font-medium mb-1">2. Mempool Lock</p>
                <p className="text-xs">concurrent protection</p>
              </div>
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="text-xs font-medium mb-1">3. store.Save(state)</p>
                <p className="text-xs">state.db + BlockStore 기록</p>
              </div>
              <div className="rounded bg-muted/50 p-2 text-center">
                <p className="text-xs font-medium mb-1">4. Mempool Update</p>
                <p className="text-xs">committed TX 제거</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">순서 A: App 먼저 (안전)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>App.Commit() → disk에 app state 저장</li>
                <li>CometBFT.SaveState() → state.db 저장</li>
                <li>중간 crash 시: WAL replay → SaveState 재수행</li>
                <li>App은 idempotent 처리 (appHash 같으면 skip)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">순서 B: CometBFT 먼저 (위험)</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>CometBFT.SaveState() → "block N 처리됨" 기록</li>
                <li>App.Commit() 전 crash → state 미저장</li>
                <li>재시작 시 CometBFT는 N+1 요청</li>
                <li>App은 prev state만 보유 → 불일치 복구 불가</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="leading-7">
          <strong>App → CometBFT 순서</strong>가 crash safety의 핵심.<br />
          App commit 먼저 (disk flush) → CometBFT state save 나중.<br />
          역순이면 재시작 시 state 불일치 발생 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Commit() 후 Save() 순서</strong> — 앱이 먼저 Commit()으로 상태를 확정.<br />
          그 후 CometBFT가 store.Save(state) — 역순이면 크래시 시 불일치 발생.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 fireEvents</strong> — NewBlock, NewBlockHeader, Tx 이벤트를 EventBus로 전파.<br />
          크래시 시 이벤트 누락 가능하지만 리플레이로 복구.
        </p>
      </div>
    </section>
  );
}
