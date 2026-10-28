// a16z/helios commit 43a8c9f3
// ethereum/consensus-core/src/consensus_core.rs:132-365에서 발췌했습니다.

// implements state changes from apply_light_client_update and process_light_client_update in
// the specification
/// Returns the new checkpoint if one is created, otherwise None
pub fn apply_generic_update<S: ConsensusSpec>(
    store: &mut LightClientStore<S>,
    update: &GenericUpdate<S>,
) -> Option<B256> {
    let committee_bits = get_bits::<S>(&update.sync_aggregate.sync_committee_bits);

    // update best valid update
    if store.best_valid_update.is_none()
        || is_better_update(update, store.best_valid_update.as_ref().unwrap())
    {
        store.best_valid_update = Some(update.clone());
    }

    store.current_max_active_participants =
        u64::max(store.current_max_active_participants, committee_bits);

    let should_update_optimistic = committee_bits > safety_threshold(store)
        && update.attested_header.beacon().slot > store.optimistic_header.beacon().slot;

    if should_update_optimistic {
        store.optimistic_header = update.attested_header.clone();
    }

    let update_attested_period = calc_sync_period::<S>(update.attested_header.beacon().slot);

    let update_finalized_slot = update
        .finalized_header
        .as_ref()
        .map(|h| h.beacon().slot)
        .unwrap_or(0);

    let update_finalized_period = calc_sync_period::<S>(update_finalized_slot);

    let update_has_finalized_next_committee = store.next_sync_committee.is_none()
        && has_sync_update(update)
        && has_finality_update(update)
        && update_finalized_period == update_attested_period;

    let should_apply_update = {
        let has_majority = committee_bits * 3 >= S::sync_committee_size() * 2;
        if !has_majority {
            warn!("skipping block with low vote count");
        }

        let update_is_newer = update_finalized_slot > store.finalized_header.beacon().slot;
        let good_update = update_is_newer || update_has_finalized_next_committee;

        has_majority && good_update
    };

    if should_apply_update {
        let checkpoint = apply_update_no_quorum_check(store, update);
        store.best_valid_update = None;
        checkpoint
    } else {
        None
    }
}

fn apply_update_no_quorum_check<S: ConsensusSpec>(
    store: &mut LightClientStore<S>,
    update: &GenericUpdate<S>,
) -> Option<B256> {
    let store_period = calc_sync_period::<S>(store.finalized_header.beacon().slot);
    let update_finalized_slot = update
        .finalized_header
        .as_ref()
        .map(|h| h.beacon().slot)
        .unwrap_or(0);
    let update_finalized_period = calc_sync_period::<S>(update_finalized_slot);

    if store.next_sync_committee.is_none() {
        if update_finalized_period != store_period {
            return None;
        }
        store
            .next_sync_committee
            .clone_from(&update.next_sync_committee);
    } else if update_finalized_period == store_period + 1 {
        info!(target: "helios::consensus", "sync committee updated");
        store.current_sync_committee = store.next_sync_committee.clone().unwrap();
        store
            .next_sync_committee
            .clone_from(&update.next_sync_committee);
        store.previous_max_active_participants = store.current_max_active_participants;
        store.current_max_active_participants = 0;
    }

    if update_finalized_slot > store.finalized_header.beacon().slot {
        store.finalized_header = update.finalized_header.clone().unwrap();

        if store.finalized_header.beacon().slot > store.optimistic_header.beacon().slot {
            store.optimistic_header = store.finalized_header.clone();
        }

        if store
            .finalized_header
            .beacon()
            .slot
            .is_multiple_of(S::slots_per_epoch())
        {
            let checkpoint = store.finalized_header.beacon().tree_hash_root();
            return Some(checkpoint);
        }
    }

    None
}

// implements checks from validate_light_client_update and process_light_client_update in the
// specification
pub fn verify_generic_update<S: ConsensusSpec>(
    update: &GenericUpdate<S>,
    expected_current_slot: u64,
    store: &LightClientStore<S>,
    genesis_root: B256,
    forks: &Forks,
) -> Result<()> {
    let bits = get_bits::<S>(&update.sync_aggregate.sync_committee_bits);
    if bits == 0 {
        return Err(ConsensusError::InsufficientParticipation.into());
    }

    if !is_valid_header::<S>(&update.attested_header, forks) {
        return Err(ConsensusError::InvalidExecutionPayloadProof.into());
    }

    let update_finalized_slot = update
        .finalized_header
        .clone()
        .map(|v| v.beacon().slot)
        .unwrap_or_default();

    let valid_time: bool = expected_current_slot >= update.signature_slot
        && update.signature_slot > update.attested_header.beacon().slot
        && update.attested_header.beacon().slot >= update_finalized_slot;

    if !valid_time {
        return Err(ConsensusError::InvalidTimestamp.into());
    }

    let store_period = calc_sync_period::<S>(store.finalized_header.beacon().slot);
    let update_sig_period = calc_sync_period::<S>(update.signature_slot);
    let valid_period = if store.next_sync_committee.is_some() {
        update_sig_period == store_period || update_sig_period == store_period + 1
    } else {
        update_sig_period == store_period
    };
    if !valid_period {
        return Err(ConsensusError::InvalidPeriod.into());
    }

    let update_attested_period = calc_sync_period::<S>(update.attested_header.beacon().slot);
    let update_has_next_committee = store.next_sync_committee.is_none()
        && update.next_sync_committee.is_some()
        && update_attested_period == store_period;

    if update.attested_header.beacon().slot <= store.finalized_header.beacon().slot
        && !update_has_next_committee
    {
        return Err(ConsensusError::NotRelevant.into());
    }

    let update_attested_epoch = update.attested_header.beacon().slot / S::slots_per_epoch();

    if let Some(finalized_header) = &update.finalized_header {
        if let Some(finality_branch) = &update.finality_branch {
            if !is_valid_header::<S>(finalized_header, forks) {
                return Err(ConsensusError::InvalidExecutionPayloadProof.into());
            }

            let is_valid = is_finality_proof_valid(
                update.attested_header.beacon(),
                finalized_header.beacon(),
                finality_branch,
                update_attested_epoch,
                forks,
            );

            if !is_valid {
                return Err(ConsensusError::InvalidFinalityProof.into());
            }
        } else {
            return Err(ConsensusError::InvalidFinalityProof.into());
        }
    }

    if let Some(next_sync_committee) = &update.next_sync_committee {
        if let Some(next_sync_committee_branch) = &update.next_sync_committee_branch {
            let is_valid = is_next_committee_proof_valid(
                update.attested_header.beacon(),
                next_sync_committee,
                next_sync_committee_branch,
                update_attested_epoch,
                forks,
            );

            if !is_valid {
                return Err(ConsensusError::InvalidNextSyncCommitteeProof.into());
            }
        } else {
            return Err(ConsensusError::InvalidNextSyncCommitteeProof.into());
        }
    }

    let sync_committee = if update_sig_period == store_period {
        &store.current_sync_committee
    } else {
        store.next_sync_committee.as_ref().unwrap()
    };

    let agg_pk = get_participating_aggregate_pubkey(
        sync_committee,
        &update.sync_aggregate.sync_committee_bits,
    )?;

    let fork_version = calculate_fork_version::<S>(forks, update.signature_slot.saturating_sub(1));
    let fork_data_root = compute_fork_data_root(fork_version, genesis_root);
    let is_valid_sig = verify_sync_committee_signature(
        &agg_pk,
        update.attested_header.beacon(),
        &update.sync_aggregate.sync_committee_signature,
        fork_data_root,
    );

    if !is_valid_sig {
        return Err(ConsensusError::InvalidSignature.into());
    }

    Ok(())
}
