import Halo2ProofFlow from '../components/Halo2ProofFlow';
import CodePanel from '@/components/ui/code-panel';
import { PHASE1_CODE, PHASE2_CODE, PHASE5_CODE } from './ProverData';
import { phase1Annotations, phase2Annotations, phase5Annotations } from './ProverAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Prover({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="prover" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'create_proof — 증명 생성 파이프라인'}</h2>
      <div className="not-prose mb-8"><Halo2ProofFlow /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>create_proof</code>는 PLONKish 증명의 전체 단계를 구현합니다.<br />
          Fiat-Shamir 트랜스크립트로 도전값을 생성하며, KZG 다중 개구(SHPLONK)로 마무리됩니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('create-proof', codeRefs['create-proof'])} />
            <span className="text-[10px] text-muted-foreground self-center">create_proof()</span>
            <CodeViewButton onClick={() => onCodeRef('verify-proof', codeRefs['verify-proof'])} />
            <span className="text-[10px] text-muted-foreground self-center">verify_proof()</span>
          </div>
        )}
        <CodePanel title="Phase 1: 어드바이스 커밋 (prover.rs)" code={PHASE1_CODE} annotations={phase1Annotations} />
        <CodePanel title="Phase 2~4: 도전값 & 그랜드 프로덕트" code={PHASE2_CODE} annotations={phase2Annotations} />
        <CodePanel title="Phase 5: 개구 & SHPLONK" code={PHASE5_CODE} annotations={phase5Annotations} />
      </div>
    </section>
  );
}
