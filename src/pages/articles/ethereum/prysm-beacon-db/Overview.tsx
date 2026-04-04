import ContextViz from './viz/ContextViz';
import BeaconDBSchemaViz from './viz/BeaconDBSchemaViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DB 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 BoltDB 초기화, 버킷 구조,<br />
          상태 저장 전략을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><BeaconDBSchemaViz /></div>
    </section>
  );
}
