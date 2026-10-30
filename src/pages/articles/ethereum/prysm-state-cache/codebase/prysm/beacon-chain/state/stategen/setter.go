// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/state/stategen/setter.go — 핵심 발췌

func (s *State) saveStateByRoot(
	ctx context.Context,
	blockRoot [32]byte,
	st state.BeaconState,
) error {
	if slots.IsEpochStart(st.Slot()) {
		if err := s.epochBoundaryStateCache.put(blockRoot, st); err != nil {
			return err
		}
	}

	if err := s.beaconDB.SaveStateSummary(ctx, &ethpb.StateSummary{
		Slot: st.Slot(),
		Root: blockRoot[:],
	}); err != nil {
		return err
	}

	// Source의 주석과 달리 hotStateCache.put 자체는 Copy를 호출하지 않습니다.
	s.hotStateCache.put(blockRoot, st)
	return nil
}
