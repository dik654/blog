import ContextViz from './viz/ContextViz';
import FinalityFlowViz from './viz/FinalityFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Casper FFG 메커니즘</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 Casper FFG의 justified → finalized 전환 과정과<br />
          Prysm의 체크포인트 관리를 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><FinalityFlowViz /></div>
    </section>
  );
}
