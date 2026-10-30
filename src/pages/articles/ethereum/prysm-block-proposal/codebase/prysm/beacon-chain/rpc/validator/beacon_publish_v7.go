// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go — publish 발췌

func (vs *Server) ProposeBeaconBlock(ctx context.Context, req *ethpb.GenericSignedBeaconBlock) (*ethpb.ProposeResponse, error) {
	if req == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty request")
	}
	block, err := blocks.NewSignedBeaconBlock(req.Block)
	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "decode block failed: %v", err)
	}
	root, err := block.Block().HashTreeRoot()
	if err != nil {
		return nil, err
	}

	rob, err := blocks.NewROBlockWithRoot(block, root)
	var blobSidecars []*ethpb.BlobSidecar
	var dataColumnSidecars []blocks.RODataColumn
	var partialColumns []blocks.PartialDataColumn
	if block.Version() >= version.Deneb && block.Version() < version.Gloas {
		blobSidecars, dataColumnSidecars, partialColumns, err = vs.handleUnblindedBlock(rob, req)
	}
	if err != nil {
		return nil, err
	}

	var wg sync.WaitGroup
	wg.Add(1)
	go func() {
		_ = vs.broadcastReceiveBlock(ctx, &wg, block, root)
	}()
	wg.Wait()

	if err := vs.broadcastAndReceiveSidecars(ctx, block, root, blobSidecars, dataColumnSidecars, partialColumns); err != nil {
		return nil, err
	}
	return &ethpb.ProposeResponse{BlockRoot: root[:]}, nil
}
