import ProofFlowViz from './viz/ProofFlowViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function WorldIdVerification({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="world-id-verification" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">World ID 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PBH TX는 Semaphore 영지식 증명으로 신원 검증<br />
          Poseidon Merkle Tree(깊이 30) + Nullifier로 중복 방지
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('wc-semaphore-proof', codeRefs['wc-semaphore-proof'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              semaphore.rs
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('wc-pbh-payload', codeRefs['wc-pbh-payload'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              payload.rs
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <ProofFlowViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
