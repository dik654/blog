import FRIFoldingViz from '../components/FRIFoldingViz';
import FRIFoldingStepsViz from './viz/FRIFoldingStepsViz';
import CodePanel from '@/components/ui/code-panel';
import { friProverCode, twoAdicPcsCode } from './FRIData';
import { merkleTreeCode } from './FRIData2';
import { friAnnotations, pcsAnnotations, merkleAnnotations } from './FRIAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function FRI({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="fri" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'FRI & TwoAdicFriPcs'}</h2>
      <div className="not-prose mb-8"><FRIFoldingStepsViz /></div>
      <div className="not-prose mb-8"><FRIFoldingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          FRI(Fast Reed-Solomon IOP)는 다항식 f(x)의 차수가 N 미만임을
          증명하는 저차 검증 프로토콜입니다. Plonky3의{' '}
          <strong>TwoAdicFriPcs</strong>는 FRI 위에 다항식 커밋 스킴(PCS)을 구현하며
          STARK 열기 증명(opening proof)을 생성합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('p3-fri-pcs', codeRefs['p3-fri-pcs'])} />
            <span className="text-[10px] text-muted-foreground self-center">two_adic_pcs.rs</span>
            <CodeViewButton onClick={() => onCodeRef('p3-poseidon2', codeRefs['p3-poseidon2'])} />
            <span className="text-[10px] text-muted-foreground self-center">poseidon2/lib.rs</span>
          </div>
        )}
        <CodePanel title="FRI 프로토콜 구조 (fri/src/prover.rs)" code={friProverCode} annotations={friAnnotations} />
        <CodePanel title="TwoAdicFriPcs — FRI 기반 PCS (fri/src/two_adic_pcs.rs)" code={twoAdicPcsCode} annotations={pcsAnnotations} />
        <CodePanel title="머클 트리 구조 (merkle-tree/src/merkle_tree.rs)" code={merkleTreeCode} annotations={merkleAnnotations} />
      </div>
    </section>
  );
}
