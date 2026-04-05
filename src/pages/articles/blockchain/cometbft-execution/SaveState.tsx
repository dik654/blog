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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Commit 메서드: 저장 순서 중요

func (e *BlockExecutor) Commit(
    state State,
    block *Block,
    deliverTxResponses []*ExecTxResult,
) ([]byte, int64, error) {
    // Step 1: App.Commit() 먼저 호출
    //   → app이 IAVL tree를 disk에 flush
    //   → AppHash 반환
    commitInfo, err := e.proxyApp.Commit()
    if err != nil { return nil, 0, err }

    // Step 2: Mempool lock 획득 (concurrent protection)
    e.mempool.Lock()
    defer e.mempool.Unlock()

    // Step 3: CometBFT state save
    //   → state.db에 저장
    //   → BlockStore에 block 저장
    if err := e.store.Save(state); err != nil {
        return nil, 0, err
    }

    // Step 4: Mempool update (committed TX 제거)
    err = e.mempool.Update(
        block.Height,
        block.Txs,
        deliverTxResponses,
        TxPreCheck(state),
        TxPostCheck(state),
    )

    return commitInfo.Data, commitInfo.RetainHeight, nil
}

// 순서 A (App 먼저):
// 1. App.Commit() → disk에 app state 저장 (appHash)
// 2. CometBFT.SaveState() → state.db에 state 저장
// 3. 중간 crash 발생 시:
//    - appHash 있음
//    - state 없음
//    - 재시작 시 WAL replay → SaveState 재수행
//    - App이 이미 commit된 block에 대해 다시 FinalizeBlock 받음
//    - 하지만 app은 idempotent하게 처리 (appHash 같으면 skip)
// → 복구 안전 ✓

// 순서 B (CometBFT 먼저) - ⚠ 잘못된 순서:
// 1. CometBFT.SaveState() → state 저장
// 2. App.Commit() → disk flush 전 crash
// 3. 재시작 시:
//    - CometBFT는 "block N 처리됨" 믿음
//    - App은 state 없음 (메모리 pending만)
//    - 재시작 시 App은 prev state만 있음
//    - CometBFT는 block N+1 요청
//    - 불일치! → 복구 불가`}
        </pre>
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
