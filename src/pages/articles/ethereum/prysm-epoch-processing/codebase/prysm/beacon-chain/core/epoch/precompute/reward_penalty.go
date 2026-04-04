// beacon-chain/core/epoch/precompute/reward_penalty.go — Prysm v5

// AttestingBalance는 특정 체크포인트에 투표한 검증자들의 총 잔액을 반환한다.
func AttestingBalance(state state.ReadOnlyBeaconState, checkpoint *ethpb.Checkpoint) uint64 {
	var total uint64
	for _, v := range state.Validators() {
		if v.Slashed {
			continue
		}
		if hasAttestedToTarget(v, checkpoint) {
			total += v.EffectiveBalance
		}
	}
	return total
}

// ProcessRewardsAndPenalties는 각 검증자의 어테스테이션 참여도에 따라
// 보상 또는 패널티를 적용한다.
func ProcessRewardsAndPenalties(ctx context.Context, state state.BeaconState) (state.BeaconState, error) {
	if helpers.CurrentEpoch(state) == 0 {
		return state, nil // 제네시스 에폭은 보상/패널티 없음
	}
	bp, vp, err := New(ctx, state) // 사전 계산
	if err != nil {
		return nil, err
	}
	// 각 검증자에 대해 보상/패널티 계산
	rewards, penalties, err := AttestationsDelta(state, bp, vp)
	if err != nil {
		return nil, err
	}
	for i, val := range state.Validators() {
		newBal := state.Balances()[i] + rewards[i] - penalties[i]
		if newBal > val.EffectiveBalance+params.BeaconConfig().MaxEffectiveBalance {
			newBal = val.EffectiveBalance + params.BeaconConfig().MaxEffectiveBalance
		}
		state.UpdateBalanceAtIndex(primitives.ValidatorIndex(i), newBal)
	}
	return state, nil
}
