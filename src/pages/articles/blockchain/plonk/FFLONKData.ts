export const COMPARISON_CODE = `PLONK Round 5:
  W_ζ(x):  6개 다항식을 ζ에서 open  → 1개 proof
  W_ζω(x): 1개 다항식을 ζω에서 open → 1개 proof
  → 2개의 opening proof + custom pairing 등식

FFLONK Round 5:
  7개를 1개 combined polynomial로 합침
  → kzg::batch_open 1번 → 1개의 opening proof
  → kzg::batch_verify 1번 → 검증 완료`;

export const HOMOMORPHISM_CODE = `commit(f) = [f(τ)]₁ = Σᵢ fᵢ · [τⁱ]₁

commit(f + ν·g + ν²·h) = commit(f) + ν·commit(g) + ν²·commit(h)

→ Verifier는 개별 commitment [f]₁, [g]₁, [h]₁로부터
  combined commitment를 스칼라 곱 + 덧셈만으로 재구성
→ combined polynomial을 Prover에게서 받을 필요 없음

제약: 곱에 대해서는 동형이 아님!
  G1 × G1 → G1 연산은 없음 (G1은 덧셈군)`;

export const COMBINED_CODE = `ζ에서 열리는 6개:  r, a, b, c, σ_A, σ_B
ζω에서 열리는 1개: Z

ν ← Fiat-Shamir challenge

combined(x) = r(x) + ν·a(x) + ν²·b(x) + ν³·c(x)
            + ν⁴·σ_A(x) + ν⁵·σ_B(x) + ν⁶·Z(x)

evaluation points:
  combined(ζ)  에서의 값 = r̄ + ν·ā + ν²·b̄ + ...
  combined(ζω) 에서의 값 = ... + ν⁶·z̄_ω

→ kzg::batch_open({ζ, ζω})로 한 번에 증명`;
