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
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Commit() 후 Save() 순서</strong> — 앱이 먼저 Commit()으로 상태를 확정<br />
          그 후 CometBFT가 store.Save(state) — 역순이면 크래시 시 불일치 발생
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 fireEvents</strong> — NewBlock, NewBlockHeader, Tx 이벤트를 EventBus로 전파<br />
          크래시 시 이벤트 누락 가능하지만 리플레이로 복구
        </p>
      </div>
    </section>
  );
}
