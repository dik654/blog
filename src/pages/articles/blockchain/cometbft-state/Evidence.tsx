import { codeRefs } from './codeRefs';
import EvidencePoolViz from './viz/EvidencePoolViz';
import type { CodeRef } from '@/components/code/types';

export default function Evidence({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="evidence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EvidencePool 추적</h2>
      <div className="not-prose mb-8">
        <EvidencePoolViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 증거 만료(MaxAgeNumBlocks)</strong> — 밸리데이터 세트가 변경되면 과거 서명 검증 불가.
          만료 기간 내에만 증거 제출 가능.
        </p>
      </div>
    </section>
  );
}
