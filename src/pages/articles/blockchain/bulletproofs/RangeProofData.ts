export const STRUCT_CODE = `// src/range_proof/mod.rs

pub struct RangeProof {
    // 비트 커밋 (A: 비트 벡터, S: 블라인딩 인수)
    A: CompressedRistretto,   // Σ aᵢ*Gᵢ + Σ (1-aᵢ)*Hᵢ + α*B_blinding
    S: CompressedRistretto,   // Σ sₐᵢ*Gᵢ + Σ s_bᵢ*Hᵢ + ρ*B_blinding

    // 다항식 t(x) = t₀ + t₁x + t₂x² 의 계수 커밋
    // (t(x) = ⟨l(x), r(x)⟩, l/r: 선형 다항식)
    T_1: CompressedRistretto, // t₁ 계수 커밋
    T_2: CompressedRistretto, // t₂ 계수 커밋

    // 도전점 x에서의 평가값
    t_x: Scalar,             // t(x) 실제값
    t_x_blinding: Scalar,    // t(x) 블라인딩 인수
    e_blinding: Scalar,      // l(x), r(x) 블라인딩 인수

    // 내적 인수 증명 (O(log n) 크기)
    ipp_proof: InnerProductProof,
}

// 증명 크기: 2 (A,S) + 2 (T1,T2) + 3 스칼라 + 2*log2(n)*G + 2 스칼라
// n=64: 2+2 점 + 3 + 2*6 점 + 2 스칼라 = 16 점 + 5 스칼라 ≈ 672 bytes`;

export const PROVE_CODE = `// src/range_proof/mod.rs — prove_multiple_with_rng

// 단일 증명자가 MPC 딜러-파티 패턴으로 집계 증명 생성
// (여러 파티가 각자 값을 가지고 협력할 수도 있음)

pub fn prove_multiple_with_rng(...) -> Result<(RangeProof, Vec<Commitment>), ...> {
    // 1. 딜러 초기화: n(비트수), m(집계수) 설정
    let dealer = Dealer::new(bp_gens, pc_gens, transcript, n, m)?;

    // 2. 각 파티가 비트 커밋 생성
    //    v를 n비트로 분해: aᵢ ∈ {0,1}
    //    Aⱼ = Σᵢ aᵢ*Gᵢⱼ + (1-aᵢ)*Hᵢⱼ + αⱼ*B_blinding  (비트 커밋)
    //    Sⱼ = Σᵢ sₐᵢ*Gᵢⱼ + s_bᵢ*Hᵢⱼ + ρⱼ*B_blinding    (블라인딩)
    let (parties, bit_commitments): (Vec<_>, Vec<_>) = parties
        .into_iter().enumerate()
        .map(|(j, p)| p.assign_position_with_rng(j, rng))
        .unzip();

    // 3. 딜러가 도전값 y, z 생성 (비트 커밋 관찰 후)
    let (dealer, bit_challenge) = dealer.receive_bit_commitments(bit_commitments)?;

    // 4. 각 파티가 다항식 계수 T₁, T₂ 생성
    let (parties, poly_commitments): (Vec<_>, Vec<_>) = parties
        .into_iter()
        .map(|p| p.apply_challenge_with_rng(&bit_challenge, rng))
        .unzip();

    // 5. 딜러가 도전값 x 생성 (다항식 커밋 관찰 후)
    let (dealer, poly_challenge) = dealer.receive_poly_commitments(poly_commitments)?;

    // 6. 각 파티가 t(x), l(x), r(x) 평가값 공유
    let proof_shares: Vec<_> = parties
        .into_iter()
        .map(|p| p.apply_challenge(&poly_challenge))
        .collect::<Result<Vec<_>, _>>()?;

    // 7. 딜러가 집계: IPP로 ⟨l, r⟩ = t(x) 증명
    let proof = dealer.receive_trusted_shares(&proof_shares)?;
    Ok((proof, value_commitments))
}`;

export const AGG_CODE = `// m개 범위 증명 집계 크기 비교 (n=64 비트 기준)
// 개별 증명: m × 672 bytes
// 집계 증명: 672 + 64 * log2(m) bytes (IPP만 커짐)

m=1:  672 bytes  (단일)
m=2:  736 bytes  (+64 bytes for 1 IPP round)
m=4:  800 bytes  (+128 bytes)
m=8:  864 bytes  (+192 bytes)
m=16: 928 bytes  (+256 bytes)
// → m=16: 개별 대비 94% 절약 (16×672 = 10752 vs 928)

// Monero, Grin 등에서 트랜잭션당 다중 출력에 집계 사용
// zkSync, StarkNet 등도 채택 검토`;
