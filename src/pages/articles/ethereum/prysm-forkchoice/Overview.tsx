import ContextViz from './viz/ContextViz';
import ForkChoiceTreeViz from './viz/ForkChoiceTreeViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fork Choice 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 LMD-GHOST 알고리즘과<br />
          doubly-linked-tree 자료구조의 가중치 전파 과정을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><ForkChoiceTreeViz /></div>
    </section>
  );
}
