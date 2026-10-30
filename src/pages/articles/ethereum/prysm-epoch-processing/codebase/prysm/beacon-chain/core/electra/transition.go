func ProcessEpoch(ctx context.Context, state state.BeaconState) error {
	ctx, span := trace.StartSpan(ctx, "electra.ProcessEpoch")
	defer span.End()

	if state == nil || state.IsNil() {
		return errors.New("nil state")
	}
	vp, bp, err := InitializePrecomputeValidators(ctx, state)
	if err != nil {
		return err
	}
	vp, bp, err = ProcessEpochParticipation(ctx, state, bp, vp)
	if err != nil {
		return err
	}
	state, err = precompute.ProcessJustificationAndFinalizationPreCompute(state, bp)
	if err != nil {
		return errors.Wrap(err, "could not process justification")
	}
	state, vp, err = ProcessInactivityScores(ctx, state, vp)
	if err != nil {
		return errors.Wrap(err, "could not process inactivity updates")
	}
	state, err = ProcessRewardsAndPenaltiesPrecompute(state, bp, vp)
	if err != nil {
		return errors.Wrap(err, "could not process rewards and penalties")
	}
	if err := ProcessRegistryUpdates(ctx, state); err != nil {
		return errors.Wrap(err, "could not process registry updates")
	}
	if err := ProcessSlashings(ctx, state); err != nil {
		return err
	}
	state, err = ProcessEth1DataReset(state)
	if err != nil {
		return err
	}
	if err = ProcessPendingDeposits(ctx, state, primitives.Gwei(bp.ActiveCurrentEpoch)); err != nil {
		return err
	}
	if err = ProcessPendingConsolidations(ctx, state); err != nil {
		return err
	}
	if err = ProcessEffectiveBalanceUpdates(state); err != nil {
		return err
	}
	state, err = ProcessSlashingsReset(state)
	if err != nil {
		return err
	}
	state, err = ProcessRandaoMixesReset(state)
	if err != nil {
		return err
	}
	state, err = ProcessHistoricalDataUpdate(state)
	if err != nil {
		return err
	}
	state, err = ProcessParticipationFlagUpdates(state)
	if err != nil {
		return err
	}
	_, err = ProcessSyncCommitteeUpdates(ctx, state)
	if err != nil {
		return err
	}
	return nil
}
