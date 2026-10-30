// Prysm v7.3.1 commit 96d418cd의 실제 source에서 이 요청에 필요한 분기만 발췌했습니다.
func IsOptimistic(
	ctx context.Context,
	stateId []byte,
	optimisticModeFetcher blockchain.OptimisticModeFetcher,
	stateFetcher lookup.Stater,
	chainInfo blockchain.ChainInfoFetcher,
	database db.ReadOnlyDatabase,
) (bool, error) {
	stateIdString := strings.ToLower(string(stateId))
	switch stateIdString {
	case "head":
		// Symbolic head는 node의 현재 optimistic mode를 다시 조회합니다.
		return optimisticModeFetcher.IsOptimistic(ctx)
	case "genesis":
		return false, nil
	// 실제 source에는 checkpoint·root·slot별 판정 분기가 이어집니다.
	}
}

// BlockRootFromState returns the root of the block that produced the given state.
func BlockRootFromState(ctx context.Context, st state.BeaconState) ([32]byte, error) {
	header := st.LatestBlockHeader()
	if header == nil {
		return [32]byte{}, errors.New("state has a nil latest block header")
	}

	// Header의 state_root가 비어 있으면 현재 state root로 채웁니다.
	zeroHash := params.BeaconConfig().ZeroHash
	if len(header.StateRoot) == 0 || bytes.Equal(header.StateRoot, zeroHash[:]) {
		stateRoot, err := st.HashTreeRoot(ctx)
		if err != nil {
			return [32]byte{}, fmt.Errorf("hash tree root: %w", err)
		}
		header.StateRoot = stateRoot[:]
	}

	// 보완된 latest block header를 hash해 finality lookup key를 만듭니다.
	root, err := header.HashTreeRoot()
	if err != nil {
		return [32]byte{}, fmt.Errorf("hash tree root: %w", err)
	}
	return root, nil
}
