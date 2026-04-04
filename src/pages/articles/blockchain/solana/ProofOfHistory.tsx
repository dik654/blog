import PoHViz from './viz/PoHViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ProofOfHistory({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="poh" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proof of History</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PoH — Verifiable Delay Function(VDF) 변형<br />
          SHA-256 순차 해싱으로 시간 흐름 증명. 해시 체인 자체가 시계 역할
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('sol-poh-tick', codeRefs['sol-poh-tick'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              poh_service.rs — tick
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('sol-poh-record', codeRefs['sol-poh-record'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              poh_recorder.rs — record
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <PoHViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
