export const SELECTOR_POLY_CODE = `선택자 다항식 (Selector Polynomials):
  q_M(X), q_L(X), q_R(X), q_O(X), q_C(X)
  → 각 게이트 i에서의 값을 Lagrange 보간
  → q_M(ωⁱ) = i번째 게이트의 곱셈 계수

  wire 다항식: a(X), b(X), c(X)
  → a(ωⁱ) = i번째 게이트의 left wire 값`;

export const GATE_CONSTRAINT_CODE = `게이트 제약 (Gate Identity):
  q_M(X)·a(X)·b(X) + q_L(X)·a(X) + q_R(X)·b(X)
  + q_O(X)·c(X) + q_C(X) = 0  (mod Zₕ(X))

  Zₕ(X) = Xⁿ - 1  (vanishing polynomial)
  → 모든 ωⁱ에서 등식이 성립해야 함`;

export const COPY_CONSTRAINT_CODE = `Copy Constraints — Permutation Argument:
  σ = (σ_a, σ_b, σ_c) — 와이어 위치 순열

  순열 다항식:
  σ_a(ωⁱ) = j번째 와이어의 위치 (a→b→c 간 연결)

검증:
  Z(X) accumulator로 순열 관계 증명
  Z(ω⁰) = 1
  Z(ωⁿ) = 1  (전체 곱이 상쇄)`;

export const VERIFICATION_CODE = `제약 검증 과정:
  ① 게이트 제약: 각 행에서 산술 등식 성립 확인
  ② Copy 제약: 서로 다른 위치의 값이 동일한지 확인
  ③ Public input: 공개 입력이 올바른 위치에 배치 확인
  ④ Vanishing: 모든 제약이 Zₕ(X)로 나누어떨어지는지 확인`;
