func ProcessSyncAggregate(ctx context.Context, s state.BeaconState, sync *ethpb.SyncAggregate) (state.BeaconState, uint64, error) {
	ctx, span := trace.StartSpan(ctx, "altair.ProcessSyncAggregate")
	defer span.End()

	s, votedKeys, reward, err := processSyncAggregate(ctx, s, sync)
	if err != nil {
		return nil, 0, errors.Wrap(err, "could not filter sync committee votes")
	}
	if err := VerifySyncCommitteeSig(s, votedKeys, sync.SyncCommitteeSignature); err != nil {
		return nil, 0, errors.Wrap(err, "could not verify sync committee signature")
	}
	return s, reward, nil
}

// ProcessSyncAggregateNoVerifySig processes the sync aggregate without verifying the sync committee signature.
// This is useful in scenarios such as block reward calculation, where we can assume the data in the block is valid.
func ProcessSyncAggregateNoVerifySig(ctx context.Context, s state.BeaconState, sync *ethpb.SyncAggregate) (state.BeaconState, uint64, error) {
	s, _, reward, err := processSyncAggregate(ctx, s, sync)
	if err != nil {
		return nil, 0, errors.Wrap(err, "could not filter sync committee votes")
	}
	return s, reward, nil
}

// processSyncAggregate applies all the logic in the spec function `process_sync_aggregate` except
// verifying the BLS signatures. It returns the modified beacons state, the list of validators'
// public keys that voted (for future signature verification) and the proposer reward for including
// sync aggregate messages.
func processSyncAggregate(ctx context.Context, s state.BeaconState, sync *ethpb.SyncAggregate) (
	state.BeaconState,
	[]bls.PublicKey,
	uint64,
	error) {
	currentSyncCommittee, err := s.CurrentSyncCommittee()
	if err != nil {
		return nil, nil, 0, err
	}
	if currentSyncCommittee == nil {
		return nil, nil, 0, errors.New("nil current sync committee in state")
	}
	committeeKeys := currentSyncCommittee.Pubkeys
	if sync.SyncCommitteeBits.Len() > uint64(len(committeeKeys)) {
		return nil, nil, 0, errors.New("bits length exceeds committee length")
	}
	votedKeys := make([]bls.PublicKey, 0, len(committeeKeys))

	activeBalance, err := helpers.TotalActiveBalance(ctx, s)
	if err != nil {
		return nil, nil, 0, err
	}
	proposerReward, participantReward, err := SyncRewards(activeBalance)
	if err != nil {
		return nil, nil, 0, err
	}
	proposerIndex, err := helpers.BeaconProposerIndex(ctx, s)
	if err != nil {
		return nil, nil, 0, err
	}

	earnedProposerReward := uint64(0)
	for i := uint64(0); i < sync.SyncCommitteeBits.Len(); i++ {
		vIdx, exists := s.ValidatorIndexByPubkey(bytesutil.ToBytes48(committeeKeys[i]))
		// Impossible scenario.
		if !exists {
			return nil, nil, 0, errors.New("validator public key does not exist in state")
		}

		if sync.SyncCommitteeBits.BitAt(i) {
			pubKey, err := bls.PublicKeyFromBytes(committeeKeys[i])
			if err != nil {
				return nil, nil, 0, err
			}
			votedKeys = append(votedKeys, pubKey)
			if err := helpers.IncreaseBalance(s, vIdx, participantReward); err != nil {
				return nil, nil, 0, err
			}
			earnedProposerReward += proposerReward
		} else {
			if err := helpers.DecreaseBalance(s, vIdx, participantReward); err != nil {
				return nil, nil, 0, err
			}
		}
	}
	if err := helpers.IncreaseBalance(s, proposerIndex, earnedProposerReward); err != nil {
		return nil, nil, 0, err
	}
	return s, votedKeys, earnedProposerReward, err
}

// VerifySyncCommitteeSig verifies sync committee signature `syncSig` is valid with respect to public keys `syncKeys`.
func VerifySyncCommitteeSig(s state.BeaconState, syncKeys []bls.PublicKey, syncSig []byte) error {
	ps := slots.PrevSlot(s.Slot())
	d, err := signing.Domain(s.Fork(), slots.ToEpoch(ps), params.BeaconConfig().DomainSyncCommittee, s.GenesisValidatorsRoot())
	if err != nil {
		return err
	}
	pbr, err := helpers.BlockRootAtSlot(s, ps)
	if err != nil {
		return err
	}
	sszBytes := p2pType.SSZBytes(pbr)
	r, err := signing.ComputeSigningRoot(&sszBytes, d)
	if err != nil {
		return err
	}
	sig, err := bls.SignatureFromBytes(syncSig)
	if err != nil {
		return err
	}
	if !sig.Eth2FastAggregateVerify(syncKeys, r) {
		return errors.New("invalid sync committee signature")
	}
	return nil
}
