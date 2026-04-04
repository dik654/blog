import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import MptTraversalViz from './viz/MptTraversalViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function MptTraversal({ title, onCodeRef }: Props) {
  return (
    <section id="mpt-traversal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <code>verify_proof()</code>가 실제 MPT 순회 엔진이다.
          proof 배열의 노드들을 하나씩 순회하면서
          root부터 leaf까지 해시 체인을 검증한다.
        </p>
      </div>

      <div className="not-prose my-8">
        <MptTraversalViz />
      </div>

      <div className="not-prose mt-4">
        <div className="flex items-center gap-2 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-verify-proof', codeRefs['hl-verify-proof'])} />
          <span className="text-[10px] text-muted-foreground">proof.rs — verify_proof() MPT 순회</span>
        </div>
      </div>
    </section>
  );
}
