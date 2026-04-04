export const WHY_POLY_CODE = `R1CS: m개 개별 등식 → O(m) 검증
  ⟨a₁,s⟩·⟨b₁,s⟩ = ⟨c₁,s⟩, ..., ⟨aₘ,s⟩·⟨bₘ,s⟩ = ⟨cₘ,s⟩

QAP: 하나의 다항식 항등식 → O(1) 검증
  a(x)·b(x) - c(x) = h(x)·t(x)`;

export const PIPELINE_CODE = `① 도메인 선택: D = {ω₁, ..., ωₘ}
② 열별 Lagrange 보간: aⱼ(ωᵢ) = A[i,j]
③ 소거 다항식: t(x) = ∏(x - ωᵢ)
④ Witness 결합: a(x) = Σⱼ sⱼ·aⱼ(x)
⑤ h(x) = (a(x)·b(x) - c(x)) / t(x)

핵심 동치:
  R1CS 만족 ⟺ t(x) | (a(x)·b(x) - c(x))
             ⟺ h(x)가 다항식 (나머지 없음)`;

export const LAGRANGE_CODE = `Lᵢ(x) = ∏_{j≠i} (x - xⱼ) / (xᵢ - xⱼ)
p(x) = Σᵢ yᵢ · Lᵢ(x)

예: 점 (1,3), (2,5) → p(x) = 2x + 1
  L₀(x) = -(x-2),  L₁(x) = x-1
  p(x) = 3·(-(x-2)) + 5·(x-1) = 2x + 1
  p(1)=3 ✓,  p(2)=5 ✓`;

export const SCHWARTZ_ZIPPEL_CODE = `Pr[p(τ) = 0] ≤ d / |F|

BN254: d ≈ 1,000,  |F| ≈ 2²⁵⁴
→ Pr ≤ 1000 / 2²⁵⁴ ≈ 10⁻⁷⁴ ≈ 0

결론: 랜덤 τ에서 a(τ)·b(τ) - c(τ) = h(τ)·t(τ)가 성립하면
      모든 x에서 성립한다고 2²⁵⁴ 대 1의 확률로 확신 가능`;

export const VANISHING_CODE = `t(x) = (x - ω₁)(x - ω₂)···(x - ωₘ)

교육용: t(x) = (x-1)(x-2)(x-3) = x³ - 6x² + 11x - 6
프로덕션: roots of unity → t(x) = xᵐ - 1
  → O(1) 저장, O(log m) 평가

역할: p(x)가 모든 ωᵢ에서 0 ⟺ t(x) | p(x)`;
