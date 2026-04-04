export const redcCode = `Step 1: m = (T · p') mod R     ← 256비트 마스킹 (거의 공짜)
Step 2: t = (T + m · p) / R    ← 256비트 시프트 (거의 공짜)
Step 3: if t >= p: return t-p  ← 조건부 뺄셈 1회`;

export const redcProofCode = `증명: m ≡ -T · p⁻¹ (mod R)
      m · p ≡ -T (mod R)
      T + m·p ≡ 0 (mod R)  ✓

결과: t·R = T + m·p
      t·R ≡ T (mod p)   (∵ m·p ≡ 0 mod p)
      t ≡ T · R⁻¹ (mod p)  ✓`;

export const flowCode = `입력: a_mont = a·R, b_mont = b·R
T = a_mont × b_mont = a·b·R²
REDC(T) = a·b·R²·R⁻¹ = a·b·R = (a·b)_mont  ✓`;

export const limbCode = `Round 1: m₀ = T[0] * INV mod 2^64 → T[0]을 0으로
Round 2: m₁ = T[0] * INV mod 2^64 → 새 최하위를 0으로
Round 3, 4: 동일
→ 하위 256비트 전부 0 → >> 256 시프트로 결과 추출`;

export const invCode = `const INV: u64 = {
    let p0 = MODULUS[0];
    let mut inv = 1u64;
    // 매 반복마다 정밀도 2배: 1→2→4→8→16→32→64비트
    inv = inv.wrapping_mul(2u64.wrapping_sub(p0.wrapping_mul(inv)));
    // ... 6번 반복
    inv.wrapping_neg()  // -p0⁻¹ mod 2^64
};`;

export const opsCode = `square(a) = mont_mul(a, a)
pow(a, exp) = square-and-multiply (254비트 지수 → 최대 508번 mont_mul)
inv(a) = pow(a, p-2)  // Fermat의 소정리: a^(p-2) ≡ a⁻¹ (mod p)`;
