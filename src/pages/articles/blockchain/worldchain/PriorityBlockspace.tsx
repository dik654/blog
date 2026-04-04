import BlockAllocationViz from './viz/BlockAllocationViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function PriorityBlockspace({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="priority-blockspace" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">우선순위 블록스페이스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PBH: 블록 40%를 검증된 인간 TX에 예약<br />
          나머지 60%는 일반 TX가 가스비 순으로 경쟁
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('wc-gas-capacity', codeRefs['wc-gas-capacity'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              capacity.rs — 가스 용량
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <BlockAllocationViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
