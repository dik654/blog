import Math from '@/components/ui/math';

export default function INTT() {
  return (
    <section id="intt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">INTT (역변환)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          NTT가 계수 → 평가 변환이라면, INTT는 평가 → 계수 역변환이다.
          <br />
          평가 결과 [f(ω⁰), f(ω¹), …]로부터 원래 계수 [a₀, a₁, …]를 복원한다.
          <br />
          이것은 <a href="/crypto/lagrange" className="text-indigo-400 hover:underline">Lagrange 보간</a>의
          특수한 경우다 — 평가점이 단위근이므로 공식이 단순해진다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">NTT와의 관계</h3>
        <p>
          NTT를 행렬로 쓰면 <Math>{'\\mathbf{y} = W \\cdot \\mathbf{a}'}</Math> (W는 단위근 행렬).
          <br />
          INTT는 역행렬: <Math>{'\\mathbf{a} = W^{-1} \\cdot \\mathbf{y}'}</Math>.
          <br />
          단위근의 성질 덕분에 <Math>{'W^{-1} = \\frac{1}{n} \\cdot \\bar{W}'}</Math>
          (<Math>{'\\bar{W}'}</Math>는 ω를 ω⁻¹로 바꾼 행렬).
          <br />
          즉 INTT = "ω 대신 ω⁻¹을 쓰고, 결과를 n으로 나누는" NTT다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          수치 예시: <Math>{'\\mathbb{F}_{17}'}</Math>, n=4, ω=4
        </h3>
        <p>
          NTT 결과 [14, 12, 14, 9]로부터 원래 계수를 복원:
          <br />
          ω⁻¹ = 4⁻¹ mod 17. 4×13=52≡1 → ω⁻¹ = 13.
          <br />
          n⁻¹ = 4⁻¹ mod 17 = 13
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { name: 'NTT', desc: '계수 → 평가. ω 사용. O(n log n).', color: 'indigo' },
            { name: 'INTT', desc: '평가 → 계수. ω⁻¹ 사용, ÷n. O(n log n).', color: 'emerald' },
          ].map(p => (
            <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.name}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">INTT 수식 유도 및 응용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Inverse NTT (INTT)
//
// Derivation:
//
//   NTT:  y = W * a  (evaluate at unity roots)
//   INTT: a = W^{-1} * y
//
//   Claim: W^{-1}[i][j] = (1/n) * w^{-ij}
//
//   Proof:
//     (W * W^{-1})[i][k] = sum_j (w^{ij} * (1/n) * w^{-jk})
//                       = (1/n) * sum_j w^{j(i-k)}
//
//     If i = k: sum = (1/n) * n = 1 (diagonal)
//     If i != k: sum of n-th roots of unity = 0 (off-diagonal)
//
//     So W * W^{-1} = I ✓
//
//   This means:
//     a_j = (1/n) * sum_k y_k * w^{-jk}
//     → Same structure as forward NTT
//     → Use w^{-1} instead of w, divide by n

// Key observation:
//   INTT uses EXACT SAME ALGORITHM as NTT
//   Just substitute:
//     w → w^{-1}
//     Scale result by 1/n
//
//   Huge practical benefit: ONE implementation
//   Used for both forward and inverse

// Computing n^{-1} in F_p:
//
//   n^{-1} = n^{p-2} mod p  (Fermat's little theorem)
//   O(log p) multiplications
//   Computed once, used n times

// Normalization strategies:
//
//   Strategy 1: divide at the end
//     Perform INTT as forward with w^{-1}
//     At the very end: a[i] *= n_inv for all i
//     → 1 extra O(n) pass
//
//   Strategy 2: fold into twiddle factors
//     Use (w^{-1} * n^{-1/k}) instead of w^{-1}
//     where k = log2(n)
//     → distributes scaling through butterflies
//     → Fewer passes, same total ops
//
//   Strategy 3: combined with final bit-reversal
//     If bit-rev needed anyway: integrate
//     → Near-zero overhead

// Round-trip consistency check:
//
//   For any vector a:
//     INTT(NTT(a)) == a
//
//   Verification pattern in test suites:
//     a = random vector
//     b = NTT(a)
//     c = INTT(b)
//     assert(a == c)  // sanity check

// Applications of INTT:
//
//   1. Polynomial multiplication:
//      c = INTT(NTT(a) pointwise NTT(b))
//      Final step recovers coefficients
//
//   2. Polynomial interpolation:
//      Given evaluations, get coefficients
//      INTT is exactly the Lagrange interp
//      on unity roots
//
//   3. Polynomial division:
//      p(x) / q(x) via inverse
//      Requires multiple NTT/INTT
//
//   4. Convolution:
//      discrete conv = pointwise mult in freq domain
//      INTT to return to time domain

// Complexity summary:
//
//   NTT:  O(n log n) multiplications
//   Pointwise mult: O(n) multiplications
//   INTT: O(n log n) multiplications + O(n) divide
//
//   Total poly multiply: 3 FFTs + O(n)
//                      = O(n log n)
//
//   Typical size n = 2^20 to 2^28 in modern ZK

// Batched NTT/INTT:
//
//   Multiple independent polys in parallel
//   GPU: batch size 32-128 fits in shared memory
//   CPU with SIMD: batch 4-8

// Special case: bit-reverse trick
//
//   Forward NTT: natural → bit-rev
//   Inverse NTT: bit-rev → natural
//   → If output bit-rev acceptable, skip explicit permutation
//   → Saves O(n) work
//
//   Common pattern in ZK provers:
//     NTT(coeffs_natural) → evals_bitrev
//     pointwise ops in bitrev → compat with INTT

// Implementation layers:
//
//   High-level (ark-poly):
//     DensePolynomial<F>::{fft, ifft}
//     EvaluationDomain<F>::{fft_in_place, ifft_in_place}
//
//   Low-level (bellperson, plonk-core):
//     fn ntt(values: &mut [F], omega: F, log_n: u32)
//     Cooley-Tukey radix-2 butterflies
//
//   Assembly (BLST, IceCream):
//     Hand-tuned butterfly loops
//     AVX-512 / NEON intrinsics
//     ~2-3x faster than Rust intrinsics`}
        </pre>
      </div>
    </section>
  );
}
