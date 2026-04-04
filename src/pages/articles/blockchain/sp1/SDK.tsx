import SP1ProofPipelineViz from '../components/SP1ProofPipelineViz';
import ProofPipelineViz from './viz/ProofPipelineViz';
import CodePanel from '@/components/ui/code-panel';
import { PROOF_TYPE_CODE, PIPELINE_CODE, SOLIDITY_CODE, PROVER_NETWORK_CODE } from './SDKData';
import { proofTypeAnnotations, pipelineAnnotations, solidityAnnotations, networkAnnotations } from './SDKAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function SDK({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="sdk" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SDK &amp; 재귀 압축</h2>
      <div className="not-prose mb-8"><ProofPipelineViz /></div>
      <div className="not-prose mb-8"><SP1ProofPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1 SDK는 prove/verify API를 제공합니다.<br />
          증명 종류에 따라 Core STARK, Compressed STARK, Groth16 SNARK, PLONK SNARK를 선택합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('sdk-entry', codeRefs['sdk-entry'])} />
          <span className="text-[10px] text-muted-foreground self-center">SDK 진입점</span>
          <CodeViewButton onClick={() => onCodeRef('sdk-prover', codeRefs['sdk-prover'])} />
          <span className="text-[10px] text-muted-foreground self-center">Prover 트레이트</span>
          <CodeViewButton onClick={() => onCodeRef('cpu-prover', codeRefs['cpu-prover'])} />
          <span className="text-[10px] text-muted-foreground self-center">CpuProver 구현</span>
        </div>
        <CodePanel title="증명 타입 선택" code={PROOF_TYPE_CODE} annotations={proofTypeAnnotations} />
        <CodePanel title="재귀 압축 파이프라인" code={PIPELINE_CODE} annotations={pipelineAnnotations} />
        <CodePanel title="Solidity 검증자" code={SOLIDITY_CODE} annotations={solidityAnnotations} />
        <CodePanel title="Prover Network (클라우드 증명)" code={PROVER_NETWORK_CODE} annotations={networkAnnotations} />
      </div>
    </section>
  );
}
