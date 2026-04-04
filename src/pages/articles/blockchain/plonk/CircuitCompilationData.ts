export const CIRCUIT_CODE = `회로 구성 (Circuit Construction):
  composer = StandardComposer::new()
  x = composer.alloc(secret_value)
  y = composer.alloc(other_value)
  composer.arithmetic_gate(x, y, ...)
  composer.range_gate(x, 8)
  → 게이트 목록 + 와이어 배치 완성`;

export const PREPROCESS_CODE = `전처리 (Preprocessing):
  ① 선택자 다항식: q_M(X), q_L(X), ...
     → 게이트별 selector를 Lagrange 보간
  ② 순열 다항식: σ_a(X), σ_b(X), σ_c(X)
     → copy constraint 위치 매핑
  ③ KZG commit: [q_M]₁, [q_L]₁, ..., [σ_a]₁, ...
     → 검증 키에 포함`;

export const SRS_GEN_CODE = `SRS 생성 (Structured Reference String):
  MPC 세레모니로 τ 생성
  SRS = { [τ⁰]₁, [τ¹]₁, ..., [τᵈ]₁, [τ]₂ }
  d ≥ max_gates + 6  (블라인딩 여유)
  τ 자체는 폐기 (toxic waste)`;

export const KEYGEN_CODE = `키 생성 (Key Generation):
  Prover Key (pk):
    → SRS + 선택자 다항식 + 순열 다항식
    → 도메인 정보 (ω, n)

  Verifier Key (vk):
    → 선택자 commitments [q_M]₁, [q_L]₁, ...
    → 순열 commitments [σ_a]₁, [σ_b]₁, [σ_c]₁
    → [τ]₂ (SRS에서)
    → 도메인 크기 n, 생성자 ω`;
