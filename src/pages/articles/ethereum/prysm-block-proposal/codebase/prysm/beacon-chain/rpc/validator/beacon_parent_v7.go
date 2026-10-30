// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go — parent 선택 발췌

func (vs *Server) GetBeaconBlock(ctx context.Context, req *ethpb.BlockRequest) (*ethpb.GenericBeaconBlock, error) {
	if vs.SyncChecker.Syncing() {
		return nil, status.Error(codes.Unavailable, "Syncing to latest head, not ready to respond")
	}
	if slots.ToEpoch(req.Slot) >= params.BeaconConfig().BellatrixForkEpoch {
		if err := vs.optimisticStatus(ctx); err != nil {
			return nil, status.Errorf(codes.Unavailable, "Validator is not ready to propose: %v", err)
		}
	}

	head, parentRoot, full, err := vs.getParentState(ctx, req.Slot)
	if err != nil {
		return nil, err
	}
	sBlk, err := getEmptyBlock(req.Slot)
	if err != nil {
		return nil, err
	}
	sBlk.SetSlot(req.Slot)
	sBlk.SetGraffiti(req.Graffiti)
	sBlk.SetRandaoReveal(req.RandaoReveal)
	sBlk.SetParentRoot(parentRoot[:])

	idx, err := helpers.BeaconProposerIndex(ctx, head)
	if err != nil {
		return nil, err
	}
	sBlk.SetProposerIndex(idx)
	return vs.BuildBlockParallel(ctx, sBlk, head, req.SkipMevBoost, defaultBuilderBoostFactor, full, req.EagerPayloadStateRoot, req.BuilderConfig)
}

func (vs *Server) getParentState(ctx context.Context, slot primitives.Slot) (state.BeaconState, [32]byte, bool, error) {
	oldHeadRoot := vs.ForkchoiceFetcher.CachedHeadRoot()
	vs.ForkchoiceFetcher.UpdateHead(ctx, vs.TimeFetcher.CurrentSlot())
	headRoot := vs.ForkchoiceFetcher.CachedHeadRoot()
	parentRoot := vs.ForkchoiceFetcher.GetProposerHead()
	head, err := vs.getParentStateFromReorgData(ctx, slot, oldHeadRoot, parentRoot, headRoot)
	return head, parentRoot, vs.parentFull(parentRoot), err
}
