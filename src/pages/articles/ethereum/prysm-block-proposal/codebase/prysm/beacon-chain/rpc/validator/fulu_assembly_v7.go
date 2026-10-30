// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go — Fulu 조립 발췌

func (vs *Server) setPreGloasConsensusFields(ctx context.Context, sBlk interfaces.SignedBeaconBlock, head state.BeaconState) {
	eth1Data, err := vs.eth1DataMajorityVote(ctx, head)
	if err != nil {
		eth1Data = &ethpb.Eth1Data{DepositRoot: params.BeaconConfig().ZeroHash[:], BlockHash: params.BeaconConfig().ZeroHash[:]}
	}
	sBlk.SetEth1Data(eth1Data)

	deposits, atts, err := vs.packDepositsAndAttestations(ctx, head, sBlk.Block().Slot(), eth1Data)
	if err != nil {
		sBlk.SetDeposits([]*ethpb.Deposit{})
		_ = sBlk.SetAttestations([]ethpb.Att{})
	} else {
		sBlk.SetDeposits(deposits)
		_ = sBlk.SetAttestations(atts)
	}

	validProposerSlashings, validAttSlashings := vs.getSlashings(ctx, head)
	sBlk.SetProposerSlashings(validProposerSlashings)
	_ = sBlk.SetAttesterSlashings(validAttSlashings)
	sBlk.SetVoluntaryExits(vs.getExits(head, sBlk.Block().Slot()))
	vs.setSyncAggregate(ctx, sBlk, head)
	vs.setBlsToExecData(sBlk, head)
}

func (vs *Server) buildBlockFulu(ctx context.Context, sBlk interfaces.SignedBeaconBlock, head state.BeaconState, skipMevBoost bool, builderBoostFactor primitives.Gwei, parentFull bool) (*ethpb.GenericBeaconBlock, error) {
	var wg sync.WaitGroup
	wg.Go(func() { vs.setPreGloasConsensusFields(ctx, sBlk, head) })

	local, err := vs.getLocalPayload(ctx, sBlk.Block(), head, parentFull)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Could not get local payload: %v", err)
	}

	var builderBid builderapi.Bid
	if !(local.OverrideBuilder || skipMevBoost) {
		latestHeader, err := head.LatestExecutionPayloadHeader()
		if err != nil {
			return nil, err
		}
		builderBid, err = vs.getBuilderPayloadAndBlobs(ctx, sBlk.Block().Slot(), sBlk.Block().ProposerIndex(), latestHeader.GasLimit())
		if err != nil {
			log.WithError(err).Error("Could not get builder payload")
		}
	}

	winningBid, bundle, err := setExecutionData(ctx, sBlk, local, builderBid, builderBoostFactor)
	if err != nil {
		return nil, err
	}
	wg.Wait()

	sr, _, err := vs.computePostBlockStateAndRoot(ctx, sBlk)
	if err != nil {
		return nil, err
	}
	sBlk.SetStateRoot(sr)
	return vs.constructGenericBeaconBlock(sBlk, bundle, winningBid)
}
