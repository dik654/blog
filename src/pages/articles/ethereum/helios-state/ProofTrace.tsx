import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import ProofTraceViz from './viz/ProofTraceViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProofTrace({ title, onCodeRef }: Props & { title: string }) {
  return (
    <section id="proof-trace" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <code>verify_account_proof()</code>와 <code>verify_storage_proof()</code> 두 함수가 핵심이다.
          둘 다 같은 패턴: keccak 해시 → MPT 증명 검증 → RLP 디코딩.
        </p>
      </div>

      <div className="not-prose my-8">
        <ProofTraceViz />
      </div>

      <div className="not-prose mt-4">
        <div className="flex items-center gap-2 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-account-proof', codeRefs['hl-account-proof'])} />
          <span className="text-[10px] text-muted-foreground">proof.rs — verify_account_proof()</span>
        </div>
        <div className="flex items-center gap-2 mt-1 justify-end">
          <CodeViewButton onClick={() => onCodeRef('hl-storage-proof', codeRefs['hl-storage-proof'])} />
          <span className="text-[10px] text-muted-foreground">proof.rs — verify_storage_proof()</span>
        </div>
      </div>
    </section>
  );
}
