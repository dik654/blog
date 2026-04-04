import type { CodeRef } from '@/components/code/types';

export const setupCodeRefs: Record<string, CodeRef> = {
  'groth16-setup': {
    path: 'groth16.rs — setup()',
    lang: 'rust',
    highlight: [1, 36],
    desc: 'Trusted Setup — QAP를 커브 포인트로 인코딩.\ntoxic waste (τ,α,β,γ,δ) 생성 후 다항식 평가.\n함수 종료 시 Rust 소유권으로 스택에서 소멸.',
    code: `pub fn setup<R: Rng>(
    qap: &QAP, rng: &mut R
) -> (ProvingKey, VerifyingKey) {
    let n = qap.num_variables;
    let m = qap.domain.len(); // 제약 수

    // 1. Toxic waste — 0이 아닌 랜덤 Fr
    let tau = random_nonzero_fr(rng);   // 비밀 평가점
    let alpha = random_nonzero_fr(rng); // 지식 계수
    let beta = random_nonzero_fr(rng);  // 교차항 계수
    let gamma = random_nonzero_fr(rng); // public 구분
    let delta = random_nonzero_fr(rng); // private 구분

    let gamma_inv = gamma.inv().unwrap();
    let delta_inv = delta.inv().unwrap();

    // 2. 기본 커브 포인트
    let alpha_g1 = g1.scalar_mul(&alpha.to_repr());
    let beta_g2 = g2.scalar_mul(&beta.to_repr());
    let delta_g1 = g1.scalar_mul(&delta.to_repr());
    let delta_g2 = g2.scalar_mul(&delta.to_repr());
    let gamma_g2 = g2.scalar_mul(&gamma.to_repr());

    // 3. 다항식을 τ에서 평가
    for j in 0..n {
        a_at_tau.push(qap.a_polys[j].eval(tau));
        b_at_tau.push(qap.b_polys[j].eval(tau));
        c_at_tau.push(qap.c_polys[j].eval(tau));
    }

    // 4. Query 벡터 → 커브 포인트로 인코딩
    let a_query: Vec<G1> = a_at_tau.iter()
        .map(|&a| g1.scalar_mul(&a.to_repr()))
        .collect();
    ...
}`,
    annotations: [
      { lines: [7, 12], color: 'sky', note: 'toxic waste 5개 — 이 값을 알면 가짜 증명 가능. 반드시 삭제' },
      { lines: [24, 29], color: 'emerald', note: '각 변수 j의 다항식을 비밀 τ에서 평가 — 커브 점으로 인코딩' },
      { lines: [31, 35], color: 'amber', note: 'Query = [aⱼ(τ)]₁ — τ 자체는 노출 안 됨 (ECDLP)' },
    ],
  },
  'groth16-pk': {
    path: 'groth16.rs — ProvingKey struct',
    lang: 'rust',
    highlight: [1, 22],
    desc: '증명 키 — toxic waste가 커브 포인트로 인코딩.\nECDLP 어려움으로 τ 자체는 복원 불가.',
    code: `pub struct ProvingKey {
    alpha_g1: G1,       // [α]₁
    beta_g1: G1,        // [β]₁ — C 계산 시 B_g1에 필요
    beta_g2: G2,        // [β]₂ — B 계산에 필요
    delta_g1: G1,       // [δ]₁ — 블라인딩
    delta_g2: G2,       // [δ]₂ — 블라인딩

    // QAP 다항식 평가를 커브 포인트로
    a_query: Vec<G1>,   // [aⱼ(τ)]₁ — A 계산용
    b_g1_query: Vec<G1>,// [bⱼ(τ)]₁ — C 내 B'
    b_g2_query: Vec<G2>,// [bⱼ(τ)]₂ — B 계산용

    // private 변수: (β·aⱼ+α·bⱼ+cⱼ)/δ
    l_query: Vec<G1>,   // [(β·aⱼ(τ)+α·bⱼ(τ)+cⱼ(τ))/δ]₁

    // h(x) 계수용: [τⁱ·t(τ)/δ]₁
    h_query: Vec<G1>,

    num_instance: usize,
    num_variables: usize,
}`,
    annotations: [
      { lines: [2, 6], color: 'sky', note: '기본 커브 포인트 — α,β,δ를 G1/G2에 스칼라 곱으로 인코딩' },
      { lines: [9, 11], color: 'emerald', note: 'Query — aⱼ(τ), bⱼ(τ)를 커브 점으로. τ 자체는 숨겨짐' },
      { lines: [13, 17], color: 'amber', note: 'l_query: private용 /δ, h_query: h(x) 계수 결합용' },
    ],
  },
  'groth16-vk': {
    path: 'groth16.rs — VerifyingKey struct',
    lang: 'rust',
    highlight: [1, 12],
    desc: '검증 키 — 검증에 필요한 최소 정보만 포함.\ne(α,β) 사전 계산으로 검증 시 페어링 1개 절약.',
    code: `pub struct VerifyingKey {
    // e(α, β) — 사전 계산. 매 검증마다 재계산 불필요
    alpha_beta_gt: Fp12,

    gamma_g2: G2, // [γ]₂ — 공개 변수 분리자
    delta_g2: G2, // [δ]₂ — 비공개 변수 분리자

    // IC: 공개 변수의 commitment
    // ic[0]: One 변수 (항상 1)
    // ic[j]: j번째 Instance 변수
    ic: Vec<G1>,  // [(β·aⱼ(τ)+α·bⱼ(τ)+cⱼ(τ))/γ]₁
}`,
    annotations: [
      { lines: [2, 3], color: 'sky', note: 'e(α,β) 사전 계산 — 검증 시 Fp12 곱셈 1회로 대체' },
      { lines: [5, 6], color: 'emerald', note: 'γ: 공개 변수, δ: 비공개 변수를 분리하는 역할' },
      { lines: [10, 11], color: 'amber', note: 'ic — 공개 입력 commitment. /γ로 나눠 e(·,[γ]₂)로 소거' },
    ],
  },
  'groth16-ic-l': {
    path: 'groth16.rs — IC (public) vs L (private) 분리',
    lang: 'rust',
    highlight: [1, 20],
    desc: 'lcⱼ = β·aⱼ(τ)+α·bⱼ(τ)+cⱼ(τ)\n공개 변수: /γ → IC (검증키에 포함)\n비공개 변수: /δ → L (증명키에 포함)',
    code: `let num_public = qap.num_instance + 1; // One + Instance

// IC: 공개 변수 — /γ로 나누어 검증키에
for j in 0..num_public {
    let lc = beta * a_at_tau[j]
           + alpha * b_at_tau[j]
           + c_at_tau[j];
    let val = lc * gamma_inv;
    ic.push(g1.scalar_mul(&val.to_repr()));
}

// L: 비공개 변수 — /δ로 나누어 증명키에
for j in num_public..n {
    let lc = beta * a_at_tau[j]
           + alpha * b_at_tau[j]
           + c_at_tau[j];
    let val = lc * delta_inv;
    l_query.push(g1.scalar_mul(&val.to_repr()));
}`,
    annotations: [
      { lines: [3, 9], color: 'sky', note: 'IC — 공개 변수 /γ. 검증 시 e(IC_sum, [γ]₂)로 γ 소거' },
      { lines: [12, 18], color: 'emerald', note: 'L — 비공개 변수 /δ. 검증 시 e(C, [δ]₂)로 δ 소거' },
    ],
  },
};
