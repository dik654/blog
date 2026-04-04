import ContextViz from './viz/ContextViz';
import EpochPipelineViz from './viz/EpochPipelineViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에폭 전환 파이프라인</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 ProcessEpoch의 7단계 파이프라인이<br />
          검증자 보상을 정산하는 전체 과정을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><EpochPipelineViz /></div>
    </section>
  );
}
