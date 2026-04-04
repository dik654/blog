import SumcheckBatchViz from '../components/SumcheckBatchViz';
import LassoLookupViz from './viz/LassoLookupViz';
import CodePanel from '@/components/ui/code-panel';
import { BATCHED_CODE, STAGE1_CODE, STAGE2_CODE } from './SumcheckData';
import { batchedAnnotations, stage1Annotations, stage2Annotations } from './SumcheckAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Sumcheck({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="sumcheck" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Spartan Sumcheck & 증명 파이프라인'}</h2>
      <div className="not-prose mb-8"><SumcheckBatchViz /></div>
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">Lasso 룩업 프로세스</h3>
      <div className="not-prose mb-8"><LassoLookupViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Jolt의 증명 엔진은 <strong>BatchedSumcheck</strong>로 다수의 독립 Sumcheck를
          단일 증명으로 병합합니다. 각 단계는 <code>SumcheckInstanceProver</code> 트레이트로
          추상화되어 스트리밍 방식으로 처리됩니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('jolt-sumcheck', codeRefs['jolt-sumcheck'])} />
            <span className="text-[10px] text-muted-foreground self-center">sumcheck.rs</span>
            <CodeViewButton onClick={() => onCodeRef('jolt-prover', codeRefs['jolt-prover'])} />
            <span className="text-[10px] text-muted-foreground self-center">prover.rs</span>
          </div>
        )}
        <CodePanel title="BatchedSumcheck::prove (subprotocols/sumcheck.rs)" code={BATCHED_CODE} annotations={batchedAnnotations} />
        <CodePanel title="Stage 1: Spartan Outer Sumcheck (prover.rs)" code={STAGE1_CODE} annotations={stage1Annotations} />
        <CodePanel title="Stage 2: RAM & Instruction 결합 Sumcheck" code={STAGE2_CODE} annotations={stage2Annotations} />
      </div>
    </section>
  );
}
