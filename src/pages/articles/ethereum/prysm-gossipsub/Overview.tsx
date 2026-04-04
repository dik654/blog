import ContextViz from './viz/ContextViz';
import GossipsubMeshViz from './viz/GossipsubMeshViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GossipSub 프로토콜</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 GossipSub 토픽 구독, 메시 구성,<br />
          메시지 검증 파이프라인을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><GossipsubMeshViz /></div>
    </section>
  );
}
