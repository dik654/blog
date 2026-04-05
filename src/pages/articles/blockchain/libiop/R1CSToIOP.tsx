import CodePanel from '@/components/ui/code-panel';
import R1CSTransformViz from './viz/R1CSTransformViz';
import { R1CS_CODE, POLYNOMIAL_CODE } from './R1CSToIOPData';

export default function R1CSToIOP() {
  return (
    <section id="r1cs-iop" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS → IOP 변환</h2>
      <div className="not-prose mb-8">
        <R1CSTransformViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          R1CS(Rank-1 Constraint System)는
          <code>A*z o B*z = C*z</code> 형태의 제약 시스템입니다.<br />
          이를 다항식 IOP로 변환하는 과정이
          libiop의 핵심 변환 단계입니다.
        </p>
        <h3>R1CS 제약 시스템</h3>
        <CodePanel title="r1cs.hpp 구조" code={R1CS_CODE}
          annotations={[
            { lines: [5, 7], color: 'sky', note: '입력/증인 크기 정의' },
            { lines: [8, 8] as [number, number], color: 'emerald', note: '제약 조건 벡터' },
            { lines: [10, 13], color: 'amber', note: '만족 검사 함수' },
          ]} />
        <h3>다항식 IOP 변환 과정</h3>
        <CodePanel title="R1CS -> 다항식 IOP" code={POLYNOMIAL_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: '라그랑주 보간으로 다항식화' },
            { lines: [6, 8], color: 'emerald', note: 'vanishing polynomial 분해' },
            { lines: [10, 12], color: 'amber', note: 'RS 인코딩 적용' },
            { lines: [15, 15] as [number, number], color: 'violet', note: '머클 트리 커밋' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">R1CS → Polynomial IOP 변환</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// R1CS (Rank-1 Constraint System)
//
// 형태:
//   A·z ⊙ B·z = C·z
//
//   z = (1, x_1, x_2, ..., x_n, w_1, ..., w_m)
//     z = (public || private || intermediate)
//
//   A, B, C ∈ F^{m×(n+m+1)}
//   ⊙ = element-wise product
//
// 각 constraint i:
//   (Σ A_ij · z_j) × (Σ B_ij · z_j) = Σ C_ij · z_j

// R1CS → Polynomial IOP 변환:
//
// Step 1: Lagrange Interpolation
//   Domain H = {ω^0, ω^1, ..., ω^{m-1}}
//   (ω = m-th root of unity)
//
//   A-vector → polynomial Â(x):
//     Â(ω^i) = (A·z)_i for all i
//
//   Similarly B̂(x), Ĉ(x)
//
// Step 2: Multiplication Check
//   Constraint holds ⟺
//     Â(x) · B̂(x) = Ĉ(x) mod v_H(x)
//
//   where v_H(x) = ∏(x - ω^i)
//     (vanishing polynomial of H)
//
// Step 3: Quotient Polynomial
//   Define h(x) such that:
//     Â(x)·B̂(x) - Ĉ(x) = v_H(x) · h(x)
//
//   If R1CS satisfied → h(x) exists, low degree
//   If not → h(x) has high degree (not polynomial)
//
// Step 4: Commit via Low-Degree Test
//   Prover commits Â, B̂, Ĉ, h
//   Verifier uses FRI or Direct LDT
//     to check h has low degree

// IOP Protocol Flow:
//
//   P sends: commit(Â), commit(B̂), commit(Ĉ), commit(ĥ)
//   V sends: random point ρ
//
//   P sends: Â(ρ), B̂(ρ), Ĉ(ρ), ĥ(ρ)
//            + opening proofs
//
//   V checks:
//     Â(ρ) · B̂(ρ) - Ĉ(ρ) == v_H(ρ) · ĥ(ρ)
//     all openings valid
//     low-degree test passes

// Soundness:
//   Schwartz-Zippel: 잘못된 경우
//     prob[검사 통과] ≤ degree / |F|
//     F = large field (~2^254)
//     → negligible error

// 실제 구현:
//   libiop: C++ reference
//   circom + snarkjs: production
//   arkworks-rs: Rust
//   halo2: PLONKish (R1CS 대체)`}
        </pre>
      </div>
    </section>
  );
}
