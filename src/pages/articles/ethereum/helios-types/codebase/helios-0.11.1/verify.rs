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

    let update_attested_epoch = update.attested_header.beacon().slot / S::slots_per_epoch();

    if let Some(finalized_header) = &update.finalized_header {
        if let Some(finality_branch) = &update.finality_branch {
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
