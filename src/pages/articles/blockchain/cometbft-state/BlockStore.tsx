import { codeRefs } from './codeRefs';
import BlockStoreViz from './viz/BlockStoreViz';
import type { CodeRef } from '@/components/code/types';

export default function BlockStoreSection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="blockstore" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlockStore 추적</h2>
      <div className="not-prose mb-8">
        <BlockStoreViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 파트 분할 저장</strong> — 블록이 수 MB까지 커질 수 있어 한 번에 전송 불가.
          65KB 파트로 분할해 P2P 전파하고, 저장소에도 동일 구조로 기록.
        </p>
      </div>
    </section>
  );
}
