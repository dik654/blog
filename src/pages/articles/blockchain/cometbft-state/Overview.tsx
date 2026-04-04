import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">상태 관리 전체 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT는 합의 진행 상태를 State · BlockStore · EvidencePool 세 계층으로 영구 저장.<br />
          각 계층의 Go 구조체와 저장/조회 경로를 코드 수준으로 추적한다.
        </p>
      </div>
    </section>
  );
}
