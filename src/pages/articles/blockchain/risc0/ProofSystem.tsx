import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import R0RecursionViz from '../components/R0RecursionViz';
import STARKProofFlowViz from './viz/STARKProofFlowViz';
import CodePanel from '@/components/ui/code-panel';
import { RECURSION_CODE, STARK_CODE, BONSAI_CODE } from './ProofSystemData';
import { recursionAnnotations, starkAnnotations, bonsaiAnnotations } from './ProofSystemAnnotations';
import { codeRefs } from './codeRefs';

const RECEIPT_TYPES = [
  { name: 'SegmentReceipt', color: '#6366f1', desc: '단일 세그먼트의 STARK 증명. 크기 ~200KB. 로컬 검증용.' },
  { name: 'CompositeReceipt', color: '#10b981', desc: '여러 SegmentReceipt를 연결. 전체 실행 증명.' },
  { name: 'SuccinctReceipt', color: '#f59e0b', desc: '재귀 회로로 STARK를 STARK로 압축. ~200KB.' },
  { name: 'Groth16Receipt', color: '#8b5cf6', desc: 'STARK → Groth16 SNARK. ~200바이트 고정. 이더리움 온체인 검증.' },
];

export default function ProofSystem({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="proof-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 시스템 &amp; 재귀 압축</h2>
      <div className="not-prose mb-8"><STARKProofFlowViz /></div>
      <div className="not-prose mb-8"><R0RecursionViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RISC Zero는 <strong>3계층 재귀 증명</strong>으로 STARK의 큰 증명 크기 문제를 해결합니다.<br />
          Raw STARK → Succinct STARK → Groth16 SNARK 순서로 압축해
          온체인 검증 비용을 최소화합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('prover-receipt-pipeline', codeRefs['prover-receipt-pipeline'])} />
          <span className="text-[10px] text-muted-foreground self-center">Receipt 파이프라인</span>
          <CodeViewButton onClick={() => onCodeRef('recursion-lift', codeRefs['recursion-lift'])} />
          <span className="text-[10px] text-muted-foreground self-center">lift() 재귀 진입</span>
          <CodeViewButton onClick={() => onCodeRef('recursion-join', codeRefs['recursion-join'])} />
          <span className="text-[10px] text-muted-foreground self-center">join() 재귀 합성</span>
          <CodeViewButton onClick={() => onCodeRef('recursion-identity', codeRefs['recursion-identity'])} />
          <span className="text-[10px] text-muted-foreground self-center">identity_p254()</span>
        </div>
        <h3>증명 타입 계층</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {RECEIPT_TYPES.map(r => (
            <div key={r.name} className="rounded-lg border p-3"
              style={{ borderColor: r.color + '30', background: r.color + '08' }}>
              <p className="font-mono text-xs font-bold" style={{ color: r.color }}>{r.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{r.desc}</p>
            </div>
          ))}
        </div>
        <CodePanel title="재귀 증명 (Recursion)" code={RECURSION_CODE} annotations={recursionAnnotations} />
        <CodePanel title="zk-STARK 구조 (RISC Zero)" code={STARK_CODE} annotations={starkAnnotations} />
        <CodePanel title="Bonsai (클라우드 증명 서비스)" code={BONSAI_CODE} annotations={bonsaiAnnotations} />
      </div>
    </section>
  );
}
