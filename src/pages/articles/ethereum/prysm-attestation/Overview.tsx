import ContextViz from './viz/ContextViz';
import AttestationFlowViz from './viz/AttestationFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">어테스테이션 생명주기</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 어테스테이션 생성부터 집계,<br />
          블록 포함, 보상 수령까지의 전체 생명주기를 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><AttestationFlowViz /></div>
    </section>
  );
}
