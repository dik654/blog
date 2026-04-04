import { codeRefs } from './codeRefs';
import StateTreeViz from './viz/StateTreeViz';
import type { CodeRef } from '@/components/code/types';

export default function StateTree({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="state-tree" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StateTree & 스냅샷</h2>
      <div className="not-prose mb-8">
        <StateTreeViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 스냅샷과 IPLD</strong> — 에폭마다 새 state root 생성
          <br />
          변경 안 된 HAMT 노드는 이전 에폭과 공유 (구조적 공유)
          <br />
          lotus chain export로 경량 스냅샷 추출 → 빠른 동기화
        </p>
      </div>
    </section>
  );
}
