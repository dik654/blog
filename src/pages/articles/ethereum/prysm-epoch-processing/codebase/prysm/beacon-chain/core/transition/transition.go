func ProcessEpoch(ctx context.Context, state state.BeaconState) (state.BeaconState, error) {
	ctx, span := prysmTrace.StartSpan(ctx, "core.state.ProcessEpoch")
	defer span.End()

	var err error
	if time.CanProcessEpoch(state) {
		if state.Version() >= version.Gloas {
			if err = processEpochGloas(ctx, state); err != nil {
				return nil, errors.Wrap(err, fmt.Sprintf("could not process %s epoch", version.String(state.Version())))
			}
		} else if state.Version() >= version.Fulu {
			if err = fulu.ProcessEpoch(ctx, state); err != nil {
				return nil, errors.Wrap(err, fmt.Sprintf("could not process %s epoch", version.String(state.Version())))
			}
		} else if state.Version() >= version.Electra {
			if err = electra.ProcessEpoch(ctx, state); err != nil {
				return nil, errors.Wrap(err, fmt.Sprintf("could not process %s epoch", version.String(state.Version())))
			}
		} else if state.Version() >= version.Altair {
			if err = altair.ProcessEpoch(ctx, state); err != nil {
				return nil, errors.Wrap(err, fmt.Sprintf("could not process %s epoch", version.String(state.Version())))
			}
		} else {
			state, err = ProcessEpochPrecompute(ctx, state)
			if err != nil {
				return nil, errors.Wrap(err, "could not process epoch with optimizations")
			}
		}
	}
	return state, err
}
