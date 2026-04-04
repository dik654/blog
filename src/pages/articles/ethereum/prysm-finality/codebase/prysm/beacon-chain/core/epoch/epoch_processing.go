// beacon-chain/core/epoch/epoch_processing.go (Prysm v5)

// ProcessJustificationAndFinalization — 에폭 전환 시 호출.
// 이전/현재 에폭의 투표 비율을 확인하여 justified/finalized를 갱신한다.
func ProcessJustificationAndFinalization(
	state state.BeaconState,
	prevEpochTargetBalance, currEpochTargetBalance uint64,
) (state.BeaconState, error) {
	totalBalance := helpers.TotalActiveBalance(state)
	// 2/3 (슈퍼마조리티) 임계값
	threshold := totalBalance * 2 / 3

	// 이전 에폭 투표가 2/3 이상이면 이전 에폭을 justified
	if prevEpochTargetBalance >= threshold {
		state.SetCurrentJustifiedCheckpoint(
			state.PreviousJustifiedCheckpoint(),
		)
	}
	// 현재 에폭 투표가 2/3 이상이면 현재 에폭을 justified
	if currEpochTargetBalance >= threshold {
		state.SetCurrentJustifiedCheckpoint(
			&ethpb.Checkpoint{Epoch: currentEpoch, Root: blockRoot},
		)
	}

	// Finalization 규칙:
	// 연속 2 에폭이 justified되면 이전 justified가 finalized
	justifiedEpoch := state.CurrentJustifiedCheckpoint().Epoch
	if justifiedEpoch+1 == currentEpoch {
		state.SetFinalizedCheckpoint(state.CurrentJustifiedCheckpoint())
	}
	return state, nil
}
