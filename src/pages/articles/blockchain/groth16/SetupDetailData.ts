export const SYNTHESIS_CODE = `① SynthesisMode::Setup
   cs.alloc() → 변수 개수만 카운트 (값 미할당)
   enforce_constraint() → R1CS 매트릭스 A, B, C 수집

② R1CS → QAP (IFFT)
   aⱼ(x), bⱼ(x), cⱼ(x) ← Lagrange 보간
   각 변수 j에 대한 다항식 3개 생성`;

export const KEY_CALC_CODE = `③ 키 구성 요소 계산 (MSM 배치)
   a_query[j]    = [aⱼ(τ)]₁           — A 계산용
   b_g1_query[j] = [bⱼ(τ)]₁           — C 계산용
   b_g2_query[j] = [bⱼ(τ)]₂           — B 계산용
   h_query[i]    = [τⁱ · t(τ) / δ]₁   — h(x) 증명용
   l_query[j']   = [lcⱼ / δ]₁         — private LC용

④ 배치 MSM: window_size = ln(n) + 2
   Pippenger 알고리즘으로 수천 개 스칼라곱 병렬 처리`;

export const MPC_CODE = `⑤ MPC 세레모니 (Powers of Tau)
  Phase 1: τ 의 거듭제곱 생성 (범용)
    각 참여자 i가 sᵢ 생성 → τ = Π sᵢ

  Phase 2: 회로별 파라미터 (α,β,γ,δ)
    각 참여자가 자기 비밀 기여 후 삭제

  1-of-N 신뢰: N명 중 1명만 정직해도 안전`;
