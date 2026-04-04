import ContextViz from './viz/ContextViz';
import SSZMerkleViz from './viz/SSZMerkleViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SSZ 규격</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 SSZ 인코딩 규칙, 청크 패킹,<br />
          HashTreeRoot 계산 과정을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><SSZMerkleViz /></div>
    </section>
  );
}
