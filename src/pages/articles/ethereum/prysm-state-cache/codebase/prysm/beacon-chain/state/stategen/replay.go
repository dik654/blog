// beacon-chain/state/stategen/replay.go — Prysm v5.x

// ReplayBlocks replays blocks on a given state up to target slot.
func (s *State) ReplayBlocks(
	ctx context.Context, st state.BeaconState, blocks []interfaces.ReadOnlySignedBeaconBlock, targetSlot primitives.Slot,
) (state.BeaconState, error) {
	var err error
	// Process each block sequentially
	for _, blk := range blocks {
		// Advance slots if there are gaps
		st, err = transition.ProcessSlots(ctx, st, blk.Block().Slot())
		if err != nil {
			return nil, err
		}
		// Execute block state transition
		st, err = transition.ExecuteStateTransition(ctx, st, blk)
		if err != nil {
			return nil, err
		}
	}
	// Advance remaining slots after last block
	if st.Slot() < targetSlot {
		st, err = transition.ProcessSlots(ctx, st, targetSlot)
		if err != nil {
			return nil, err
		}
	}
	return st, nil
}

// ComputeStateUpToSlot computes state at target from nearest checkpoint.
func (s *State) ComputeStateUpToSlot(ctx context.Context, target primitives.Slot) (state.BeaconState, error) {
	ctx, span := trace.StartSpan(ctx, "stateGen.ComputeStateUpToSlot")
	defer span.End()
	// Find nearest saved state before target
	st, err := s.lastSavedState(ctx, target)
	if err != nil {
		return nil, err
	}
	// Fetch blocks between saved state and target
	blocks, err := s.loadBlocks(ctx, st.Slot()+1, target)
	if err != nil {
		return nil, err
	}
	return s.ReplayBlocks(ctx, st, blocks, target)
}
