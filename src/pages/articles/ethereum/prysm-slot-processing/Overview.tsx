import ContextViz from './viz/ContextViz';
import SlotProcessingViz from './viz/SlotProcessingViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">슬롯 처리 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 ProcessSlots가 상태 루트를 캐싱하고<br />
          에폭 전환을 트리거하는 과정을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><SlotProcessingViz /></div>
    </section>
  );
}
