import { codeRefs } from './codeRefs';
import StateStructViz from './viz/StateStructViz';
import type { CodeRef } from '@/components/code/types';

export default function StateStruct({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="state-struct" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">State 구조체 추적</h2>
      <div className="not-prose mb-8">
        <StateStructViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 밸리데이터 3중 세트</strong> — 현재 블록의 LastCommit은 이전 밸리데이터가 서명.
          NextValidators는 FinalizeBlock의 ValidatorUpdates를 반영, 2블록 후 적용.
        </p>
      </div>
    </section>
  );
}
