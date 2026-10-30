// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/state/stategen/getter.go — 핵심 발췌

func (s *State) loadStateByRoot(
	ctx context.Context,
	blockRoot [32]byte,
) (state.BeaconState, error) {
	if cached := s.hotStateCache.get(blockRoot); cached != nil {
		return cached, nil
	}
	info, ok, err := s.epochBoundaryStateCache.getByBlockRoot(blockRoot)
	if err != nil {
		return nil, err
	}
	if ok {
		return info.state, nil
	}
	return s.loadStateByRootFromDBOrReplay(ctx, blockRoot)
}

func (s *State) loadStateByRootFromDBOrReplay(
	ctx context.Context,
	blockRoot [32]byte,
) (state.BeaconState, error) {
	if s.beaconDB.HasState(ctx, blockRoot) {
		if st, err := s.beaconDB.State(ctx, blockRoot); err == nil {
			return st, nil
		}
	}

	summary, err := s.stateSummary(ctx, blockRoot)
	if err != nil {
		return nil, err
	}
	startState, err := s.latestAncestor(ctx, blockRoot)
	if err != nil {
		return nil, err
	}
	blocks, err := s.loadBlocks(
		ctx, startState.Slot()+1, summary.Slot, blockRoot,
	)
	if err != nil {
		return nil, err
	}
	return s.replayBlocks(ctx, startState, blocks, summary.Slot)
}

// StateSummary는 목표 block의 slot과 root만 담습니다.
func (s *State) recoverStateSummary(
	ctx context.Context,
	blockRoot [32]byte,
) (*ethpb.StateSummary, error) {
	b, err := s.beaconDB.Block(ctx, blockRoot)
	if err != nil {
		return nil, err
	}
	summary := &ethpb.StateSummary{
		Slot: b.Block().Slot(),
		Root: blockRoot[:],
	}
	return summary, s.beaconDB.SaveStateSummary(ctx, summary)
}

// latestAncestor는 목표 block에서 parent root를 따라가며
// 처음 발견한 cached 또는 DB state를 반환합니다.
func (s *State) latestAncestor(
	ctx context.Context,
	blockRoot [32]byte,
) (state.BeaconState, error) {
	b, err := s.beaconDB.Block(ctx, blockRoot)
	if err != nil {
		return nil, err
	}
	for {
		parentRoot := b.Block().ParentRoot()
		if s.hotStateCache.has(parentRoot) {
			return s.hotStateCache.get(parentRoot), nil
		}
		if info, ok, err := s.epochBoundaryStateCache.getByBlockRoot(parentRoot); err != nil {
			return nil, err
		} else if ok {
			return info.state, nil
		}
		if s.beaconDB.HasState(ctx, parentRoot) {
			return s.beaconDB.State(ctx, parentRoot)
		}
		b, err = s.beaconDB.Block(ctx, parentRoot)
		if err != nil {
			return nil, err
		}
	}
}
