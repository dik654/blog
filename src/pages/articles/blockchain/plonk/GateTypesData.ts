export const ARITH_CODE = `산술 게이트 (Arithmetic Gate):
  q_m·a·b + q_l·a + q_r·b + q_o·c + q_4·d + q_c = 0
  → 덧셈, 곱셈, 혼합 연산 모두 표현`;

export const RANGE_CODE = `범위 게이트 (Range Gate):
  값 v를 4비트 쿼드(quads)로 분해
  각 쿼드: 0 ≤ qᵢ ≤ 3 검증
  재결합: v = Σ qᵢ · 4ⁱ  확인

  8비트 range → 2개 범위 게이트
  32비트 range → 8개 범위 게이트`;

export const LOGIC_CODE = `논리 게이트 (Logic Gate):
  AND: a ∧ b — 비트별 논리곱
  XOR: a ⊕ b — 비트별 배타적 논리합

  4비트 단위로 처리:
  각 쿼드에서 비트 분해 → 논리 연산 → 재결합`;

export const ECC_CODE = `고정 기반 그룹 덧셈 (Fixed-base Scalar Mul):
  사전 계산된 테이블 T[i] = i · G
  스칼라를 4비트씩 분해 → T[qᵢ] 룩업

가변 기반 그룹 덧셈 (Variable-base):
  완전 덧셈 공식 (complete addition formula)
  P + Q = R : 제약 4개로 표현`;

export const LOOKUP_CODE = `룩업 게이트 (Lookup Gate):
  PlonkUp: PLONK + Plookup 통합
  q_lookup = 1인 행에서 (a, b, c) ∈ Table 검증
  → range check, XOR 등에 활용`;
