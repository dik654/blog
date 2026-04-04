import ContextViz from './viz/ContextViz';
import EngineAPIFlowViz from './viz/EngineAPIFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 Engine API의 JWT 인증,<br />
          3대 메서드 호출 흐름, 에러 처리 전략을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><EngineAPIFlowViz /></div>
    </section>
  );
}
