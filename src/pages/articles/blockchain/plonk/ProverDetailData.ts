export const ROUND1_CODE = `Round 1 — 와이어 커밋먼트:
  b₁,…,b₉ ← 랜덤 블라인딩 스칼라
  a(X) = (b₁X + b₂)·Zₕ(X) + Σᵢ aᵢ·Lᵢ(X)
  b(X) = (b₃X + b₄)·Zₕ(X) + Σᵢ bᵢ·Lᵢ(X)
  c(X) = (b₅X + b₆)·Zₕ(X) + Σᵢ cᵢ·Lᵢ(X)
  → [a]₁, [b]₁, [c]₁ 전송 (KZG commit)`;

export const ROUND2_CODE = `Round 2 — 순열 누적자:
  β, γ ← transcript.squeeze()
  Z(ω⁰) = 1
  Z(ωⁱ⁺¹) = Z(ωⁱ) · ∏ⱼ (wⱼ(ωⁱ)+β·ωⁱ·kⱼ+γ)
                       / (wⱼ(ωⁱ)+β·σⱼ(ωⁱ)+γ)
  Z(X)에 블라인딩 추가 → [Z]₁ 전송`;

export const ROUND3_CODE = `Round 3 — 몫 다항식:
  α ← transcript.squeeze()
  t(X) = [gate(X) + α·perm₁(X) + α²·perm₂(X)] / Zₕ(X)

  deg(t) ≈ 3n → 3등분:
  t(X) = t_lo(X) + Xⁿ·t_mid(X) + X²ⁿ·t_hi(X)
  → [t_lo]₁, [t_mid]₁, [t_hi]₁ 전송`;

export const ROUND4_CODE = `Round 4 — 평가:
  ζ ← transcript.squeeze()
  ā = a(ζ),  b̄ = b(ζ),  c̄ = c(ζ)
  σ̄_a = σ_a(ζ),  σ̄_b = σ_b(ζ)
  z̄_ω = Z(ζ·ω)
  → 6개 스칼라 전송`;

export const ROUND5_CODE = `Round 5 — 오프닝 증명:
  ν ← transcript.squeeze()
  r(X) = 선형화 다항식 (ā,b̄ 등으로 부분 평가)
  W_ζ(X)  = [r + ν(a-ā) + ν²(b-b̄) + ...] / (X-ζ)
  W_ζω(X) = [Z(X) - z̄_ω] / (X-ζω)
  → [W_ζ]₁, [W_ζω]₁ 전송`;
