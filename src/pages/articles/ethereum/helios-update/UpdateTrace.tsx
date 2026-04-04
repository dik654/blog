import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import UpdateTraceViz from './viz/UpdateTraceViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function UpdateTrace({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="update-trace" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Update를 수신하면 <code>validate_update()</code>로 검증하고,
          통과하면 <code>apply_update()</code>로 Store에 반영한다.
          검증: 슬롯 순서 + BLS 서명. 반영: finalized_header + 위원회 + optimistic_header 갱신.
        </p>
      </div>

      <div className="not-prose my-8">
        <UpdateTraceViz />
      </div>

      <div className="not-prose mt-4">
        <div className="flex items-center gap-2 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-validate-slot', codeRefs['hl-validate-slot'])} />
          <span className="text-[10px] text-muted-foreground">update.rs — 슬롯 순서 + BLS 검증</span>
        </div>
        <div className="flex items-center gap-2 mt-1 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-apply-finalized', codeRefs['hl-apply-finalized'])} />
          <span className="text-[10px] text-muted-foreground">update.rs — finalized + 위원회 교체</span>
        </div>
        <div className="flex items-center gap-2 mt-1 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-apply-optimistic', codeRefs['hl-apply-optimistic'])} />
          <span className="text-[10px] text-muted-foreground">update.rs — optimistic 갱신</span>
        </div>
      </div>
    </section>
  );
}
