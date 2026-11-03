func NextSyncCommitteeIndices(ctx context.Context, s state.BeaconState) ([]primitives.ValidatorIndex, error) {
	epoch := coreTime.NextEpoch(s)
	indices, err := helpers.ActiveValidatorIndices(ctx, s, epoch)
	if err != nil {
		return nil, err
	}
	seed, err := helpers.Seed(s, epoch, params.BeaconConfig().DomainSyncCommittee)
	if err != nil {
		return nil, err
	}
	count := uint64(len(indices))
	cfg := params.BeaconConfig()
	syncCommitteeSize := cfg.SyncCommitteeSize
	cIndices := make([]primitives.ValidatorIndex, 0, syncCommitteeSize)
	hashFunc := hash.CustomSHA256Hasher()

	// Preallocate buffers to avoid repeated allocations
	seedBuffer := make([]byte, len(seed)+8)
	copy(seedBuffer, seed[:])

	for i := primitives.ValidatorIndex(0); uint64(len(cIndices)) < syncCommitteeSize; i++ {
		if ctx.Err() != nil {
			return nil, ctx.Err()
		}

		sIndex, err := helpers.ComputeShuffledIndex(i.Mod(count), count, seed, true)
		if err != nil {
			return nil, err
		}
		cIndex := indices[sIndex]
		v, err := s.ValidatorAtIndexReadOnly(cIndex)
		if err != nil {
			return nil, err
		}
		effectiveBal := v.EffectiveBalance()

		if s.Version() >= version.Electra {
			// Use the preallocated seed buffer
			binary.LittleEndian.PutUint64(seedBuffer[len(seed):], uint64(i/16))
			randomByte := hashFunc(seedBuffer)
			offset := (i % 16) * 2
			randomValue := uint64(randomByte[offset]) | uint64(randomByte[offset+1])<<8

			if effectiveBal*fieldparams.MaxRandomValueElectra >= cfg.MaxEffectiveBalanceElectra*randomValue {
				cIndices = append(cIndices, cIndex)
			}
		} else {
			// Use the preallocated seed buffer
			binary.LittleEndian.PutUint64(seedBuffer[len(seed):], uint64(i/32))
			randomByte := hashFunc(seedBuffer)[i%32]
			if effectiveBal*fieldparams.MaxRandomByte >= cfg.MaxEffectiveBalance*uint64(randomByte) {
				cIndices = append(cIndices, cIndex)
			}
		}
	}

	return cIndices, nil
}
