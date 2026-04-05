import Math from '@/components/ui/math';

export default function DFT() {
  return (
    <section id="dft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DFT와 시간복잡도</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          DFT(Discrete Fourier Transform)는 다항식을 n개 점에서 동시에 평가하는 연산이다.
          <br />
          차수 n-1 다항식 <Math>{'f(x) = a_0 + a_1 x + \\cdots + a_{n-1} x^{n-1}'}</Math>을
          <br />
          평가점 <Math>{'\\{\\omega^0, \\omega^1, \\ldots, \\omega^{n-1}\\}'}</Math>에서 계산한다
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">행렬-벡터 곱으로 보는 DFT</h3>
        <p>
          DFT는 행렬 <Math>{'W'}</Math>와 계수 벡터 <Math>{'\\mathbf{a}'}</Math>의 곱이다:
        </p>
        <Math display>{'\\begin{pmatrix} y_0 \\\\ y_1 \\\\ y_2 \\\\ y_3 \\end{pmatrix} = \\begin{pmatrix} 1 & 1 & 1 & 1 \\\\ 1 & \\omega & \\omega^2 & \\omega^3 \\\\ 1 & \\omega^2 & \\omega^4 & \\omega^6 \\\\ 1 & \\omega^3 & \\omega^6 & \\omega^9 \\end{pmatrix} \\begin{pmatrix} a_0 \\\\ a_1 \\\\ a_2 \\\\ a_3 \\end{pmatrix}'}</Math>
        <p>
          i행 j열 원소가 <Math>{'\\omega^{ij}'}</Math>인 <Math>{'n \\times n'}</Math> 행렬이다.
          <br />
          이 행렬-벡터 곱을 직접 계산하면 <Math>{'O(n^2)'}</Math> — 각 행마다 n번 곱셈, 총 n행
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          구체적 예시: <Math>{'\\mathbb{F}_{17}'}</Math>
        </h3>
        <p>
          <Math>{'p = 17'}</Math>이면 <Math>{'p - 1 = 16 = 2^4'}</Math>이므로 최대 16차 단위근이 존재한다.
          <br />
          n=4일 때 4차 단위근: <Math>{'4^4 = 256 \\equiv 1 \\pmod{17}'}</Math> → <Math>{'\\omega = 4'}</Math>
        </p>
        <p>
          다항식 <Math>{'f(x) = 1 + 2x + 3x^2 + 4x^3'}</Math>을 DFT로 평가:
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { pt: 'f(ω⁰) = f(1)', calc: '1+2+3+4 = 10', color: 'indigo' },
            { pt: 'f(ω¹) = f(4)', calc: '1+8+48+256 = 313 ≡ 7 (mod 17)', color: 'emerald' },
            { pt: 'f(ω²) = f(16)', calc: '16≡-1 이므로 1-2+3-4 = -2 ≡ 15', color: 'amber' },
            { pt: 'f(ω³) = f(13)', calc: '13²≡16, 13³≡4 → 1+26+48+16 = 91 ≡ 6', color: 'indigo' },
          ].map(p => (
            <div key={p.pt} className={`rounded-lg border border-${p.color}-500/20 bg-${p.color}-500/5 p-4`}>
              <p className={`font-semibold text-sm text-${p.color}-400`}>{p.pt}</p>
              <p className="text-sm mt-1.5 text-foreground/75">{p.calc}</p>
            </div>
          ))}
        </div>
        <p>
          결과: <Math>{'[10,\\; 7,\\; 15,\\; 6]'}</Math> (모든 연산은 mod 17).
          <br />
          이 4개 값을 얻기 위해 16번의 곱셈이 필요했다 — <Math>{'O(n^2)'}</Math>.
          <br />
          FFT는 같은 결과를 <Math>{'O(n \\log n) = 8'}</Math>번 연산으로 얻는다
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">DFT 수학적 심층</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Discrete Fourier Transform (DFT)
//
// Two interpretations:
//
//   (1) Evaluation interpretation:
//     Polynomial f(x) = a_0 + a_1*x + ... + a_{n-1}*x^{n-1}
//     Evaluate at n points: 1, w, w^2, ..., w^{n-1}
//     Result: [f(1), f(w), f(w^2), ..., f(w^{n-1})]
//
//   (2) Linear algebra interpretation:
//     y = W * a  where W[i][j] = w^{i*j}
//     W is the Vandermonde matrix of unity roots
//     O(n^2) for direct multiplication

// Vandermonde property:
//
//   W * W^H = n * I  (where W^H has w^{-ij})
//   → W^{-1} = (1/n) * W^H
//   → DFT is INVERTIBLE
//
//   Shannon-Whittaker: n distinct points uniquely
//   determine a degree-(n-1) polynomial

// Why DFT matrix is full rank:
//
//   det(W) = product_{i<j}(w^j - w^i)
//   Each (w^j - w^i) is nonzero (distinct roots)
//   → det != 0
//   → W invertible
//   → inverse transform exists

// Direct computation (O(n^2)):
//
//   for k in 0..n:
//     y[k] = 0
//     for j in 0..n:
//       y[k] += a[j] * w^{k*j mod n}
//
//   n^2 mults + n^2 adds
//   For n = 1M: 10^12 ops, ~1000 sec

// Cooley-Tukey decomposition (O(n log n)):
//
//   Split by parity:
//     f_even(x) = a_0 + a_2*x + a_4*x^2 + ...
//     f_odd(x)  = a_1 + a_3*x + a_5*x^2 + ...
//
//   Then: f(x) = f_even(x^2) + x * f_odd(x^2)
//
//   Evaluate at {w^0, ..., w^{n-1}}:
//     f_even and f_odd need evaluation at
//       {w^0, w^2, w^4, ...} = {w'^0, w'^1, ...}
//       where w' = w^2 is primitive (n/2)-root
//
//   Recursion:
//     T(n) = 2*T(n/2) + O(n)
//         = O(n log n)

// Example evaluation in F_17:
//
//   p = 17, n = 4, w = 4
//     Verify: 4^4 = 256 = 15*17 + 1 ≡ 1 (mod 17) ✓
//     Verify: 4^2 = 16 ≡ -1 ≠ 1 (mod 17) ✓ (primitive)
//
//   W matrix (mod 17):
//     row 0: [1, 1, 1, 1]
//     row 1: [1, 4, 16, 13]  (4^1, 4^2, 4^3)
//     row 2: [1, 16, 1, 16]  (4^2, 4^4=1, 4^6=16)
//     row 3: [1, 13, 16, 4]  (4^3, 4^6=16, 4^9=4)
//
//   Coefficients: a = [1, 2, 3, 4]
//
//   Matrix mult:
//     y_0 = 1*1 + 1*2 + 1*3 + 1*4 = 10
//     y_1 = 1*1 + 4*2 + 16*3 + 13*4 = 1+8+48+52 = 109 ≡ 7
//     y_2 = 1*1 + 16*2 + 1*3 + 16*4 = 1+32+3+64 = 100 ≡ 15
//     y_3 = 1*1 + 13*2 + 16*3 + 4*4 = 1+26+48+16 = 91 ≡ 6
//
//   Result: y = [10, 7, 15, 6]

// Parseval's theorem (NTT version):
//
//   sum_i a_i * conj(a_i) = (1/n) * sum_k |y_k|^2
//
//   In F_p: coefficient norm related to evaluation norm
//   Used in bounded-error estimates

// Important subtransforms:
//
//   Cosine-sine form (real input):
//     Reduced to 2 DFTs of size n/2
//     Used in MP3, JPEG compression
//
//   Inverse DFT:
//     Same structure, use w^{-1}, divide by n
//
//   Fractional DFT:
//     Evaluate at {w^0, w^{1/k}, ..., w^{(n-1)/k}}
//     Used in signal processing

// Efficient algorithms beyond Cooley-Tukey:
//
//   1. Stockham algorithm:
//      No bit-reversal needed
//      Better for GPU/SIMD
//
//   2. Six-step FFT:
//      Handles very large n
//      Cache-aware memory access
//
//   3. Bluestein's algorithm:
//      Works for ANY n (not just 2^k)
//      Uses chirp z-transform
//
//   4. Rader's algorithm:
//      FFT of prime size via number-theoretic trick
//      Converts to convolution`}
        </pre>
      </div>
    </section>
  );
}
