import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import SlotDetailViz from './viz/SlotDetailViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProcessSlot({ onCodeRef }: Props) {
  return (
    <section id="process-slot" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ProcessSlot 내부</h2>
      <div className="not-prose mb-8"><SlotDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-slot', codeRefs['process-slot'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessSlot()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 상태 루트 백필</strong> — 블록 제안 시점에는 자신의 상태 루트를 아직 모름<br />
          LatestBlockHeader.StateRoot를 0으로 두고,<br />
          다음 슬롯의 ProcessSlot에서 계산된 루트로 채움
        </p>
      </div>
    </section>
  );
}
