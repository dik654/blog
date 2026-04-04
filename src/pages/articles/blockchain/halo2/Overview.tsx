import Halo2CircuitViz from '../components/Halo2CircuitViz';
import ProofPipelineViz from './viz/ProofPipelineViz';
import CodePanel from '@/components/ui/code-panel';
import { CRATE_CODE, CIRCUIT_CODE, COLUMN_CODE } from './OverviewData';
import { crateAnnotations, circuitAnnotations, columnAnnotations } from './OverviewAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 회로 구조'}</h2>
      <div className="not-prose mb-8"><Halo2CircuitViz /></div>
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">증명 파이프라인 흐름</h3>
      <div className="not-prose mb-8"><ProofPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Halo2</strong>(zcash/halo2)는 KZG 다항식 커밋 + PLONKish 산술화 기반의
          ZK 증명 프레임워크입니다. 개발자는 <code>Circuit</code> 트레이트를 구현하여
          회로를 정의하고, <code>create_proof</code>로 증명을 생성합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('plonk-mod', codeRefs['plonk-mod'])} />
            <span className="text-[10px] text-muted-foreground self-center">plonk.rs</span>
            <CodeViewButton onClick={() => onCodeRef('circuit-trait', codeRefs['circuit-trait'])} />
            <span className="text-[10px] text-muted-foreground self-center">circuit.rs</span>
          </div>
        )}
        <CodePanel title="크레이트 구조 (halo2_proofs/src/)" code={CRATE_CODE} annotations={crateAnnotations} />
        <CodePanel title="Circuit 트레이트 (circuit.rs)" code={CIRCUIT_CODE} annotations={circuitAnnotations} />
        <CodePanel title="열 유형과 레이아웃" code={COLUMN_CODE} annotations={columnAnnotations} />
      </div>
    </section>
  );
}
