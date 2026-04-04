import SealevelViz from './viz/SealevelViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Sealevel({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="sealevel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sealevel 병렬 실행</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sealevel — 계정 의존성 기반 병렬 실행 엔진<br />
          모든 TX가 접근 계정(R/W)을 미리 선언 → 충돌 없는 TX 동시 실행
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sol-sealevel-exec', codeRefs['sol-sealevel-exec'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              bank.rs — process_transactions
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <SealevelViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
