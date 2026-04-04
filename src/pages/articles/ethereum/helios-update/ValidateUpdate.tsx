import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ValidateViz from './viz/ValidateViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ValidateUpdate({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="validate-update" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>validate_update()</code>는 3가지를 검사한다.
          <br />
          슬롯 순서, BLS 서명, 정족수. 하나라도 실패하면 Update 거부.
        </p>
      </div>
      <div className="not-prose">
        <ValidateViz />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-validate', codeRefs['hl-validate'])} />
          <span className="text-[10px] text-muted-foreground">update.rs</span>
        </div>
      </div>
    </section>
  );
}
