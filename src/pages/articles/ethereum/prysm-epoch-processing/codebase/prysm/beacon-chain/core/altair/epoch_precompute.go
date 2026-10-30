func ProcessRewardsAndPenaltiesPrecompute(
	beaconState state.BeaconState,
	bal *precompute.Balance,
	vals []precompute.Validator,
) (state.BeaconState, error) {
	// Don't process rewards and penalties in genesis epoch.
	cfg := params.BeaconConfig()
	if time.CurrentEpoch(beaconState) == cfg.GenesisEpoch {
		return beaconState, nil
	}

	numOfVals := beaconState.NumValidators()
	// Guard against an out-of-bounds using validator balance precompute.
	if len(vals) != numOfVals || len(vals) != beaconState.BalancesLength() {
		return beaconState, errors.New("validator registries not the same length as state's validator registries")
	}

	attDeltas, err := AttestationsDelta(beaconState, bal, vals)
	if err != nil {
		return nil, errors.Wrap(err, "could not get attestation delta")
	}

	balances := beaconState.Balances()
	for i := range numOfVals {
		vals[i].BeforeEpochTransitionBalance = balances[i]

		// Compute the post balance of the validator after accounting for the
		// attester and proposer rewards and penalties.
		delta := attDeltas[i]
		balances[i], err = helpers.IncreaseBalanceWithVal(balances[i], delta.HeadReward+delta.SourceReward+delta.TargetReward)
		if err != nil {
			return nil, err
		}
		balances[i] = helpers.DecreaseBalanceWithVal(balances[i], delta.SourcePenalty+delta.TargetPenalty+delta.InactivityPenalty)

		vals[i].AfterEpochTransitionBalance = balances[i]
	}

	if err := beaconState.SetBalances(balances); err != nil {
		return nil, errors.Wrap(err, "could not set validator balances")
	}

	return beaconState, nil
}
