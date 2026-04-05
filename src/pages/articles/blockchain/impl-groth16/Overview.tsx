import OverviewViz from './viz/OverviewViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">R1CS → QAP 변환</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          모든 계산을 "곱셈 하나"의 형태로 분해 — R1CS (Rank-1 Constraint System)
          <br />
          A·s * B·s = C·s — 덧셈은 선형결합으로 흡수, 제약 불필요
          <br />
          곱셈 하나가 제약 하나. 복잡한 프로그램도 곱셈 단위로 쪼개면 R1CS로 표현 가능
        </p>
        <p className="leading-7">
          R1CS 행렬의 각 열을 Lagrange 보간하면 다항식 aⱼ(x), bⱼ(x), cⱼ(x) 생성 — QAP
          <br />
          m개의 등식 검사를 하나의 다항식 항등식 a(x)·b(x) - c(x) = h(x)·t(x)로 압축
          <br />
          Schwartz-Zippel: 랜덤 점 τ에서 성립하면 전체 다항식이 같을 확률 압도적
        </p>
      </div>
      <div className="not-prose mb-8">
        <OverviewViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          도메인을 단순 {'{1, 2, ..., m}'}으로 선택 — 교육용으로 O(n^2) Lagrange 보간 사용
          <br />
          프로덕션 구현은 roots of unity를 도메인으로 써서 FFT 기반 O(n log n) 보간 가능
          <br />
          열이 전부 0인 변수는 보간 생략 — 희소 행렬 최적화로 불필요한 연산 절약
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Groth16 R1CS → QAP 수학</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Groth16 R1CS → QAP Transformation
//
// Input: R1CS instance
//   A, B, C: m x n matrices over F_p
//   witness vector s of length n
//
// Constraint i:
//   (A_i . s) * (B_i . s) = (C_i . s)
//
// Goal: single polynomial identity equivalent to ALL m constraints

// Step 1: Choose evaluation domain H
//
//   H = {h_1, h_2, ..., h_m}  (m distinct points in F_p)
//
//   Option A (educational): H = {1, 2, ..., m}
//     Simple, O(m^2) Lagrange
//   Option B (production): H = {omega^0, ..., omega^{m-1}}
//     Unity roots, O(m log m) NTT/FFT

// Step 2: Interpolate each column
//
//   For column j (j = 1..n):
//     A_j(x): interpolation through {(h_i, A[i][j])}_i
//     B_j(x): interpolation through {(h_i, B[i][j])}_i
//     C_j(x): interpolation through {(h_i, C[i][j])}_i
//
//   Each polynomial has degree m-1
//   Represents contribution of variable j across all constraints

// Step 3: Witness-weighted sums
//
//   A(x) = sum_{j=1}^n s_j * A_j(x)
//   B(x) = sum_{j=1}^n s_j * B_j(x)
//   C(x) = sum_{j=1}^n s_j * C_j(x)
//
//   At domain point h_i:
//     A(h_i) = sum_j s_j * A[i][j] = A_i . s
//     B(h_i) = B_i . s
//     C(h_i) = C_i . s

// Step 4: Equivalence
//
//   R1CS satisfied iff:
//     A(h_i) * B(h_i) = C(h_i)  for all i = 1..m
//
//   Equivalently:
//     p(x) := A(x) * B(x) - C(x)
//     p(h_i) = 0 for all h_i in H
//
//   Equivalently:
//     t(x) := prod_i (x - h_i)  (vanishing polynomial)
//     t(x) | p(x)
//
//   Equivalently: exists h(x) such that
//     p(x) = A(x) * B(x) - C(x) = t(x) * h(x)

// Step 5: Schwartz-Zippel check
//
//   Polynomial degrees:
//     deg(A), deg(B), deg(C) <= m-1
//     deg(p) <= 2(m-1)
//     deg(t) = m
//     deg(h) <= m-2
//
//   If a random point tau is sampled from F_p:
//     Check: A(tau) * B(tau) - C(tau) = t(tau) * h(tau)
//
//   Soundness: if prover lies, probability of passing <= 2m / |F_p|
//     For |F_p| ~ 2^254 and m ~ 10^6: ~2^-228 (negligible)

// Step 6: Commit to polynomials (Groth16)
//
//   Trusted setup provides [g^{tau^k}]_1 and [g^{tau^k}]_2
//   for k = 0..2m
//
//   Commitment to A(tau):
//     [A(tau)]_1 = sum_k a_k * [g^{tau^k}]_1
//       where A(x) = sum_k a_k * x^k
//
//   Analogous for B, C, h
//
//   This is KZG-style commitment in pairing-friendly curve

// Production optimizations:
//
//   1) Use unity roots for H:
//      t(x) = x^m - 1
//      evaluation at tau: tau^m - 1 (O(log m))
//      polynomial arithmetic via FFT
//
//   2) Sparse column interpolation:
//      If column j is all zeros (common for witness padding):
//        A_j(x) = 0 identically
//        Skip interpolation entirely
//
//   3) Batch MSM (multi-scalar multiplication):
//      Commit to witness using Pippenger's algorithm
//      O(n / log n) effective scalar mults
//
//   4) Parallel FFT:
//      Multi-threaded butterflies
//      GPU acceleration (CUDA)
//
//   5) Memory-efficient QAP:
//      Stream columns instead of storing all
//      Critical for circuits with 10^7+ constraints

// Circuit size in practice:
//
//   Small: Zcash Sapling (~30K constraints)
//   Medium: DEX privacy (~100K)
//   Large: zkEVM batch (~50M constraints)
//   Very large: zkRollup proof of compute (100M+)
//
//   Prover time scales: O(n log n) via FFT`}
        </pre>
      </div>
    </section>
  );
}
