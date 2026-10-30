// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go — state root 계산 발췌

func (vs *Server) computePostBlockStateAndRoot(ctx context.Context, block interfaces.SignedBeaconBlock) ([]byte, state.BeaconState, error) {
	st, err := vs.computePostBlockState(ctx, block)
	if err != nil {
		return nil, nil, err
	}
	root, err := st.HashTreeRoot(ctx)
	if err != nil {
		return nil, nil, errors.Wrap(err, "could not compute state root")
	}
	return root[:], st, nil
}

func (vs *Server) computePostBlockState(ctx context.Context, block interfaces.SignedBeaconBlock) (state.BeaconState, error) {
	roblock, err := blocks.NewROBlockWithRoot(block, [32]byte{})
	if err != nil {
		return nil, errors.Wrap(err, "could not create ROBlock")
	}
	beaconState, err := vs.StateGen.StateByRoot(ctx, roblock.Block().ParentRoot())
	if err != nil {
		return nil, errors.Wrapf(err, "could not get pre state for slot %d", roblock.Block().Slot())
	}
	st, err := transition.CalculatePostState(ctx, beaconState, block)
	if err != nil {
		return vs.handlePostBlockStateError(ctx, block, err)
	}
	return st, nil
}

type computeStateRootAttemptsKeyType string

const (
	computeStateRootAttemptsKey = computeStateRootAttemptsKeyType("compute-state-root-attempts")
	maxComputeStateRootAttempts = 3
)

func (vs *Server) handlePostBlockStateError(ctx context.Context, block interfaces.SignedBeaconBlock, err error) (state.BeaconState, error) {
	if ctx.Err() != nil {
		return nil, status.Errorf(codes.Canceled, "context error: %v", ctx.Err())
	}
	switch {
	case errors.Is(err, transition.ErrAttestationsSignatureInvalid),
		errors.Is(err, transition.ErrProcessAttestationsFailed):
		_ = block.SetAttestations([]ethpb.Att{})
	case errors.Is(err, transition.ErrProcessBLSChangesFailed),
		errors.Is(err, transition.ErrBLSToExecutionChangesSignatureInvalid):
		_ = block.SetBLSToExecutionChanges([]*ethpb.SignedBLSToExecutionChange{})
	default:
		return nil, errors.Wrap(err, "could not compute state root")
	}

	// 오류가 난 pool operation을 제거하고 다시 계산하되,
	// 깊은 재귀를 막기 위해 시도 횟수를 최대 3회로 제한한다.
	if attempts, ok := ctx.Value(computeStateRootAttemptsKey).(int); !ok {
		ctx = context.WithValue(ctx, computeStateRootAttemptsKey, 1)
	} else if attempts >= maxComputeStateRootAttempts {
		return nil, fmt.Errorf("attempted max compute state root attempts %d", maxComputeStateRootAttempts)
	} else {
		ctx = context.WithValue(ctx, computeStateRootAttemptsKey, attempts+1)
	}
	return vs.computePostBlockState(ctx, block)
}
