import ExtFieldViz from './viz/ExtFieldViz';

export default function ExtensionField() {
  return (
    <section id="extension-field" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">확장체 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          기존 체에 기약 다항식의 근을 추가하여 더 큰 체 구성 — BN254 페어링에서 필수.
        </p>
      </div>
      <div className="not-prose"><ExtFieldViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">확장체 구성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Extension Field Construction
//
// 정의:
//   K ⊂ L (체 K에서 체 L로 확장)
//   L은 K의 확장체 (extension field)
//   [L:K] = extension degree
//
// 구성 방법:
//   기약 다항식 f(x) ∈ K[x] 선택
//   L = K[x] / f(x)  (quotient ring)
//
// Example: F_p → F_{p²}
//   f(x) = x² + 1 (p=3에서 기약)
//   F_9 = F_3[x] / (x² + 1)
//   원소: a + b·i  (where i² = -1)
//
//   연산:
//     (a + bi) + (c + di) = (a+c) + (b+d)i
//     (a + bi) × (c + di) = (ac - bd) + (ad + bc)i

// Pairing-friendly curves에서:
//
// BN254 (Barreto-Naehrig):
//   Base field: F_p, p ~ 2^254
//   Tower of extensions:
//     F_p ⊂ F_p² ⊂ F_p⁶ ⊂ F_p^12
//
//   G1: E(F_p) (256 bits per point)
//   G2: E(F_p²) (512 bits per point)
//   GT: μ_r ⊂ F_p^12 (3072 bits)
//
//   Pairing: e: G1 × G2 → GT

// BLS12-381:
//   더 안전, 더 효율적
//   Curve: E: y² = x³ + 4
//   Embedding degree: 12
//   F_p^12 = F_p² · F_p^6

// Frobenius Endomorphism:
//   φ: L → L, φ(x) = x^p
//   F_{p^n}의 K-automorphism
//   ↑
//   확장체 산술의 핵심

// 구현 최적화:
//   - Tower extension: F_p ⊂ F_p² ⊂ F_p⁶ ⊂ F_p^12
//   - Sparse multiplication
//   - Efficient Frobenius
//   - Windowing for exponentiation

// 사용 라이브러리:
//   - arkworks-rs (Rust)
//   - blst (C/Rust, BLS)
//   - py_ecc (Python, Ethereum)
//   - Mcl (C++, pairing)
//   - constantine (Nim)`}
        </pre>
      </div>
    </section>
  );
}
