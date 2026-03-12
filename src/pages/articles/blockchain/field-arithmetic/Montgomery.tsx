export default function Montgomery() {
  return (
    <section id="montgomery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Montgomery 곱셈</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 Montgomery인가?</h3>
        <p>일반 모듈러 곱셈은 512-bit 나눗셈이 필요하다. ZK 증명에서 수백만 번 반복되는 연산에서 이는 병목이 된다. Peter Montgomery(1985)의 아이디어: 숫자를 a 대신 a·R mod p로 저장하면 나눗셈 대신 비트 시프트로 곱셈할 수 있다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">기호 정의</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>p</strong>: 소수 (modulus)</li>
          <li><strong>R</strong> = 2²⁵⁶ (Montgomery 상수)</li>
          <li><strong>a_mont</strong> = a · R mod p (Montgomery 형식)</li>
          <li><strong>p&apos;</strong> = -p⁻¹ mod R (미리 계산된 상수)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">REDC 알고리즘</h3>
        <p>목표: T · R⁻¹ mod p를 나눗셈 없이 계산한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Step 1: m = (T · p') mod R     ← 256비트 마스킹 (거의 공짜)
Step 2: t = (T + m · p) / R    ← 256비트 시프트 (거의 공짜)
Step 3: if t >= p: return t-p  ← 조건부 뺄셈 1회`}</code></pre>

        <p><strong>핵심</strong>: T + m·p가 R의 배수가 되도록 m을 선택하므로, /R은 정확히 나누어떨어진다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`증명: m ≡ -T · p⁻¹ (mod R)
      m · p ≡ -T (mod R)
      T + m·p ≡ 0 (mod R)  ✓

결과: t·R = T + m·p
      t·R ≡ T (mod p)   (∵ m·p ≡ 0 mod p)
      t ≡ T · R⁻¹ (mod p)  ✓`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Montgomery 곱셈 전체 흐름</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`입력: a_mont = a·R, b_mont = b·R
T = a_mont × b_mont = a·b·R²
REDC(T) = a·b·R²·R⁻¹ = a·b·R = (a·b)_mont  ✓`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Limb별 Reduction (INV가 64비트인 이유)</h3>
        <p>256비트 전체를 한번에 처리하는 대신, 하위 64비트를 0으로 만드는 과정을 4번 반복한다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`Round 1: m₀ = T[0] * INV mod 2^64 → T[0]을 0으로
Round 2: m₁ = T[0] * INV mod 2^64 → 새 최하위를 0으로
Round 3, 4: 동일
→ 하위 256비트 전부 0 → >> 256 시프트로 결과 추출`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">INV 계산 (Newton&apos;s method)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`const INV: u64 = {
    let p0 = MODULUS[0];
    let mut inv = 1u64;
    // 매 반복마다 정밀도 2배: 1→2→4→8→16→32→64비트
    inv = inv.wrapping_mul(2u64.wrapping_sub(p0.wrapping_mul(inv)));
    // ... 6번 반복
    inv.wrapping_neg()  // -p0⁻¹ mod 2^64
};`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">필요한 상수 3개</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>R mod p</strong>: 1의 Montgomery form (<code className="bg-accent px-1.5 py-0.5 rounded text-sm">Fp::ONE</code>)</li>
          <li><strong>R² mod p</strong>: normal → Montgomery 변환에 사용. <code className="bg-accent px-1.5 py-0.5 rounded text-sm">from_raw(a) = mont_mul(a, R²) = a·R</code></li>
          <li><strong>INV</strong>: REDC에서 하위 limb 소거에 사용</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">square, pow, inv</h3>
        <p>모두 mont_mul의 조합이다.</p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm"><code>{`square(a) = mont_mul(a, a)
pow(a, exp) = square-and-multiply (254비트 지수 → 최대 508번 mont_mul)
inv(a) = pow(a, p-2)  // Fermat의 소정리: a^(p-2) ≡ a⁻¹ (mod p)`}</code></pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">비용 비교</h3>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="border-b"><th className="text-left p-2">연산</th><th className="text-left p-2">일반</th><th className="text-left p-2">Montgomery</th></tr></thead>
          <tbody>
            <tr className="border-b"><td className="p-2">변환 비용</td><td className="p-2">없음</td><td className="p-2">from_raw / to_repr 각 1번</td></tr>
            <tr className="border-b"><td className="p-2">덧셈</td><td className="p-2">mod p</td><td className="p-2">동일 (그대로)</td></tr>
            <tr className="border-b"><td className="p-2">곱셈</td><td className="p-2">나눗셈 필요</td><td className="p-2">REDC (시프트 + 덧셈)</td></tr>
            <tr><td className="p-2">적합한 경우</td><td className="p-2">곱셈 1~2번</td><td className="p-2">곱셈 수백만 번 (ZK 증명)</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
