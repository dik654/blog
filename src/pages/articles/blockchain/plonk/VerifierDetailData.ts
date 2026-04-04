export const FIAT_SHAMIR_CODE = `Fiat-Shamir 재생 (비대화형 변환):
  transcript.append([a]₁, [b]₁, [c]₁)
  β, γ = transcript.squeeze()
  transcript.append([Z]₁)
  α = transcript.squeeze()
  transcript.append([t_lo]₁, [t_mid]₁, [t_hi]₁)
  ζ = transcript.squeeze()
  transcript.append(ā, b̄, c̄, σ̄_a, σ̄_b, z̄_ω)
  ν = transcript.squeeze()`;

export const LINEARIZE_CODE = `선형화 커밋먼트 [F]₁:
  r̄ = ā·b̄·ν_qm + ā·ν_ql + b̄·ν_qr + c̄·ν_qo + ν_qc
    + α·[z̄_ω·(ā+β·σ̄_a+γ)(b̄+β·σ̄_b+γ)·β·ν_z]
    + α²·L₁(ζ)·ν_z

  [F]₁ = ν·[a]₁ + ν²·[b]₁ + ν³·[c]₁
       + ν⁴·[σ_a]₁ + ν⁵·[σ_b]₁
       + [linearized terms]₁`;

export const BATCH_VERIFY_CODE = `배치 KZG 검증:
  u ← transcript.squeeze()
  [E]₁ = r̄ + ν·ā + ν²·b̄ + ν³·c̄
       + ν⁴·σ̄_a + ν⁵·σ̄_b + u·z̄_ω  (스칼라 → G1)

  Pairing check:
  e([W_ζ]₁ + u·[W_ζω]₁,  [τ]₂)
  = e(ζ·[W_ζ]₁ + uζω·[W_ζω]₁ + [F]₁ - [E]₁,  G₂)

  → 페어링 2회로 모든 제약 동시 검증`;
