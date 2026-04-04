use bls12_381::{G1Affine, G2Affine};
use ssz_rs::prelude::*;

/// Sync Committee 집계 서명 검증
/// 본문 대응: 'VerifyTrace' 섹션 — 5단계 전체를 이 함수가 수행
///
/// 매개변수 예시:
///   pks: 512개 G1 공개키 (current_sync_committee.pubkeys, 각 48B)
///   bits: Bitvector<512> — 이번 슬롯 참여 비트맵 (약 95% = 486개가 1)
///   sig: G2 집계 서명 (96B, 모든 참여자의 서명을 합산한 값)
///   header: 이번 슬롯의 BeaconBlockHeader (slot, proposer_index, roots)
///   fork_version: 현재 포크 식별자 (Deneb = 0x04000000)
pub fn verify_sync_committee_sig(
    pks: &[G1Affine],         // 512개 공개키 (부트스트랩에서 받은 위원회)
    bits: &Bitvector<512>,    // 참여 비트맵 (LightClientUpdate.sync_aggregate.sync_committee_bits)
    sig: &G2Affine,           // 집계 서명 (LightClientUpdate.sync_aggregate.sync_committee_signature)
    header: &BeaconBlockHeader,
    fork_version: [u8; 4],
) -> bool {
    // ──────────────────────────────────────────────
    // 본문 대응: VerifyTrace 단계 1 — 참여 비트맵 필터링
    // Viz 대응: Step 0 (비트맵 격자)
    // ──────────────────────────────────────────────
    // pks[i]와 bits[i]를 zip하여 bit=1인 공개키만 추출
    // 예: bits = [1,0,1,1,0,...] → 0번, 2번, 3번 공개키만 선택
    // 결과: 보통 480~510개 (네트워크 참여율 95%+ 일반적)
    let participants: Vec<&G1Affine> = pks
        .iter().zip(bits.iter())
        .filter(|(_, bit)| *bit)   // bit=1만 통과
        .map(|(pk, _)| pk)         // 공개키만 추출
        .collect();

    // ──────────────────────────────────────────────
    // 본문 대응: VerifyTrace 단계 2 — 정족수 확인
    // Viz 대응: Step 1 (프로그레스 바 + 2/3 임계선)
    // ──────────────────────────────────────────────
    // 정수 비교로 2/3 임계값 확인 (부동소수점 오차 방지)
    // participants.len() * 3 < 512 * 2 = 1024
    // → 최소 342명(66.8%) 이상이어야 통과
    // 왜 2/3: Casper FFG 안전성 보장 — 1/3 이하 악의적 검증자 허용 (BFT 한계)
    if participants.len() * 3
        < pks.len() * 2 {
        return false;
    }

    // ──────────────────────────────────────────────
    // 본문 대응: VerifyTrace 단계 3 — 집계 공개키 합산
    // Viz 대응: Step 2 (G1 점 수렴 애니메이션)
    // ──────────────────────────────────────────────
    // G1Affine::identity() = 무한원점 O (타원곡선 항등원)
    // fold: O + pk₁ + pk₂ + ... + pk₄₈₆ = agg_pk
    // BLS 선형성: agg_pk = (Σ sk_i) · G 이므로
    //   개별 검증 486회를 집계 검증 1회로 대체 가능
    // 결과: 단일 48바이트 G1 점
    let agg_pk = participants.iter()
        .fold(G1Affine::identity(),
            |acc, pk| acc + *pk);   // 타원곡선 점 덧셈 (modular arithmetic)

    // ──────────────────────────────────────────────
    // 본문 대응: VerifyTrace 단계 4 — signing_root 계산
    // Viz 대응: Step 3 (3단계 합성 다이어그램)
    // ──────────────────────────────────────────────
    // compute_domain():
    //   DOMAIN_SYNC_COMMITTEE = 0x07000000 (Sync Committee 전용)
    //   다른 도메인: PROPOSER=0x00, ATTESTER=0x01, RANDAO=0x02 등
    //   domain = fork_version ++ genesis_validators_root[:28]
    //   → 네트워크(메인넷/세폴리아)마다 다른 값 = 크로스체인 리플레이 방지
    let domain = compute_domain(
        DOMAIN_SYNC_COMMITTEE,     // 0x07 — 도메인 분리 (서명 목적 구분)
        fork_version,              // 0x04 (Deneb) — 포크 간 리플레이 방지
    );
    // compute_signing_root():
    //   object_root = header.tree_hash_root() — SSZ 해시
    //   root = hash_tree_root(SigningData { object_root, domain })
    //   이 root가 서명 대상 메시지 (32바이트)
    let root = compute_signing_root(
        header, domain,
    );

    // ──────────────────────────────────────────────
    // 본문 대응: VerifyTrace 단계 5 — 페어링 비교
    // Viz 대응: Step 4 (두 경로가 GT에서 만남)
    // ──────────────────────────────────────────────
    // hash_to_g2: signing_root(32B) → G2 곡선 점 (96B)
    //   표준: draft-irtf-cfrg-hash-to-curve (결정론적 매핑)
    let h_m = hash_to_g2(&root);

    // pairing: 쌍선형 함수 e: G1 × G2 → GT
    //   내부: Miller loop + final exponentiation (~2ms)
    // lhs = e(agg_pk, H(m)) = e((Σ sk_i)·G, H(m))
    let lhs = pairing(&agg_pk, &h_m);
    // rhs = e(G, sig) = e(G, (Σ sk_i)·H(m))
    let rhs = pairing(&G1Affine::generator(),
        sig);

    // 쌍선형성: e(a·G, B) = e(G, a·B)
    // → a = Σ sk_i 이면 lhs == rhs
    // → "서명자가 정말 이 공개키의 소유자"임을 증명
    lhs == rhs
}
