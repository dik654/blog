import WhySparseViz from './viz/WhySparseViz';

export default function WhySparse() {
  return (
    <section id="why-sparse" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 희소한가: twist 구조</h2>
      <div className="not-prose mb-8"><WhySparseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          l(P)가 sparse한 이유는 G1 점 P와 G2 점 T의{' '}
          <strong>좌표 공간 차이</strong> 때문이다.<br />
          P의 좌표는 Fp(정수 1개), T의 좌표는 Fp2(a+bu 형태)다.
        </p>
        <p>
          degree-6 twist 구조 덕분에 접선 방정식{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">
            l(x,y) = yP + (-lambda*xP)*w + (lambda*xT - yT)*w*v
          </code>{' '}
          를 Fp12로 매핑하면, 특정 위치만 값이 채워진다.
        </p>
        <p>
          Fp 원소는 첫 번째 슬롯에만 들어간다. 나머지 11개는 0이다.<br />
          Fp2 원소는 특정 2개 슬롯에만 들어간다.<br />
          합치면 12개 중 <strong>3개 슬롯만 non-zero</strong>가 된다.
        </p>
        <p>
          twist의 degree가 6이라는 사실이 이 구조를 결정한다.<br />
          BN254처럼 embedding degree 12, twist degree 6인 곡선에서는
          항상 이 희소 패턴이 나타난다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Twist 구조와 Sparse 패턴</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Why Line Functions Are Sparse in Fp12
//
// Setup:
//   Pairing: e(P, Q) where
//     P is in G_1 (defined over Fp)
//     Q is in G_2 (defined over Fp2 via twist)
//
//   Miller loop accumulates:
//     f = f^2 * l_{T,T}(P)   [doubling step]
//     f = f * l_{T,Q}(P)      [addition step]
//
//   Where l is the "line function" through curve points

// Line function structure:
//
//   l(x, y) = y - lambda*(x - x_T) - y_T
//
//   In projective coordinates:
//     l(x, y) = y*Z_T - lambda*x + (lambda*x_T - y_T*Z_T)
//
//   Evaluated at P = (x_P, y_P) in Fp:
//     l(P) = y_P - lambda*x_P*u - (lambda*x_T - y_T)*u*v
//
//   Where u, v are extension field elements
//   (u^2 = -1 for Fp2, v^3 = u+1 or similar for Fp6)

// Twist mapping to Fp12:
//
//   BN254: sextic twist
//     Fp2 ← Fp [u] / (u^2 + 1)
//     Fp6 ← Fp2[v] / (v^3 - (u+9))
//     Fp12 ← Fp6[w] / (w^2 - v)
//
//   Embedding G_2 points:
//     P_twist in E'(Fp2) → P in E(Fp12) via untwist map
//     Coefficients appear in specific Fp12 slots
//
//   Line function lives in Fp12:
//     basis: {1, w, v, vw, v^2, v^2*w}  (via Fp6 tower)
//     equivalently 12 Fp elements

// Slot usage (BN254-style D-twist):
//
//   l(P) = c0 + c1*w^2 + c2*w^3  (in Fp12)
//   (or some equivalent decomposition)
//
//   Expanded into Fp12 basis:
//     Fp12 has 12 Fp coefficients
//     Only 3 of them are nonzero from line function
//     Remaining 9 are zero
//
//   Standard convention: "mul_by_034"
//     indices 0, 3, 4 are nonzero (out of 0..11)
//     or sometimes different depending on basis order

// Why exactly 3 slots?
//
//   Line function structure: a + b*w + c*w^2 (degree-2 in w)
//     Only 3 Fp6 coefficients
//
//   Each Fp6 coeff is an Fp2 element = 2 Fp coeffs
//   Total: 6 Fp coefficients
//
//   But wait — ALL 3 Fp6 slots can be nonzero!
//   Why only 3 out of 12 then?
//
//   Deeper reason:
//     Line function evaluated at Fp point P
//     Has additional structure: some Fp2 components vanish
//     End up with only 3 Fp-coefficients nonzero
//
//   For M-twist vs D-twist: different slot patterns
//     M-twist: 014 (slots 0, 1, 4)
//     D-twist: 034 (slots 0, 3, 4)

// Optimal line function computation:
//
//   Standard Fp12 mult: 18 Fp mults (with Karatsuba)
//   Multiplied by fully random f: still 18 Fp mults
//
//   BUT multiplying by SPARSE line function:
//     Only ~9 Fp mults needed
//     (skip terms multiplied by zero)
//
//   This is the "sparse mult" optimization

// Embedding degree vs twist degree:
//
//   k = embedding degree
//   d = twist degree (2, 3, 4, or 6)
//   dim(G_2 over Fp) = k/d
//
//   BN254: k=12, d=6 → G_2 over Fp^2
//   BLS12-381: k=12, d=6 → G_2 over Fp^2
//   BLS24-315: k=24, d=6 → G_2 over Fp^4
//
//   Larger d → more sparse line functions
//   Sextic twist (d=6) is most efficient

// Other sparse optimizations:
//
//   Sparse*Sparse product:
//     When chaining two line functions
//     Even more zeros in result
//     "mul_034_by_034" function in some libs
//
//   Cyclotomic squaring:
//     Special squaring for GT subgroup
//     ~4x faster than generic Fp12 square
//     Used in final exponentiation

// Implementation references:
//
//   arkworks:
//     pairing/mnt4_298/sparse.rs
//     models/bn/pairing.rs
//
//   gnark:
//     std/algebra/emulated/sw_bn254/pairing2.go
//     sparse multiplication routines
//
//   blst:
//     asm-level sparse line mult
//     fastest production implementation`}
        </pre>
      </div>
    </section>
  );
}
