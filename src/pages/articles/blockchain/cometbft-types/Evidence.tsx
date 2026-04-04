import EvidenceViz from './viz/EvidenceViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Evidence({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="evidence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Evidence — 비잔틴 증거</h2>
      <div className="not-prose mb-8">
        <EvidenceViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} Evidence가 Block에 포함되는 이유</strong> — 비잔틴 행위의 증거를 블록체인에 영구 기록하면
          모든 노드가 동일한 슬래싱 판단을 내릴 수 있다.<br />
          off-chain 신고 방식은 합의 없이 불일치가 발생할 수 있어 부적합하다.
        </p>
      </div>
    </section>
  );
}
