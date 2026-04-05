import Math from '@/components/ui/math';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HyperPLONK이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>HyperPLONK</strong> — Binyi Chen, Benedikt Bunz, Dan Boneh, Zhenfei Zhang가 2022년에 제안한 증명 시스템
          <br />
          <a href="/blockchain/plonk" className="text-indigo-400 hover:underline">PLONK</a>의 핵심 구조를 유지하면서, 다항식 표현과 증명 전략을 근본적으로 교체한 설계
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">PLONK의 병목: FFT</h3>
        <p>
          PLONK은 <strong>단변수 다항식(univariate polynomial)</strong>으로 제약을 인코딩함
          <br />
          witness 다항식의 계수를 구하려면 <a href="/crypto/fft" className="text-indigo-400 hover:underline">FFT</a>가 필수 — 시간 복잡도 <Math>{'O(n \\log n)'}</Math>
          <br />
          FFT는 순차적 butterfly 연산이라 GPU/FPGA 병렬화에 비효율적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">HyperPLONK의 해법</h3>
        <p>
          단변수 다항식 대신 <strong>다중선형 다항식(multilinear polynomial)</strong> 사용
          <br />
          FFT 대신 <strong>sumcheck 프로토콜</strong>로 제약 검증 — prover 복잡도 <Math>{'O(n)'}</Math>
          <br />
          commitment scheme도 KZG 대신 <strong>다중선형 PCS</strong>(Dory, Zeromorph 등)로 교체
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">핵심 구성 요소</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">다중선형 확장 (MLE)</h4>
            <p className="text-sm">
              <Math>{'n'}</Math>개 변수, 각 변수 차수 최대 1
              <br />
              <Math>{'2^n'}</Math>개 평가값을 진리표처럼 인코딩
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">Sumcheck 프로토콜</h4>
            <p className="text-sm">
              <Math>{'\\sum_{x \\in \\{0,1\\}^n} f(x) = T'}</Math> 검증
              <br />
              <Math>{'O(n)'}</Math> 라운드, 각 라운드 <Math>{'O(1)'}</Math> 통신
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <h4 className="font-medium text-sm mb-2">다중선형 PCS</h4>
            <p className="text-sm">
              Dory — 투명 셋업, 로그 크기 증명
              <br />
              Zeromorph — KZG 기반 다중선형 commit
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">HyperPLONK 배경과 동기</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HyperPLONK: Plonk with Arithmetics over Boolean Hypercube
//
// Paper: "HyperPlonk: Plonk with Linear-Time Prover
//         and High-Degree Custom Gates"
// Authors: Binyi Chen, Benedikt Bünz, Dan Boneh, Zhenfei Zhang
// Year: 2022
// Venue: EUROCRYPT 2023
//
// Problem:
//   PLONK prover complexity: O(n log n)
//   Dominated by FFT operations on degree-n polys
//   FFT hard to parallelize on GPU (dependency chains)
//
// Solution:
//   Replace univariate polys with multilinear polys
//   Replace FFT with sum-check protocol
//   O(n) prover complexity (linear time!)

// Polynomial representation comparison:
//
//   PLONK (univariate):
//     Circuit with n gates
//     Witness polynomial w(X): degree n-1
//     Domain: H = {1, w, w^2, ..., w^{n-1}} (roots of unity)
//     FFT needed to:
//       - interpolate w from evals
//       - evaluate w at random points
//       - compute quotient polys
//
//   HyperPLONK (multilinear):
//     Witness multilinear poly f(x_1, ..., x_log n)
//     Variables: log(n) of them
//     Domain: {0,1}^log(n) = boolean hypercube
//     No FFT needed
//     Evaluation at (0,1)^k point: just lookup
//     Evaluation at random point: O(n) sum

// Why multilinear is natural for circuits:
//
//   n circuit gates indexed 0 to n-1
//   Each index has log(n) bits
//   Witness value at gate i:
//     w[i] = f(bit_decompose(i))
//
//   This is EXACTLY the boolean hypercube!
//   log(n) variables, one per bit position

// Sum-check protocol (1992, Lund-Fortnow-Karloff-Nisan):
//
//   Goal: verify sum_{x in {0,1}^k} f(x) = S
//     where f is multivariate polynomial
//
//   Round i:
//     Prover: sends univariate g_i(X) = partial sum
//     Verifier: checks g_i(0) + g_i(1) = prev value
//     Verifier: picks random r_i, asks g_i(r_i)
//     Continue with (f fixed at x_i = r_i)
//
//   After k rounds:
//     Verifier knows f(r_1, ..., r_k)
//     One oracle query to f needed
//
//   Total communication: O(k*d) where d = degree per var
//   For multilinear: d = 1 → O(log n) field elements

// Prover linearity:
//
//   PLONK prover dominates: NTT O(n log n)
//   HyperPLONK prover:
//     - Commitment to multilinear poly: O(n)
//     - Sum-check rounds: O(n) total
//     - Opening proof: depends on PCS
//
//   Total: O(n) if multilinear PCS is linear-time

// Multilinear PCS options:
//
//   1. Dory (Lee, 2021):
//      - Transparent setup
//      - O(log n) proof size
//      - O(log n) verifier
//      - Pairing-based (like KZG)
//
//   2. Zeromorph (Kohrita-Towa, 2023):
//      - Built on KZG (trusted setup)
//      - Reduces multilinear to univariate
//      - O(1) proof size
//      - Needs log(n) KZG openings
//
//   3. Basefold (Zeilberger-Chen-Fisch, 2023):
//      - Merkle-based, transparent
//      - No pairings
//      - O(log^2 n) proof size
//      - Fast prover
//
//   4. Ligero++ / Brakedown:
//      - Code-based multilinear commit
//      - O(sqrt(n)) or O(n^0.5+eps) proofs
//      - Fast prover

// Custom gates in HyperPLONK:
//
//   PLONK: gate constraint is degree-2 polynomial
//   HyperPLONK: can use HIGH-DEGREE custom gates
//     e.g., degree-5 gate: 5 witness cols → 1 constraint
//
//   Enables specialized gates:
//     - Poseidon hash gate (x^5 S-box)
//     - ECDSA signature gate
//     - Range check gate
//
//   Reduces constraint count dramatically

// Performance (benchmarks):
//
//   PLONK (n = 2^20):
//     Prover: ~30 sec (FFT-heavy)
//     Proof: ~700 bytes
//     Verifier: ~2 ms
//
//   HyperPLONK (n = 2^20):
//     Prover: ~10 sec (linear time)
//     Proof: ~5 KB
//     Verifier: ~5 ms
//
//   Trade-off: larger proofs for faster prover

// Implementations:
//   - EspressoSystems/hyperplonk (Rust)
//   - Basefold implementation (yezhang1338)
//   - ProtoStar uses multilinear (folding scheme)
//
// Used in:
//   - Espresso sequencer
//   - Some custom zkEVM designs
//   - Research-focused implementations`}
        </pre>
      </div>
    </section>
  );
}
