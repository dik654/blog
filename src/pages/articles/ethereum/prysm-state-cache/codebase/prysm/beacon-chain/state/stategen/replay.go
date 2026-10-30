// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/state/stategen/replay.go — 핵심 발췌

func (s *State) replayBlocks(
	ctx context.Context,
	st state.BeaconState,
	blocks []interfaces.ReadOnlySignedBeaconBlock,
	targetSlot primitives.Slot,
) (state.BeaconState, error) {
	for _, block := range blocks {
		if st.Slot() >= targetSlot {
			break
		}
		if st.Slot() >= block.Block().Slot() {
			continue
		}
		var err error
		st, err = executeStateTransitionStateGen(ctx, st, block)
		if err != nil {
			return nil, err
		}
	}
	return st, nil
}

func (s *State) loadBlocks(
	ctx context.Context,
	startSlot, endSlot primitives.Slot,
	endBlockRoot [32]byte,
) ([]interfaces.ReadOnlySignedBeaconBlock, error) {
	query := filters.AncestryQuery{
		Earliest: startSlot,
		Descendent: filters.SlotRoot{Slot: endSlot, Root: endBlockRoot},
	}
	blocks, _, err := s.beaconDB.Blocks(ctx, filters.NewFilter().SetAncestryQuery(query))
	return blocks, err
}

func executeStateTransitionStateGen(
	ctx context.Context,
	st state.BeaconState,
	block interfaces.ReadOnlySignedBeaconBlock,
) (state.BeaconState, error) {
	st, err := ReplayProcessSlots(ctx, st, block.Block().Slot())
	if err != nil {
		return nil, err
	}
	return transition.ProcessBlockForStateRoot(ctx, st, block)
}
