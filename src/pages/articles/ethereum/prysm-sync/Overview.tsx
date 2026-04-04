import ContextViz from './viz/ContextViz';
import SyncModesViz from './viz/SyncModesViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동기화 전략 비교</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 각 동기화 모드의 내부 동작과<br />
          모드 전환 로직을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><SyncModesViz /></div>
    </section>
  );
}
