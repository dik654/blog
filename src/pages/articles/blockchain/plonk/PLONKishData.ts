export const GATE_CODE = `q_L·a + q_R·b + q_O·c + q_M·a·b + q_C = 0

a, b, c  — 3개의 wire 값 (left, right, output)
q_L      — left wire 선형 계수
q_R      — right wire 선형 계수
q_O      — output wire 선형 계수
q_M      — 곱셈 항 계수
q_C      — 상수 항`;

export const COPY_CODE = `예시: x * y = z,  z + w = out

Gate 0: a₀=x, b₀=y, c₀=z    (곱셈)
Gate 1: a₁=z, b₁=w, c₁=out  (덧셈)

Copy constraint: c₀ = a₁  (같은 값 z)
→ permutation σ: position(c₀) ↔ position(a₁)`;

export const GRAND_PRODUCT_CODE = `검증자가 랜덤 β, γ를 선택

Grand product Z(x):
  Z(ω⁰) = 1
  Z(ωⁱ⁺¹) = Z(ωⁱ) · ∏ⱼ (wⱼ(ωⁱ) + β·ωⁱ·kⱼ + γ)
                        / (wⱼ(ωⁱ) + β·σⱼ(ωⁱ) + γ)

최종 확인: Z(ωⁿ⁻¹) · (마지막 항) = 1
→ 분자·분모 전체가 telescoping으로 상쇄
→ permutation이 올바르면 곱이 1`;
