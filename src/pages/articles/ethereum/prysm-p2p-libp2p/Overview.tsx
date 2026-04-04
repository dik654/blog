import ContextViz from './viz/ContextViz';
import P2PStackViz from './viz/P2PStackViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">libp2p 스택 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 libp2p 스택 초기화부터 피어 탐색,<br />
          연결 관리, 메시지 전파까지를 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><P2PStackViz /></div>
    </section>
  );
}
