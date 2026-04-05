export default function Usage() {
  const items = [
    {
      name: 'INTT (역 NTT)',
      desc: 'NTT로 평가한 값들로부터 원래 다항식의 계수를 복원하는 것이 Lagrange 보간의 특수한 경우.',
      color: 'indigo',
      href: '/crypto/fft',
    },
    {
      name: 'PLONK Copy Constraint',
      desc: '와이어 값들이 일치함을 증명할 때 Lagrange basis 다항식 사용.',
      color: 'emerald',
    },
    {
      name: 'STARK AIR',
      desc: '실행 트레이스를 다항식으로 인코딩할 때 Lagrange 보간으로 변환.',
      color: 'amber',
    },
    {
      name: 'Vanishing Polynomial',
      desc: '특정 점들에서 0이 되는 다항식. Lagrange 보간의 분모 부분과 관련.',
      color: 'indigo',
    },
  ];

  return (
    <section id="usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZKP에서의 활용</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Lagrange 보간은 "점 → 다항식" 변환이다.
          <br />
          ZKP에서는 실행 결과(점)를 다항식으로 인코딩하여 증명하므로, 이 변환이 곳곳에서 쓰인다.
        </p>
      </div>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(p => (
          <div key={p.name} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
            <p className={`font-semibold text-sm text-${p.color}-400`}>
              {p.href ? <a href={p.href} className="hover:underline">{p.name} →</a> : p.name}
            </p>
            <p className="text-sm mt-1.5 text-foreground/75">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Lagrange ZKP 활용 사례</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Lagrange Interpolation in ZK Systems
//
// 1) Witness encoding:
//
//    Execution: computes n values y_0, ..., y_{n-1}
//    These become the "witness" of size n
//
//    To prove with ZK:
//      Interpolate y_i into polynomial f(x)
//      f(h_i) = y_i for domain H = {h_0, ..., h_{n-1}}
//
//    ZK proof now about polynomial, not raw values
//    Enables efficient soundness via random evaluation

// 2) Shamir Secret Sharing:
//
//    Secret s to be shared among n parties
//    Polynomial: f(0) = s, random f(1), ..., f(t)
//    Shares: (i, f(i)) for i = 1..n
//
//    Reconstruction:
//      Any t+1 shares → interpolate → get f(0) = s
//      Fewer than t+1 shares → zero information
//
//    Threshold cryptography:
//      t-of-n signing, t-of-n decryption
//      Used: Chainlink, distributed keygen

// 3) PLONK copy constraints:
//
//    Wire values across gates must match:
//      e.g., output of gate 3 = input of gate 7
//
//    Permutation polynomial sigma:
//      sigma(omega^3) = omega^7 (index encoding)
//
//    Copy check: product argument
//      check that z(x) satisfies certain recursion
//      z(x) expressed via Lagrange basis
//
//    L_i(x) * (wire_val - expected) = 0 at each i

// 4) STARK AIR (Algebraic Intermediate Representation):
//
//    Execution trace: 2D table (rows = steps, cols = state)
//    Each column interpolated to polynomial over trace domain
//
//    Trace domain D_trace = {1, w, w^2, ..., w^{T-1}}
//      T = trace length
//
//    Column j polynomial:
//      t_j(x) = sum_step trace[step][j] * L_step(x)
//
//    Constraints expressed as polynomial identities:
//      Transition: P(t_j(x), t_j(w*x)) = 0 for x in D_trace
//      Boundary: t_j(w^step) = expected_value

// 5) INTT (Inverse NTT):
//
//    Given evaluations on unity roots, recover coefficients
//    This is Lagrange interpolation on {1, w, ..., w^{n-1}}
//
//    Fast via FFT structure:
//      O(n log n) instead of O(n^2) naive Lagrange
//
//    Used in:
//      KZG polynomial commitments
//      Polynomial multiplication (convolution)
//      Coefficient extraction from evaluations

// 6) Kate/KZG polynomial commitments:
//
//    Commit: C = g^{f(tau)} (single group element)
//    Open at point z: prove f(z) = y
//
//    Proof: pi = g^{q(tau)} where q(x) = (f(x) - y) / (x - z)
//    Verifier: pairing check
//
//    Interpolation role:
//      f is often known via n evaluations
//      Lagrange used to compute f in coefficient form
//      Or: commit directly via Lagrange basis commits

// 7) Lookup arguments (Plookup, Halo2):
//
//    Prove that witness values are in a lookup table
//
//    Construction:
//      Combine witness and table into one polynomial
//      Prove it's a permutation of table
//
//    Lagrange basis used to express indicator polynomials
//    L_i(x) = 1 if x = omega^i, 0 elsewhere in domain

// 8) Product argument (grand product):
//
//    Prove: prod_i f(omega^i) = P (claimed value)
//
//    Construct z(x):
//      z(1) = 1
//      z(omega^{i+1}) = z(omega^i) * f(omega^i)
//      z(omega^n) = P
//
//    Check via polynomial identity at random point
//
//    Used for: permutation arguments, lookup arguments

// 9) Fiat-Shamir and transcripts:
//
//    Challenges depend on commitments so far
//    r = hash(transcript)
//
//    Prover must then open at r (not in domain H)
//    Uses Lagrange interpolation conceptually:
//      f(r) can be computed from evaluations at H
//      Barycentric formula: O(n) operations

// 10) Evaluation proofs (multi-point):
//
//    Open polynomial at multiple points z_1, ..., z_k
//    Interpolate y_i = f(z_i) at {z_i}
//    Remainder polynomial handles the difference
//
//    Used in: multi-polynomial commitments, Fflonk
//    Reduces multiple openings to single check`}
        </pre>
      </div>
    </section>
  );
}
