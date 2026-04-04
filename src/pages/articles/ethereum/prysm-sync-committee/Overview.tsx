import ContextViz from './viz/ContextViz';
import SyncCommitteeViz from './viz/SyncCommitteeViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">싱크 위원회 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 아티클에서는 싱크 위원회 선정, 매 슬롯 서명,<br />
          라이트 클라이언트 증명 생성 과정을 코드 수준으로 추적
        </p>
      </div>
      <div className="not-prose mt-6"><SyncCommitteeViz /></div>
    </section>
  );
}
