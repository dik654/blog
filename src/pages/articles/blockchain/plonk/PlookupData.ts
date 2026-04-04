export const MOTIVATION_CODE = `PLONK만으로 range check:
  비트 분해 (8개 boolean gate) + 결합 확인 → ~16개 제약

Plookup으로:
  테이블 T = {0, 1, ..., 255}, lookup "x ∈ T?" → 1개 제약

XOR 연산도 마찬가지:
  PLONK: 비트 분해 + 비트별 XOR + 결합 → ~32개 제약 (8비트)
  Plookup: XOR 테이블에서 한 번의 lookup → 1개 제약`;

export const SORTED_MERGE_CODE = `T = [0, 1, 2, 3],  f = [1, 2]
sorted(f ∪ T) = [0, 1, 1, 2, 2, 3]  ← T 순서 유지하며 f 삽입 가능

T = [0, 1, 2, 3],  f = [5]
5는 T에 없으므로 T 순서로 정렬 불가능!`;

export const PROTOCOL_CODE = `입력: t = (t₀,...,t_{d-1}) 테이블,  f = (f₀,...,f_{n-1}) 조회값
주장: f ⊆ t

1. 정렬된 병합: s = sort(f ∪ t)  (t의 순서 유지)
2. s를 중첩 분리: h₁ = s[..d],  h₂ = s[d-1..]
   (h₁의 마지막 = h₂의 첫 원소)
3. 검증자가 랜덤 β, γ 선택
4. Grand product Z(x) 계산`;

export const GRAND_PRODUCT_CODE = `Z(ω⁰) = 1

Z(ωⁱ⁺¹) = Z(ωⁱ) · (1+β)·(γ+fᵢ)·(γ(1+β)+tᵢ+β·tᵢ₊₁)
                   / ((γ(1+β)+h₁ᵢ+β·h₁ᵢ₊₁)(γ(1+β)+h₂ᵢ+β·h₂ᵢ₊₁))

최종: Z(ωⁿ⁻¹) · (마지막 항) = 1
→ 분자/분모 전체가 상쇄되면 f ⊆ t 증명 완료`;
