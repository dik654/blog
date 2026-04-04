export const VERIFY_ALGO_CODE = `입력: VK, public_inputs = [s₁, ..., sₗ], Proof = (A, B, C)

① IC_sum 계산:
   IC_sum = ic[0] + Σⱼ₌₁ˡ sⱼ · ic[j]

② 검증 방정식:
   e(A, B) ?= e(α,β) · e(IC_sum, [γ]₂) · e(C, [δ]₂)
   ═══════    ══════   ════════════════   ═══════════
     LHS      상수      공개 입력 검증     나머지 전부`;

export const VERIFY_DERIVE_CODE = `A·B = (α + a(τ) + rδ)(β + b(τ) + sδ) 를 전개하면:

  αβ                              → e(α, β)
  + α·b(τ) + β·a(τ) + c(τ)       → IC_sum·γ + C의 일부·δ
  + h(τ)·t(τ)                    → C의 일부·δ
  + sα + s·a(τ) + rβ + r·b(τ) + rsδ → C의 블라인딩·δ

γ로 나눈 값은 [γ]₂와 페어링하면 γ 소거
δ로 나눈 값은 [δ]₂와 페어링하면 δ 소거

∴ e(A, B) = e(α,β) · e(IC_sum, [γ]₂) · e(C, [δ]₂)`;

export const SUMMARY_CODE = `증명 크기     : G1×2 + G2×1 = 256 bytes
검증 시간     : O(1) — 페어링 3회
증명 생성     : O(n) — MSM 크기
Trusted Setup : 필요 (회로별 1회)
영지식성       : 완전 (perfect ZK)
건전성        : 계산적 (computational)`;
