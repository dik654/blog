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

        <h3 className="text-xl font-semibold mt-8 mb-3">FRI의 Low-Degree Testing</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// FRI 핵심 아이디어
// "polynomial f(x)의 degree가 N 미만임을 증명"

// Naive: f(x)의 모든 evaluation 검증
// Better: Reed-Solomon code 사용

// FRI 반복 절차
// 1) f(x)를 두 부분으로 분할
//    f(x) = f_even(x²) + x·f_odd(x²)

// 2) Random challenge α 받음
//    f'(y) = f_even(y) + α·f_odd(y)
//    degree(f') = degree(f) / 2

// 3) f' commitment 전송 (Merkle root)

// 4) 다음 iteration로 반복
//    매번 degree 절반으로 감소

// 5) Final step: constant polynomial 도달
//    작은 수의 값만 verify

// Verification
// Prover가 여러 point에서 evaluation 증명
// Verifier가 consistency check

// Soundness
// - Folding이 올바르면 각 단계 degree 절반
// - Random α로 adversary가 속이기 어려움
// - 충분한 iteration 후 false positive 확률 낮음

// Parameters
// - Rate (ρ): 1/2, 1/4, 1/8 (trade-off)
// - Queries (q): soundness level 결정
// - Conjectured soundness: ~100-bit with reasonable params`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">FRI vs KZG</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 두 Polynomial Commitment Scheme 비교

// FRI (STARK)
// + No trusted setup
// + Post-quantum secure
// + Hash-based (simple)
// + Prover 빠름
// - Proof 큼 (10-100KB)
// - Verifier gas 비쌈

// KZG (SNARK)
// + Constant proof (48 bytes per commitment)
// + Verifier 빠름 (pairing)
// - Trusted setup 필요
// - Discrete log (not post-quantum)
// - Prover 중간 속도

// 선택 기준
// - L1 on-chain verification: KZG
// - Recursive aggregation: FRI (prover 속도)
// - L2 pre-aggregation: FRI → KZG wrap
// - Post-quantum concerns: FRI

// Plonky3의 전략
// - Prove layer: FRI (빠른 prover)
// - Final wrap: Groth16/PLONK (작은 proof)
// - 최적 조합 (best of both)`}</pre>

      </div>
    </section>
  );
}
