use eyre::Result;

/// Light Client Update 검증 및 적용
/// 본문 대응: UpdateTrace 섹션 전체
pub fn validate_update(
    store: &LightClientStore,
    // store: 부트스트랩에서 초기화된 LightClientStore
    //   - finalized_header: 현재 finalized 블록 (예: slot 8000000)
    //   - current_sync_committee: 현재 위원회 512명의 BLS 공개키
    //   - fork_version: 현재 포크 버전 (Deneb = 0x04000000)
    update: &LightClientUpdate,
    // update: Beacon API에서 매 12초마다 수신한 Update
    //   - signature_slot: 서명 시점 슬롯 (예: 8000033)
    //   - attested_header: 서명 대상 블록 헤더 (예: slot 8000032)
    //   - sync_aggregate.bits: 참여 비트맵 (Bitvector<512>)
    //   - sync_aggregate.signature: 집계 BLS 서명 (G2 점, 96B)
) -> Result<()> {
    // 본문 대응: 검사 1 — 슬롯 순서 검사
    // signature_slot(서명 시점) > attested_header.slot(서명 대상)
    // 역순이면 미래 슬롯 서명 공격 → 경량 클라이언트 기만 가능
    if update.signature_slot
        <= update.attested_header.slot {
        return Err(eyre!("sig slot too old"));
    }
    // 본문 대응: 검사 2 — Sync Committee BLS 서명 검증
    // verify_sync_committee_sig(): 5단계 파이프라인
    //   1) bits에서 bit=1인 공개키 필터링 → ~486개
    //   2) 정족수 확인: participants*3 >= total*2 (최소 342명)
    //   3) G1 점 합산 → agg_pk (48B)
    //   4) signing_root 계산 (DOMAIN_SYNC=0x07 + fork_version)
    //   5) e(agg_pk, H(m)) == e(G, sig) 페어링 비교
    let valid = verify_sync_committee_sig(
        &store.current_sync_committee.pubkeys, // 512개 G1 공개키
        &update.sync_aggregate.bits,           // 참여 비트맵
        &update.sync_aggregate.signature,      // 집계 서명 (G2)
        &update.attested_header,               // 서명 대상 헤더
        store.fork_version,                    // 0x04 (Deneb)
    );
    if !valid {
        return Err(eyre!("BLS verify failed"));
    }
    Ok(())
}

/// 검증 통과 후 Store 갱신
/// 본문 대응: UpdateTrace — 반영 1~3
pub fn apply_update(
    store: &mut LightClientStore,
    update: &LightClientUpdate,
) {
    // 본문 대응: 반영 1 — finalized_header 갱신
    // 새 finalized 슬롯이 더 크면 교체
    // finalized = 되돌릴 수 없음 (2/3 stake 보장)
    // 예: update.slot=8000064 > store.slot=8000000 → 교체
    if update.finalized_header.slot
        > store.finalized_header.slot {
        store.finalized_header =
            update.finalized_header.clone();
    }
    // 본문 대응: 반영 2 — 위원회 교체 (period 경계)
    // period = slot / 8192 (256 에폭 = 27.3시간)
    // period가 변경되면 current ← next (512명 전체 교체)
    // 예: slot 8003584부터 period 977 시작 → 교체
    if has_next_committee(update) {
        store.current_sync_committee =
            update.next_sync_committee
                .clone().unwrap();
    }
    // 본문 대응: 반영 3 — optimistic_header 갱신
    // 조건 없이 항상 교체 — 최신 헤더가 곧 optimistic
    // eth_getBlockByNumber("latest") 응답에 사용
    // reorg 시에도 새 포크의 헤더로 즉시 교체 (O(1))
    store.optimistic_header =
        update.attested_header.clone();
}
