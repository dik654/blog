// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/core/transition/electra.go — 발췌

func electraOperations(
	ctx context.Context,
	st state.BeaconState,
	block interfaces.ReadOnlyBeaconBlock,
) (state.BeaconState, error) {
	bb := block.Body()
	var exitInfo *v.ExitInfo
	hasSlashings := len(bb.ProposerSlashings()) > 0 || len(bb.AttesterSlashings()) > 0
	hasExits := len(bb.VoluntaryExits()) > 0
	if hasSlashings || hasExits {
		exitInfo = v.ExitInformation(st)
		if err := helpers.UpdateTotalActiveBalanceCache(ctx, st, exitInfo.TotalActiveBalance); err != nil {
			return nil, errors.Wrap(err, "could not update total active balance cache")
		}
	}

	st, err := blocks.ProcessProposerSlashings(ctx, st, bb.ProposerSlashings(), exitInfo)
	if err != nil {
		return nil, errors.Wrap(ErrProcessProposerSlashingsFailed, err.Error())
	}
	st, err = blocks.ProcessAttesterSlashings(ctx, st, bb.AttesterSlashings(), exitInfo)
	if err != nil {
		return nil, errors.Wrap(ErrProcessAttesterSlashingsFailed, err.Error())
	}
	st, err = electra.ProcessAttestationsNoVerifySignature(ctx, st, block)
	if err != nil {
		return nil, errors.Wrap(ErrProcessAttestationsFailed, err.Error())
	}
	if _, err := electra.ProcessDeposits(ctx, st, bb.Deposits()); err != nil {
		return nil, errors.Wrap(ErrProcessDepositsFailed, err.Error())
	}
	st, err = blocks.ProcessVoluntaryExits(ctx, st, bb.VoluntaryExits(), exitInfo)
	if err != nil {
		return nil, errors.Wrap(ErrProcessVoluntaryExitsFailed, err.Error())
	}
	st, err = blocks.ProcessBLSToExecutionChanges(st, block)
	if err != nil {
		return nil, errors.Wrap(ErrProcessBLSChangesFailed, err.Error())
	}

	requests, err := bb.ExecutionRequests()
	if err != nil {
		return nil, electra.NewExecReqError(errors.Wrap(err, "could not get execution requests").Error())
	}
	st, err = coreRequests.ProcessDepositRequests(ctx, st, requests.Deposits)
	if err != nil {
		return nil, electra.NewExecReqError(errors.Wrap(err, "could not process deposit requests").Error())
	}
	st, err = coreRequests.ProcessWithdrawalRequests(ctx, st, requests.Withdrawals)
	if err != nil {
		return nil, electra.NewExecReqError(errors.Wrap(err, "could not process withdrawal requests").Error())
	}
	if err := coreRequests.ProcessConsolidationRequests(ctx, st, requests.Consolidations); err != nil {
		return nil, electra.NewExecReqError(errors.Wrap(err, "could not process consolidation requests").Error())
	}
	return st, nil
}
