// beacon-chain/sync/rpc_beacon_blocks_by_range.go — Prysm v5.x

// beaconBlocksByRangeRPCHandler handles BlocksByRange RPC requests.
func (s *Service) beaconBlocksByRangeRPCHandler(
	ctx context.Context, msg interface{}, stream libp2pcore.Stream,
) error {
	req, ok := msg.(*pb.BeaconBlocksByRangeRequest)
	if !ok {
		return errors.New("invalid request type")
	}

	// Validate request parameters
	if err := s.validateRangeRequest(req); err != nil {
		s.writeErrorResponseToStream(stream, err)
		return err
	}

	// Stream blocks from DB one by one
	for slot := req.StartSlot; slot < req.StartSlot+req.Count*req.Step; slot += req.Step {
		blk, err := s.cfg.BeaconDB.Block(ctx, slot)
		if err != nil || blk == nil {
			continue
		}
		if err := s.chunkBlockWriter(stream, blk); err != nil {
			return err
		}
	}

	// Close stream
	closeStream(stream)
	return nil
}
