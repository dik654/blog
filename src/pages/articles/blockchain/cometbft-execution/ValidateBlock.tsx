import { codeRefs } from './codeRefs';
import ValidateBlockViz from './viz/ValidateBlockViz';
import type { CodeRef } from '@/components/code/types';

export default function ValidateBlock({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="validate-block" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ValidateBlock 추적</h2>
      <div className="not-prose mb-8">
        <ValidateBlockViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 VerifyCommitLightTrusting</strong> — 이전 밸리데이터 세트로 LastCommit 2/3+ 서명 검증<br />
          위조 블록 차단의 핵심 — 서명 유효성으로 합의 통과를 증명
        </p>
      </div>
    </section>
  );
}
