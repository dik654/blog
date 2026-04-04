import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멤풀 전체 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT 멤풀은 합의 전 TX를 수집·검증·보관하는 버퍼.<br />
          CListMempool의 자료구조, CheckTx 검증, Recheck 재검증을 코드 수준으로 추적한다.
        </p>
      </div>
    </section>
  );
}
