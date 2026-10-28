// a16z/helios commit 43a8c9f3의 ethereum/consensus-core/src/consensus_core.rs에서 발췌했습니다.
// 실행문은 원문을 보존하고, 각 판정의 의미를 한국어 주석으로 덧붙였습니다.

pub fn verify_bootstrap<S: ConsensusSpec>(
    bootstrap: &Bootstrap<S>,
    checkpoint: B256,
    forks: &Forks,
) -> Result<()> {
    // Fork별 LightClientHeader 구조와 execution payload proof를 먼저 검사합니다.
    if !is_valid_header::<S>(bootstrap.header(), forks) {
        return Err(ConsensusError::InvalidExecutionPayloadProof.into());
    }

    // Committee K와 branch B가 header H의 state root에 포함되는지 확인합니다.
    let committee_valid = is_current_committee_proof_valid(
        bootstrap.header().beacon(),
        bootstrap.current_sync_committee(),
        bootstrap.current_sync_committee_branch(),
        bootstrap.header().beacon().slot / S::slots_per_epoch(),
        forks,
    );

    // Header H를 다시 hash해 승인된 checkpoint C와 대조합니다.
    let header_hash = bootstrap.header().beacon().tree_hash_root();
    let header_valid = header_hash == checkpoint;

    if !header_valid {
        return Err(ConsensusError::InvalidHeaderHash(header_hash, checkpoint).into());
    }

    if !committee_valid {
        return Err(ConsensusError::InvalidCurrentSyncCommitteeProof.into());
    }

    Ok(())
}

pub fn apply_bootstrap<S: ConsensusSpec>(
    store: &mut LightClientStore<S>,
    bootstrap: &Bootstrap<S>,
) {
    // 부분 필드 갱신이 아니라 검증된 Bootstrap에서 Store 전체를 한 번에 만듭니다.
    *store = LightClientStore {
        finalized_header: bootstrap.header().clone(),
        current_sync_committee: bootstrap.current_sync_committee().clone(),
        next_sync_committee: None,
        optimistic_header: bootstrap.header().clone(),
        previous_max_active_participants: 0,
        current_max_active_participants: 0,
        best_valid_update: None,
    };
}
