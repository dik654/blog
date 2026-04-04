import { codeRefs } from './codeRefs';
import RecheckViz from './viz/RecheckViz';
import type { CodeRef } from '@/components/code/types';

export default function Recheck({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="recheck" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Recheck & 블록 후 정리</h2>
      <div className="not-prose mb-8">
        <RecheckViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Recheck가 필수인 이유</strong> — 블록 커밋으로 nonce, 잔고가 변경됨.
          이전에 유효했던 TX가 무효화될 수 있고, 그대로 블록에 넣으면 FinalizeBlock에서 실패.
        </p>
      </div>
    </section>
  );
}
