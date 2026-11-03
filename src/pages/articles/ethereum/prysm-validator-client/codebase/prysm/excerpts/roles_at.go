// RolesAt slot returns the validator roles at the given slot. Returns nil if the
// validator is known to not have a roles at the slot. Returns UNKNOWN if the
// validator assignments are unknown. Otherwise, returns a valid ValidatorRole map.
func (v *validator) RolesAt(ctx context.Context, slot primitives.Slot) (map[[fieldparams.BLSPubkeyLength]byte][]validatorRole, error) {
	ctx, span := trace.StartSpan(ctx, "validator.RolesAt")
	defer span.End()

	snap := v.duties.snapshot()
	if !snap.isInitialized() {
		return nil, errors.New("validator duties are not initialized")
	}

	var (
		rolesAt              = make(map[[fieldparams.BLSPubkeyLength]byte][]validatorRole)
		syncCommitteePubkeys [][fieldparams.BLSPubkeyLength]byte
	)

	for pk, duty := range snap.currentDuties() {
		var roles []validatorRole

		if duty == nil {
			continue
		}
		// The store may predate a reload; quarantined keys get no roles at all.
		if v.isDoppelGangerPending(pk) {
			continue
		}
		if len(duty.ProposerSlots) > 0 {
			for _, proposerSlot := range duty.ProposerSlots {
				if proposerSlot != 0 && proposerSlot == slot {
					roles = append(roles, roleProposer)
					break
				}
			}
		}

		if duty.AttesterSlot == slot {
			roles = append(roles, roleAttester)

			aggregator, err := v.isAggregator(ctx, duty.CommitteeLength, slot, pk)
			if err != nil {
				aggregator = false
				log.WithError(err).Errorf("Could not check if validator %#x is an aggregator", bytesutil.Trunc(duty.PublicKey))
			}
			if aggregator {
				roles = append(roles, roleAggregator)
			}
		}

		// Being assigned to a sync committee for a given slot means that the validator produces and
		// broadcasts signatures for `slot - 1` for inclusion in `slot`. At the last slot of the epoch,
		// the validator checks whether it's in the sync committee of following epoch.
		inSyncCommittee := false
		if slots.IsEpochEnd(slot) {
			if snap.isNextSyncCommittee(duty.ValidatorIndex) {
				roles = append(roles, roleSyncCommittee)
				inSyncCommittee = true
			}
		} else {
			if duty.IsSyncCommittee {
				roles = append(roles, roleSyncCommittee)
				inSyncCommittee = true
			}
		}

		if inSyncCommittee {
			syncCommitteePubkeys = append(syncCommitteePubkeys, pk)
		}

		if slices.Contains(snap.ptcSlots(duty.ValidatorIndex), slot) {
			roles = append(roles, rolePTCMember)
		}

		if len(roles) == 0 {
			roles = append(roles, roleUnknown)
		}

		rolesAt[pk] = roles
	}

	aggPubkeys, err := v.aggSelector.SyncCommitteeAggregators(ctx, slot, syncCommitteePubkeys)
	if err != nil {
		log.WithError(err).Error("Could not check if any validator is a sync committee aggregator")
		return rolesAt, nil
	}
	for _, pk := range aggPubkeys {
		rolesAt[pk] = append(rolesAt[pk], roleSyncCommitteeAggregator)
	}

	return rolesAt, nil
}
