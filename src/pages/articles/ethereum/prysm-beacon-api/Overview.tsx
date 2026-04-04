import ContextViz from './viz/ContextViz';
import BeaconAPIViz from './viz/BeaconAPIViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">API 서버 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 gRPC 서버 초기화, REST 게이트웨이 연결,<br />
          인터셉터 체인을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><BeaconAPIViz /></div>
    </section>
  );
}
