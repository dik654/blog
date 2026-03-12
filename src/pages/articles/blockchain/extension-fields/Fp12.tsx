export default function Fp12() {
  return (
    <section id="fp12" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fp12 완성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          페어링 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">e(G1, G2) → GT</code>의 결과는
          Fp12의 부분군에 산다. BN254의 embedding degree가 <strong>k=12</strong>인 이유는{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">r | (p¹²−1)</code>을 만족하는 최소 k가 12이기 때문이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 타워를 쌓는가?</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`직접 구성: Fp12 = Fp[x]/(x¹²−...)  → naive 144 Fp 곱셈
타워 구성: Fp → Fp2 → Fp6 → Fp12   → Karatsuba 적용

  Fp→Fp2:  4회 → 3회
  Fp2→Fp6: 9회 → 6회
  Fp6→Fp12: 4회 → 3회
  합계: 3 × 6 × 3 = 54 Fp 곱셈 (naive 대비 약 1/3)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">구조와 곱셈</h3>
        <p>
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">Fp12 = Fp6[w] / (w²−v)</code>이므로
          원소는 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">c₀ + c₁·w</code> (c₀, c₁ ∈ Fp6).
          곱셈은 Fp2와 동일한 Karatsuba 패턴이다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`pub fn mul(&self, rhs: &Fp12) -> Fp12 {
    let v0 = self.c0 * rhs.c0;  // Fp6 곱셈 ①
    let v1 = self.c1 * rhs.c1;  // Fp6 곱셈 ②
    let c1 = (self.c0 + self.c1) * (rhs.c0 + rhs.c1)
        - v0 - v1;              // Fp6 곱셈 ③
    let c0 = v0 + v1.mul_by_nonresidue(); // w²=v 처리
    Fp12 { c0, c1 }
}`}</code></pre>
        <p>
          Fp2에서는 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">u²=−1</code>로 부호 반전이었지만,
          Fp12에서는 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">w²=v</code>이므로{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">mul_by_nonresidue</code>로 처리한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Conjugate와 Inverse</h3>
        <p>
          <strong>Conjugate</strong>:{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">c₀+c₁w → c₀−c₁w</code>.
          Final exponentiation에서{' '}
          <code className="bg-accent px-1.5 py-0.5 rounded text-sm">f^(p⁶) = conj(f)</code>이므로
          easy part 계산에 직접 사용된다.
        </p>
        <p>
          <strong>Inverse</strong>: norm = c₀² − v·c₁² ∈ <strong>Fp6</strong>으로 내려간다.
          전체 inv 호출 체인은 Fp12 → Fp6 → Fp2 → Fp로, 최종적으로 Fermat 소정리 하나로 귀결된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">페어링과의 연결</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`e: G1 × G2 → GT ⊂ Fp12*

1. Miller loop  → Fp12 원소 f를 누적 (mul, square 반복)
2. Final exp    → f^((p¹²-1)/r) 계산 (inv, conjugate, frobenius)
3. 결과         → GT 원소

모든 확장체 연산이 페어링에서 사용된다:
  Fp12::mul, square      → Miller loop 누적
  Fp12::conjugate, inv   → final exp easy part
  Fp12::frobenius        → final exp hard part`}</code></pre>
      </div>
    </section>
  );
}
