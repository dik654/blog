import ContextViz from './viz/ContextViz';
import BlockProcessingViz from './viz/BlockProcessingViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 처리 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 블록 수신부터 상태 반영까지의<br />
          6단계 검증 파이프라인을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><BlockProcessingViz /></div>
    </section>
  );
}
