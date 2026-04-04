export default function NumericalExample() {
  return (
    <section id="numerical" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">계산 방법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          x ≡ a₁ (mod m₁), x ≡ a₂ (mod m₂)일 때,
          M = m₁·m₂로 놓고 각 모듈러의 "부분 역원"을 구한다.
        </p>
        <p>
          <strong>단계:</strong>
          <br />
          ① M₁ = M/m₁ = m₂, M₂ = M/m₂ = m₁
          <br />
          ② M₁의 mod m₁ 역원 y₁ 구하기: M₁·y₁ ≡ 1 (mod m₁)
          <br />
          ③ M₂의 mod m₂ 역원 y₂ 구하기: M₂·y₂ ≡ 1 (mod m₂)
          <br />
          ④ x = a₁·M₁·y₁ + a₂·M₂·y₂ (mod M)
        </p>
        <p>
          <strong>예시:</strong> x ≡ 2 (mod 3), x ≡ 3 (mod 5)
          <br />
          M = 15, M₁ = 5, M₂ = 3
          <br />
          y₁: 5·y₁ ≡ 1 (mod 3) → 5·2=10≡1 → y₁ = 2
          <br />
          y₂: 3·y₂ ≡ 1 (mod 5) → 3·2=6≡1 → y₂ = 2
          <br />
          x = 2·5·2 + 3·3·2 = 20 + 18 = 38 mod 15 = <strong>8</strong> ✓
        </p>
      </div>
    </section>
  );
}
