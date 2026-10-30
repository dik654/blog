// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/blockchain/receive_block.go — 발췌

func (s *Service) validateExecutionAndConsensus(
	ctx context.Context,
	preState state.BeaconState,
	block blocks.ROBlock,
) (state.BeaconState, bool, error) {
	if block.Version() >= version.Gloas {
		postState, err := s.validateStateTransition(ctx, preState, block)
		if errors.Is(err, ErrNotDescendantOfFinalized) {
			return nil, false, invalidBlock{error: err, root: block.Root()}
		}
		if err != nil {
			return nil, false, errors.Wrap(err, "failed to validate consensus state transition function")
		}
		return postState, false, nil
	}

	preStateVersion, preStateHeader, err := getStateVersionAndPayload(preState)
	if err != nil {
		return nil, false, err
	}
	eg, _ := errgroup.WithContext(ctx)
	var postState state.BeaconState
	eg.Go(func() error {
		var err error
		postState, err = s.validateStateTransition(ctx, preState, block)
		if errors.Is(err, ErrNotDescendantOfFinalized) {
			return invalidBlock{error: err, root: block.Root()}
		}
		if err != nil {
			return errors.Wrap(err, "failed to validate consensus state transition function")
		}
		return nil
	})

	var isValidPayload bool
	eg.Go(func() error {
		var err error
		isValidPayload, err = s.validateExecutionOnBlock(ctx, preStateVersion, preStateHeader, block)
		if err != nil {
			return errors.Wrap(err, "could not notify the engine of the new payload")
		}
		return nil
	})

	if err := eg.Wait(); err != nil {
		return nil, false, err
	}
	return postState, isValidPayload, nil
}
