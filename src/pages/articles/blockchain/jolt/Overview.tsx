import JoltPipelineViz from '../components/JoltPipelineViz';
import JoltZkVMViz from './viz/JoltZkVMViz';
import CodePanel from '@/components/ui/code-panel';
import { CRATE_CODE, LASSO_CODE, PROOF_CODE } from './OverviewData';
import { crateAnnotations, lassoAnnotations, proofAnnotations } from './OverviewAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & Jolt 아키텍처'}</h2>
      <div className="not-prose mb-8"><JoltPipelineViz /></div>
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">Jolt zkVM 파이프라인</h3>
      <div className="not-prose mb-8"><JoltZkVMViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Jolt</strong>(a16z/jolt)는 RISC-V 명령어를 Lasso 룩업 인수(Lookup Argument)로 증명하는 zkVM(Zero-Knowledge Virtual Machine)입니다.
          <br />
          Spartan(다변량 Sumcheck) + Lasso(희소-밀집 룩업) + Dory(다변량 KZG 커밋) 조합으로 설계됩니다.
          <br />
          기존 R1CS/Groth16 대비 훨씬 단순한 회로를 만듭니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('jolt-prover', codeRefs['jolt-prover'])} />
            <span className="text-[10px] text-muted-foreground self-center">prover.rs</span>
            <CodeViewButton onClick={() => onCodeRef('jolt-proof', codeRefs['jolt-proof'])} />
            <span className="text-[10px] text-muted-foreground self-center">proof_serialization.rs</span>
            <CodeViewButton onClick={() => onCodeRef('jolt-instruction', codeRefs['jolt-instruction'])} />
            <span className="text-[10px] text-muted-foreground self-center">instruction/mod.rs</span>
          </div>
        )}
        <CodePanel title="크레이트 구조 (jolt-core/src/)" code={CRATE_CODE} annotations={crateAnnotations} />
        <CodePanel title="핵심 설계: Lasso 룩업 인수" code={LASSO_CODE} annotations={lassoAnnotations} />
        <CodePanel title="JoltProof — 8단계 Sumcheck 구조" code={PROOF_CODE} annotations={proofAnnotations} />
      </div>
    </section>
  );
}
