// beacon-chain/core/blocks/block_operations.go — Prysm v5

// ProcessOperations는 블록에 포함된 모든 오퍼레이션을 순차 처리한다.
// attestation, deposit, voluntary exit, slashing 등을 상태에 반영한다.
func ProcessOperations(ctx context.Context, state state.BeaconState, block interfaces.ReadOnlyBeaconBlock) (state.BeaconState, error) {
	body := block.Body()

	// 1. ProposerSlashing 처리
	for _, slashing := range body.ProposerSlashings() {
		state, err := ProcessProposerSlashing(ctx, state, slashing)
		if err != nil {
			return nil, err
		}
	}
	// 2. AttesterSlashing 처리
	for _, slashing := range body.AttesterSlashings() {
		state, err := ProcessAttesterSlashing(ctx, state, slashing)
		if err != nil {
			return nil, err
		}
	}
	// 3. Attestation 처리
	for _, att := range body.Attestations() {
		state, err := ProcessAttestation(ctx, state, att)
		if err != nil {
			return nil, err
		}
	}
	// 4. Deposit 처리 (새 검증자 등록)
	for _, deposit := range body.Deposits() {
		state, err := ProcessDeposit(ctx, state, deposit)
		if err != nil {
			return nil, err
		}
	}
	// 5. VoluntaryExit 처리
	for _, exit := range body.VoluntaryExits() {
		state, err := ProcessVoluntaryExit(ctx, state, exit)
		if err != nil {
			return nil, err
		}
	}
	return state, nil
}
