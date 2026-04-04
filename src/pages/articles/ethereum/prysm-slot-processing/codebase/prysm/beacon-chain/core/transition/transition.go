// beacon-chain/core/transition/transition.go — Prysm v5

// ProcessSlots는 현재 상태를 목표 슬롯까지 전진시킨다.
// 각 슬롯마다 ProcessSlot → (에폭 경계 시 ProcessEpoch) → slot++ 를 반복한다.
func ProcessSlots(ctx context.Context, state state.BeaconState, slot primitives.Slot) (state.BeaconState, error) {
	if state.Slot() >= slot {
		return nil, fmt.Errorf("slot %d <= current %d", slot, state.Slot())
	}
	for state.Slot() < slot {
		// 1. 현재 슬롯의 상태 루트를 히스토리에 캐싱
		if err := ProcessSlot(ctx, state); err != nil {
			return nil, err
		}
		// 2. 에폭 경계 체크 (slot+1이 에폭 시작 슬롯인 경우)
		if slots.IsEpochStart(state.Slot() + 1) {
			state, err := ProcessEpochPrecompute(ctx, state)
			if err != nil {
				return nil, err
			}
		}
		// 3. 슬롯 증가
		if err := state.SetSlot(state.Slot() + 1); err != nil {
			return nil, err
		}
	}
	return state, nil
}

// ProcessSlot은 한 슬롯의 상태 루트를 캐싱하는 핵심 함수.
// 이전 블록 헤더의 상태 루트가 비어 있으면 현재 상태 루트로 채운다.
func ProcessSlot(ctx context.Context, state state.BeaconState) error {
	// 이전 상태 루트를 stateRoots 링 버퍼에 저장
	prevStateRoot, err := state.HashTreeRoot(ctx)
	if err != nil {
		return err
	}
	idx := state.Slot() % params.BeaconConfig().SlotsPerHistoricalRoot
	state.UpdateStateRootAtIndex(idx, prevStateRoot)

	// 이전 블록 루트도 blockRoots 링 버퍼에 캐싱
	prevBlockRoot := state.LatestBlockHeader().HashTreeRoot()
	state.UpdateBlockRootAtIndex(idx, prevBlockRoot)
	return nil
}
