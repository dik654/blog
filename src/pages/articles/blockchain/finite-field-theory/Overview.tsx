import WhyAlgebraViz from './viz/WhyAlgebraViz';
import GroupRingFieldViz from './viz/GroupRingFieldViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">군 . 환 . 체 정의</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          ZKP의 모든 연산은 유한체(finite field) 위에서 수행된다.
          <br />
          왜 대수 구조가 필요하고, 군-환-체가 무엇인지.
        </p>
      </div>
      <div className="not-prose mb-8"><WhyAlgebraViz /></div>
      <div className="not-prose"><GroupRingFieldViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">대수 구조 계층</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Algebraic Structures Hierarchy
//
// Magma ⊃ Semigroup ⊃ Monoid ⊃ Group ⊃ Abelian Group
//
// Semigroup: + associativity
// Monoid:    + identity
// Group:     + inverse
// Abelian:   + commutativity

// Groups (G, *)
//   (a * b) * c = a * (b * c)  (associative)
//   e * a = a * e = a           (identity)
//   a * a⁻¹ = e                  (inverse)
//
// Examples:
//   (Z, +), (Q*, ×)
//   (Z_n, +) for mod n
//   Elliptic curve points

// Rings (R, +, ×)
//   (R, +) is abelian group
//   (R, ×) is semigroup (associative)
//   Distributive law: a(b+c) = ab + ac
//
// Examples:
//   (Z, +, ×)
//   (Z_n, +, ×) - modular arithmetic
//   Polynomial rings

// Fields (F, +, ×)
//   Ring + (F\\{0}, ×) is abelian group
//   모든 non-zero element가 inverse 가짐
//
// Examples:
//   Q, R, C
//   F_p = Z_p (p prime)
//   GF(p^n) - finite fields

// Finite Fields (중요!):
//   - 유한 개 element
//   - 암호학의 기반
//   - 모든 p^n (p prime, n≥1)에 대해 유일 존재
//
// 주요 체:
//   F_p (prime field): {0, 1, ..., p-1}
//   F_{2^n} (binary extension): AES 사용
//   F_{p^n}: pairing 기반 암호학

// ZKP에서의 활용:
//   - Field operations: +, -, ×, ÷
//   - Polynomial arithmetic
//   - Elliptic curves over F_p
//   - Pairings (extension fields)
//
// 주요 ZK field primes:
//   BN254:    Fr ~ 2^254 (older)
//   BLS12-381: Fr ~ 2^255 (current)
//   Pasta (Halo2): Fp, Fq
//   Goldilocks (Plonky2): p = 2^64 - 2^32 + 1`}
        </pre>
      </div>
    </section>
  );
}
