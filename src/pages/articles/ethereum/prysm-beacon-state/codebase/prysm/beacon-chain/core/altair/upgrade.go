// Source excerpt: OffchainLabs/prysm v7.3.1
// beacon-chain/core/altair/upgrade.go

func ConvertToAltair(state state.BeaconState) (state.BeaconState, error) {
	epoch := time.CurrentEpoch(state)
	numValidators := state.NumValidators()

	s := &ethpb.BeaconStateAltair{
		GenesisTime:           uint64(state.GenesisTime().Unix()),
		GenesisValidatorsRoot: state.GenesisValidatorsRoot(),
		Slot:                  state.Slot(),
		Fork: &ethpb.Fork{
			PreviousVersion: state.Fork().CurrentVersion,
			CurrentVersion:  params.BeaconConfig().AltairForkVersion,
			Epoch:           epoch,
		},
		LatestBlockHeader:           state.LatestBlockHeader(),
		BlockRoots:                  state.BlockRoots(),
		StateRoots:                  state.StateRoots(),
		HistoricalRoots:             state.HistoricalRoots(),
		Eth1Data:                    state.Eth1Data(),
		Eth1DataVotes:               state.Eth1DataVotes(),
		Eth1DepositIndex:            state.Eth1DepositIndex(),
		Validators:                  state.Validators(),
		Balances:                    state.Balances(),
		RandaoMixes:                 state.RandaoMixes(),
		Slashings:                   state.Slashings(),
		PreviousEpochParticipation:  make([]byte, numValidators),
		CurrentEpochParticipation:   make([]byte, numValidators),
		JustificationBits:           state.JustificationBits(),
		PreviousJustifiedCheckpoint: state.PreviousJustifiedCheckpoint(),
		CurrentJustifiedCheckpoint:  state.CurrentJustifiedCheckpoint(),
		FinalizedCheckpoint:         state.FinalizedCheckpoint(),
		InactivityScores:            make([]uint64, numValidators),
	}

	return state_native.InitializeFromProtoUnsafeAltair(s)
}

func UpgradeToAltair(
	ctx context.Context,
	state state.BeaconState,
) (state.BeaconState, error) {
	newState, err := ConvertToAltair(state)
	if err != nil {
		return nil, err
	}

	prevEpochAtts, err := state.PreviousEpochAttestations()
	if err != nil {
		return nil, err
	}
	newState, err = TranslateParticipation(ctx, newState, prevEpochAtts)
	if err != nil {
		return nil, err
	}
	committee, err := NextSyncCommittee(ctx, newState)
	if err != nil {
		return nil, err
	}
	if err := newState.SetCurrentSyncCommittee(committee); err != nil {
		return nil, err
	}
	if err := newState.SetNextSyncCommittee(committee); err != nil {
		return nil, err
	}
	return newState, nil
}
