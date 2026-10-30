// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/core/transition/transition_no_verify_sig.go — 발췌

func ExecuteStateTransitionNoVerifyAnySig(
	ctx context.Context,
	st state.BeaconState,
	signed interfaces.ReadOnlySignedBeaconBlock,
) (*bls.SignatureBatch, state.BeaconState, error) {
	if ctx.Err() != nil {
		return nil, nil, ctx.Err()
	}
	if signed == nil || signed.IsNil() || signed.Block().IsNil() {
		return nil, nil, errors.New("nil block")
	}

	parentRoot := signed.Block().ParentRoot()
	st, err := ProcessSlotsUsingNextSlotCache(ctx, st, parentRoot[:], signed.Block().Slot())
	if err != nil {
		return nil, nil, errors.Wrap(err, "could not process slots")
	}

	sigSlice, st, err := ProcessBlockNoVerifyAnySig(ctx, st, signed)
	if err != nil {
		return nil, nil, errors.Wrap(err, "could not process block")
	}
	set := sigSlice.Batch()

	postStateRoot, err := st.HashTreeRoot(ctx)
	if err != nil {
		return nil, nil, err
	}
	stateRoot := signed.Block().StateRoot()
	if !bytes.Equal(postStateRoot[:], stateRoot[:]) {
		return nil, nil, fmt.Errorf(
			"could not validate state root, wanted: %#x, received: %#x",
			postStateRoot[:], signed.Block().StateRoot(),
		)
	}

	return set, st, nil
}

func ProcessBlockForStateRoot(
	ctx context.Context,
	state state.BeaconState,
	signed interfaces.ReadOnlySignedBeaconBlock,
) (state.BeaconState, error) {
	blk := signed.Block()
	body := blk.Body()
	parentSlot := state.LatestBlockHeader().Slot

	bodyRoot, err := body.HashTreeRoot()
	if err != nil {
		return nil, errors.Wrap(err, "could not hash tree root beacon block body")
	}
	parentRoot := blk.ParentRoot()
	state, err = b.ProcessBlockHeaderNoVerify(
		ctx, state, blk.Slot(), blk.ProposerIndex(), parentRoot[:], bodyRoot[:],
	)
	if err != nil {
		return nil, errors.Wrap(err, "could not process block header")
	}

	enabled, err := b.IsExecutionEnabled(state, blk.Body())
	if err != nil {
		return nil, errors.Wrap(err, "could not check if execution is enabled")
	}
	if enabled {
		executionData, err := blk.Body().Execution()
		if err != nil {
			return nil, err
		}
		if state.Version() >= version.Capella {
			state, err = b.ProcessWithdrawals(state, executionData)
			if err != nil {
				return nil, errors.Wrap(ErrProcessWithdrawalsFailed, err.Error())
			}
		}
		if err = b.ProcessPayload(state, blk.Body()); err != nil {
			return nil, errors.Wrap(err, "could not process execution data")
		}
	}

	randaoReveal := signed.Block().Body().RandaoReveal()
	state, err = b.ProcessRandaoNoVerify(state, randaoReveal[:])
	if err != nil {
		return nil, errors.Wrap(ErrProcessRandaoFailed, err.Error())
	}

	state, err = b.ProcessEth1DataInBlock(ctx, state, signed.Block().Body().Eth1Data())
	if err != nil {
		return nil, errors.Wrap(ErrProcessEth1DataFailed, err.Error())
	}

	state, err = ProcessOperationsNoVerifyAttsSigs(ctx, state, signed.Block(), parentSlot)
	if err != nil {
		return nil, errors.Wrap(err, "could not process block operation")
	}

	if signed.Block().Version() == version.Phase0 {
		return state, nil
	}
	sa, err := signed.Block().Body().SyncAggregate()
	if err != nil {
		return nil, errors.Wrap(err, "could not get sync aggregate from block")
	}
	state, _, err = altair.ProcessSyncAggregate(ctx, state, sa)
	if err != nil {
		return nil, errors.Wrap(ErrProcessSyncAggregateFailed, err.Error())
	}
	return state, nil
}
