import ChainStoreViz from './viz/ChainStoreViz';
import StateMgrViz from './viz/StateMgrViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ChainStore({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="chainstore" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ChainStore & StateManager</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          Lotus 노드의 핵심 데이터 레이어<br />
          ChainStore가 블록/TipSet 저장, StateManager가 상태 쿼리와 마이그레이션 담당
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">ChainStore 구조체 추적</h3>
      <ChainStoreViz onOpenCode={openCode} />

      <h3 className="text-lg font-semibold mt-8 mb-3">StateManager 구조체 추적</h3>
      <StateMgrViz onOpenCode={openCode} />
    </section>
  );
}
