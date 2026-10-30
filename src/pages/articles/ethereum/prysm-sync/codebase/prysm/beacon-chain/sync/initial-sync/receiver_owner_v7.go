func (s *Service) processFetchedData(ctx context.Context, data *blocksQueueFetchedData) {
	if err := s.saveCarriedColumns(data); err != nil {
		log.WithError(err).Warn("Failed to save carried data column sidecars")
	}
	// Use Batch Block Verify to process and verify batches directly.
	count, err := s.processBatchedBlocks(ctx, data.bwb, data.envelopes, s.cfg.Chain.ReceiveBlockBatch)
	if err != nil {
		log.WithError(err).Warn("Skip processing batched blocks")
	}
	s.updatePeerScorerStats(data, count, err)
}

func (s *Service) processBlock(
	ctx context.Context,
	genesis time.Time,
	bwb blocks.BlockWithROSidecars,
	blockReceiver blockReceiverFn,
	avs das.AvailabilityChecker,
) error {
	blk := bwb.Block
	blkRoot := blk.Root()
	s.logSyncStatus(genesis, blk.Block(), blkRoot)
	if !s.cfg.Chain.HasBlock(ctx, blk.Block().ParentRoot()) && !features.Get().EnableGloas {
		return fmt.Errorf("%w: (in processBlock, slot=%d) %#x", errParentDoesNotExist, blk.Block().Slot(), blk.Block().ParentRoot())
	}
	return blockReceiver(ctx, blk, blkRoot, avs)
}
