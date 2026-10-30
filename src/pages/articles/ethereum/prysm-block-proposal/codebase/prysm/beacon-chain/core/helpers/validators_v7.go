// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/core/helpers/validators.go — 발췌

func beaconProposerIndexAtSlotFulu(state state.ReadOnlyBeaconState, slot primitives.Slot) (primitives.ValidatorIndex, error) {
	e := slots.ToEpoch(slot)
	stateEpoch := slots.ToEpoch(state.Slot())
	if e < stateEpoch || e > stateEpoch+1 {
		return 0, errors.Errorf("slot %d is not in the current epoch %d or the next epoch", slot, stateEpoch)
	}
	lookAhead, err := state.ProposerLookahead()
	if err != nil {
		return 0, errors.Wrap(err, "could not get proposer lookahead")
	}
	spe := params.BeaconConfig().SlotsPerEpoch
	if e == stateEpoch {
		return lookAhead[slot%spe], nil
	}
	return lookAhead[spe+slot%spe], nil
}

func BeaconProposerIndexAtSlot(ctx context.Context, state state.ReadOnlyBeaconState, slot primitives.Slot) (primitives.ValidatorIndex, error) {
	e := slots.ToEpoch(slot)
	stateEpoch := slots.ToEpoch(state.Slot())
	if state.Version() >= version.Fulu {
		if e == stateEpoch || e == stateEpoch+1 {
			return beaconProposerIndexAtSlotFulu(state, slot)
		}
	}

	seed, err := Seed(state, e, params.BeaconConfig().DomainBeaconProposer)
	if err != nil {
		return 0, errors.Wrap(err, "could not generate seed")
	}
	seedWithSlot := append(seed[:], bytesutil.Bytes8(uint64(slot))...)
	seedWithSlotHash := hash.Hash(seedWithSlot)
	indices, err := ActiveValidatorIndices(ctx, state, e)
	if err != nil {
		return 0, errors.Wrap(err, "could not get active indices")
	}
	return ComputeProposerIndex(state, indices, seedWithSlotHash)
}

func ComputeProposerIndex(bState state.ReadOnlyBeaconState, activeIndices []primitives.ValidatorIndex, seed [32]byte) (primitives.ValidatorIndex, error) {
	length := uint64(len(activeIndices))
	if length == 0 {
		return 0, errors.New("empty active indices list")
	}
	hashFunc := hash.CustomSHA256Hasher()
	cfg := params.BeaconConfig()
	seedBuffer := make([]byte, len(seed)+8)
	copy(seedBuffer, seed[:])

	for i := uint64(0); ; i++ {
		candidateIndex, err := ComputeShuffledIndex(primitives.ValidatorIndex(i%length), length, seed, true)
		if err != nil {
			return 0, err
		}
		candidateIndex = activeIndices[candidateIndex]
		v, err := bState.ValidatorAtIndexReadOnly(candidateIndex)
		if err != nil {
			return 0, err
		}
		effectiveBal := v.EffectiveBalance()
		if bState.Version() >= version.Electra {
			binary.LittleEndian.PutUint64(seedBuffer[len(seed):], i/16)
			randomBytes := hashFunc(seedBuffer)
			offset := (i % 16) * 2
			randomValue := uint64(randomBytes[offset]) | uint64(randomBytes[offset+1])<<8
			if effectiveBal*fieldparams.MaxRandomValueElectra >= cfg.MaxEffectiveBalanceElectra*randomValue {
				return candidateIndex, nil
			}
		}
	}
}
