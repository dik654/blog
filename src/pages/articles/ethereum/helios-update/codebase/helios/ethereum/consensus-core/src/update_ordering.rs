// a16z/helios commit 43a8c9f3
// ethereum/consensus-core/src/consensus_core.rs:367-505에서 발췌했습니다.

/// WARNING: `force_update` allows Helios to accept a header with less than a quorum of signatures.
/// Use with caution only in cases where it is not possible that valid updates are being censored.
pub fn force_update<S: ConsensusSpec>(store: &mut LightClientStore<S>, current_slot: u64) {
    if current_slot > store.finalized_header.beacon().slot + S::slots_per_sync_committee_period() {
        if let Some(mut best_valid_update) = store.best_valid_update.clone() {
            if best_valid_update
                .finalized_header
                .as_ref()
                .unwrap()
                .beacon()
                .slot
                <= store.finalized_header.beacon().slot
            {
                best_valid_update.finalized_header =
                    Some(best_valid_update.attested_header.clone());
            }
            apply_update_no_quorum_check(store, &best_valid_update);
            store.best_valid_update = None;
        }
    }
}

pub fn expected_current_slot(now: SystemTime, genesis_time: u64) -> u64 {
    let now = now.duration_since(UNIX_EPOCH).unwrap_or_default().as_secs();

    let since_genesis = now - genesis_time;

    since_genesis / 12
}

pub fn calc_sync_period<S: ConsensusSpec>(slot: u64) -> u64 {
    let epoch = slot / S::slots_per_epoch();
    epoch / S::epochs_per_sync_committee_period()
}

pub fn get_bits<S: ConsensusSpec>(bitfield: &BitVector<S::SyncCommitteeSize>) -> u64 {
    bitfield.iter().filter(|v| *v).count() as u64
}

fn is_better_update<S: ConsensusSpec>(
    new_update: &GenericUpdate<S>,
    old_update: &GenericUpdate<S>,
) -> bool {
    let max_active_participants = new_update.sync_aggregate.sync_committee_bits.len() as u64;
    let new_num_active_participants = get_bits::<S>(&new_update.sync_aggregate.sync_committee_bits);
    let old_num_active_participants = get_bits::<S>(&old_update.sync_aggregate.sync_committee_bits);
    let new_has_supermajority = new_num_active_participants * 3 >= max_active_participants * 2;
    let old_has_supermajority = old_num_active_participants * 3 >= max_active_participants * 2;

    if new_has_supermajority != old_has_supermajority {
        return new_has_supermajority;
    }

    if !new_has_supermajority && new_num_active_participants != old_num_active_participants {
        return new_num_active_participants > old_num_active_participants;
    }

    // compare presence of relevant sync committee
    let new_has_relevant_sync_committee = new_update.next_sync_committee_branch.is_some()
        && calc_sync_period::<S>(new_update.attested_header.beacon().slot)
            == calc_sync_period::<S>(new_update.signature_slot);
    let old_has_relevant_sync_committee = old_update.next_sync_committee_branch.is_some()
        && calc_sync_period::<S>(old_update.attested_header.beacon().slot)
            == calc_sync_period::<S>(old_update.signature_slot);
    if new_has_relevant_sync_committee != old_has_relevant_sync_committee {
        return new_has_relevant_sync_committee;
    }

    // compare indication of any finality
    let new_has_finality = new_update.finality_branch.is_some();
    let old_has_finality = old_update.finality_branch.is_some();
    if new_has_finality != old_has_finality {
        return new_has_finality;
    }

    // compare sync committee finality
    if new_has_finality {
        let new_has_sync_committee_finality =
            calc_sync_period::<S>(
                new_update
                    .finalized_header
                    .clone()
                    .unwrap_or_default()
                    .beacon()
                    .slot,
            ) == calc_sync_period::<S>(new_update.attested_header.beacon().slot);
        let old_has_sync_committee_finality =
            calc_sync_period::<S>(
                old_update
                    .finalized_header
                    .clone()
                    .unwrap_or_default()
                    .beacon()
                    .slot,
            ) == calc_sync_period::<S>(old_update.attested_header.beacon().slot);
        if new_has_sync_committee_finality != old_has_sync_committee_finality {
            return new_has_sync_committee_finality;
        }
    }

    // tiebreaker 1: Sync committee participation beyond supermajority
    if new_num_active_participants != old_num_active_participants {
        return new_num_active_participants > old_num_active_participants;
    }

    // tiebreaker 2: Prefer older data (fewer changes to best)
    if new_update.attested_header.beacon().slot != old_update.attested_header.beacon().slot {
        return new_update.attested_header.beacon().slot < old_update.attested_header.beacon().slot;
    }

    // tiebreaker 3: prefer updates with earlier signature slots
    new_update.signature_slot < old_update.signature_slot
}

fn has_sync_update<S: ConsensusSpec>(update: &GenericUpdate<S>) -> bool {
    update.next_sync_committee.is_some() && update.next_sync_committee_branch.is_some()
}

fn has_finality_update<S: ConsensusSpec>(update: &GenericUpdate<S>) -> bool {
    update.finality_branch.is_some()
}

fn verify_sync_committee_signature(
    aggregate_public_key: &bls12_381::G1Affine,
    attested_header: &BeaconBlockHeader,
    signature: &Signature,
    fork_data_root: B256,
) -> bool {
    let header_root = attested_header.tree_hash_root();
    let signing_root = compute_committee_sign_root(header_root, fork_data_root);
    signature.verify(signing_root.as_slice(), aggregate_public_key)
}

fn safety_threshold<S: ConsensusSpec>(store: &LightClientStore<S>) -> u64 {
    cmp::max(
        store.current_max_active_participants,
        store.previous_max_active_participants,
    ) / 2
}
