export const WITNESS_CODE = `① SynthesisMode::Prove
   cs.alloc() → 실제 값 할당 (witness 계산)
   enforce_constraint() → 스킵 (Setup에서 이미 수집)
   결과: w = [1, s₁..sₗ, w₁..wₘ] (One + public + private)`;

export const A_DETAIL_CODE = `② A 계산 (G1 점)
   A = [α]₁ + Σⱼ wⱼ · a_query[j] + r · [δ]₁
       ─────  ──────────────────   ─────────
       태그     MSM (O(n))          블라인딩

   MSM: Pippenger 윈도우 방식 + 멀티스레드
   → rayon::scope로 각 윈도우 병렬 처리`;

export const B_DETAIL_CODE = `③ B 계산 (G2 + G1 이중)
   B_g2 = [β]₂ + Σⱼ wⱼ · b_g2_query[j] + s · [δ]₂
   B_g1 = [β]₁ + Σⱼ wⱼ · b_g1_query[j] + s · [δ]₁

   B_g2: 검증 페어링 e(A,B)에 사용
   B_g1: C 계산의 r·B' 항에 사용
   → 두 MSM을 rayon::join으로 동시 실행`;

export const C_DETAIL_CODE = `④ C 계산 (G1 점)
   C = Σ_{j∈priv} wⱼ · l_query[j']    ← private LC
     + Σᵢ hᵢ · h_query[i]              ← QAP 만족 증거
     + s · A + r · B_g1 - rs · [δ]₁    ← 블라인딩

   3개의 MSM을 순서대로:
     ① l_query MSM  (private 변수 수)
     ② h_query MSM  (회로 차수 d)
     ③ 블라인딩 항 조합 (상수 시간)`;
