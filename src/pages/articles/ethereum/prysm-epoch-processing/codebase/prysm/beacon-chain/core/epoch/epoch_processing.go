// beacon-chain/core/epoch/epoch_processing.go — Prysm v5

// ProcessEpoch은 에폭 경계에서 실행되는 모든 상태 전이를 수행한다.
// 보상/패널티, 레지스트리, 슬래싱, 유효 잔액 등을 순차 처리한다.
func ProcessEpoch(ctx context.Context, state state.BeaconState) (state.BeaconState, error) {
	// 1. Justification & Finalization
	state, err := ProcessJustificationAndFinalization(ctx, state)
	if err != nil {
		return nil, err
	}
	// 2. Inactivity Scores (Altair+)
	state, err = ProcessInactivityScores(ctx, state)
	if err != nil {
		return nil, err
	}
	// 3. Rewards & Penalties
	state, err = ProcessRewardsAndPenalties(ctx, state)
	if err != nil {
		return nil, err
	}
	// 4. Registry Updates (활성화 큐, 이탈 큐)
	state, err = ProcessRegistryUpdates(ctx, state)
	if err != nil {
		return nil, err
	}
	// 5. Slashings (슬래싱된 검증자 잔액 차감)
	state, err = ProcessSlashings(ctx, state)
	if err != nil {
		return nil, err
	}
	// 6. Effective Balance Updates
	state, err = ProcessEffectiveBalanceUpdates(ctx, state)
	if err != nil {
		return nil, err
	}
	// 7. RANDAO Mix 갱신 + Historical Roots 추가
	state, err = ProcessFinalUpdates(ctx, state)
	if err != nil {
		return nil, err
	}
	return state, nil
}

// ProcessJustificationAndFinalization은 이전/현재 에폭의 투표 비율로
// 체크포인트를 justified/finalized 상태로 전환한다.
func ProcessJustificationAndFinalization(ctx context.Context, state state.BeaconState) (state.BeaconState, error) {
	totalBalance := helpers.TotalActiveBalance(state)
	prevTarget := precompute.AttestingBalance(state, state.PreviousJustifiedCheckpoint())
	currTarget := precompute.AttestingBalance(state, state.CurrentJustifiedCheckpoint())
	// 2/3 슈퍼 매저리티 체크
	if prevTarget*3 >= totalBalance*2 {
		state.SetPreviousJustifiedCheckpoint(state.CurrentJustifiedCheckpoint())
	}
	return state, nil
}
