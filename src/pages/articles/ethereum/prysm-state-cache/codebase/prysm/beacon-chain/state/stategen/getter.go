// beacon-chain/state/stategen/getter.go — Prysm v5.x

// StateByRoot returns the beacon state for a given block root.
func (s *State) StateByRoot(ctx context.Context, root [32]byte) (state.BeaconState, error) {
	// 1. Check hot state cache (recent epochs)
	if st, ok := s.hotStateCache.Get(root); ok {
		return st.Copy(), nil
	}
	// 2. Check if state exists in DB
	hasSt, err := s.beaconDB.HasState(ctx, root)
	if err != nil {
		return nil, err
	}
	if hasSt {
		return s.beaconDB.State(ctx, root)
	}
	// 3. Replay from nearest saved state
	return s.replayToSlot(ctx, root)
}

// StateBySlot returns the beacon state at a given slot.
func (s *State) StateBySlot(ctx context.Context, slot primitives.Slot) (state.BeaconState, error) {
	// Find the block root at this slot
	root, err := s.beaconDB.BlockRootBySlot(ctx, slot)
	if err != nil {
		return nil, err
	}
	if root == params.BeaconConfig().ZeroHash {
		// Empty slot — find nearest previous block
		root, err = s.lastSavedBlockRoot(ctx, slot)
		if err != nil {
			return nil, err
		}
	}
	return s.StateByRoot(ctx, root)
}
