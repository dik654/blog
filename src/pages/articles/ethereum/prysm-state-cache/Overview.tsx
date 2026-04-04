import ContextViz from './viz/ContextViz';
import StateCacheViz from './viz/StateCacheViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 캐시 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 Hot/Cold 캐시 구조와<br />
          Replay 메커니즘의 상태 조회 파이프라인을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><StateCacheViz /></div>
    </section>
  );
}
