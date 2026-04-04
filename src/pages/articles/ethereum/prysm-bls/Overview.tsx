import ContextViz from './viz/ContextViz';
import BLSSignFlowViz from './viz/BLSSignFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BLS12-381 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 BLS 서명 생성, 집계,<br />
          FastAggregateVerify 검증의 전체 과정을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><BLSSignFlowViz /></div>
    </section>
  );
}
