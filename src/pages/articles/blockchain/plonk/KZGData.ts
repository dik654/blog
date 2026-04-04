export const FACTOR_CODE = `f(z) = y  ⟺  (x - z) | (f(x) - y)

즉, f(x) - y = q(x) · (x - z) 인 다항식 q(x)가 존재

증명자: "f(z) = y"를 주장
→ q(x) = (f(x) - y) / (x - z) 를 계산해서 제출
검증자: 타원곡선 위에서 pairing으로 확인
  e([q]₁, [τ - z]₂) = e([f - y]₁, G₂)`;

export const SRS_CODE = `SRS = { [τ⁰]₁, [τ¹]₁, ..., [τᵈ]₁, [τ]₂ }

여기서 [x]₁ = x · G₁,  [x]₂ = x · G₂
τ 자체는 MPC 세레모니 후 폐기 (toxic waste)`;

export const COMMIT_OPEN_CODE = `Commit(f):
  C = Σᵢ fᵢ · [τⁱ]₁ = [f(τ)]₁    ← MSM 연산

Open(f, z):
  y = f(z)
  q(x) = (f(x) - y) / (x - z)    ← 다항식 나눗셈
  π = [q(τ)]₁                     ← 증거 (G1 점 1개)

Verify(C, z, y, π):
  e(π, [τ - z]₂) == e(C - [y]₁, G₂)
  = e([q(τ)]₁, [τ - z]₂) == e([f(τ) - y]₁, G₂)
  양변 = [q(τ)(τ - z)]_T == [(f(τ) - y)]_T  ✓`;

export const BATCH_CODE = `combined(x) = f₀(x) + ν·f₁(x) + ν²·f₂(x) + ...
combined_y   = y₀ + ν·y₁ + ν²·y₂ + ...

하나의 quotient로 증명:
  q(x) = (combined(x) - combined_y) / (x - z)

검증: commitment도 선형 결합
  C_combined = C₀ + ν·C₁ + ν²·C₂ + ...
  → 단일 pairing check로 완료`;
