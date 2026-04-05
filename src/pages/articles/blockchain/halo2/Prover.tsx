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

        <h3 className="text-xl font-semibold mt-8 mb-3">PLONKish Proof 5단계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Phase 1: Advice column commitments
// - Prover가 witness를 polynomial로 변환
// - 각 advice column a(X)에 대해 [a]₁ commitment 계산
// - Transcript에 commitment 추가

// Phase 2: Challenges (β, γ)
// - Transcript hash로 random challenge 생성
// - Permutation argument에 사용

// Phase 3: Permutation polynomial z(X)
// - Grand product construction
// - z(ωX)/z(X) = (numerator)/(denominator)
// - Column permutation 검증

// Phase 4: Lookup polynomials
// - Plookup-style argument
// - 각 lookup table마다 h_A(X), h_T(X), g(X) 계산

// Phase 5: Vanishing argument & opening
// - Quotient polynomial t(X) 계산
// - Evaluation at challenge point z
// - SHPLONK multi-point opening
// - Final proof = (commitments, evaluations, opening proof)

// Complexity
// - FFT: O(n log n)
// - Multi-scalar mult (MSM): O(n)
// - Typical proof time: 10s ~ 60s (depends on circuit size)
// - GPU acceleration: 5-10x speedup

// Memory requirements
// - 2^20 circuit: ~8GB
// - 2^24 circuit: ~64GB
// - zkEVM circuit: requires 128GB+ machine`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Fiat-Shamir Transformation</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Interactive → Non-interactive 변환

// Interactive version (이론)
// 1) Prover: commitment C 전송
// 2) Verifier: random challenge c 전송
// 3) Prover: response r 전송
// 4) Verifier: (C, c, r) 검증

// Fiat-Shamir heuristic
// challenge c = H(transcript_so_far)
// - Verifier 대신 hash function 사용
// - Prover가 challenge 예측 불가
// - Transcript = 모든 previous messages

// Halo2 Transcript
impl Transcript {
    fn commit_point(&mut self, point: G1Point) {
        self.hash.update(point.to_bytes());
    }

    fn squeeze_challenge(&mut self) -> Scalar {
        let hash = self.hash.finalize();
        Scalar::from_bytes(&hash[..32])
    }
}

// Security assumption
// "H is random oracle"
// - H의 output이 완전 random (uniform)
// - 현실 hash (SHA, Keccak, Poseidon)로 근사

// Halo2 hash choices
// - Blake2b (general, fast)
// - Poseidon (SNARK-friendly, recursive)
// - Keccak (EVM verifier 호환)`}</pre>

      </div>
    </section>
  );
}
