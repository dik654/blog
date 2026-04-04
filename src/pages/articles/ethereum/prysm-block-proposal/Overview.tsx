import ContextViz from './viz/ContextViz';
import BlockProposalFlowViz from './viz/BlockProposalFlowViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 제안 파이프라인</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 제안자 선정부터 블록 조립, 서명, 전파까지의<br />
          전체 파이프라인을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><BlockProposalFlowViz /></div>
    </section>
  );
}
