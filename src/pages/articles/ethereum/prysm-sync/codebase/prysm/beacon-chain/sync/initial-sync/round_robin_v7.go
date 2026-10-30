func (s *Service) roundRobinSync() error {
	ctx, cancel := context.WithCancel(s.ctx)
	defer cancel()
	transition.SkipSlotCache.Disable()
	defer transition.SkipSlotCache.Enable()

	s.counter = ratecounter.NewRateCounter(counterSeconds * time.Second)

	// Step 1 - Sync to end of finalized epoch.
	if err := s.syncToFinalizedEpoch(ctx); err != nil {
		return err
	}

	// Already at head, no need for 2nd phase.
	if s.cfg.Chain.HeadSlot() == slots.CurrentSlot(s.genesisTime) {
		return nil
	}

	// Step 2 - sync to head from majority of peers (from no less than MinimumSyncPeers*2 peers)
	// having the same world view on non-finalized epoch.
	return s.syncToNonFinalizedEpoch(ctx)
}

func (s *Service) syncToFinalizedEpoch(ctx context.Context) error {
	highestFinalizedSlot, err := slots.EpochStart(s.highestFinalizedEpoch())
	if err != nil {
		return err
	}
	if s.cfg.Chain.HeadSlot() >= highestFinalizedSlot {
		return nil
	}

	queue, err := s.startBlocksQueue(ctx, highestFinalizedSlot, modeStopOnFinalizedEpoch)
	if err != nil {
		return err
	}

	for data := range queue.fetchedData {
		s.processFetchedData(ctx, data)
	}
	if err := queue.stop(); err != nil {
		log.WithError(err).Debug("Error stopping queue")
	}
	return nil
}

func (s *Service) syncToNonFinalizedEpoch(ctx context.Context) error {
	queue, err := s.startBlocksQueue(ctx, slots.CurrentSlot(s.genesisTime), modeNonConstrained)
	if err != nil {
		return err
	}
	for data := range queue.fetchedData {
		count, err := s.processFetchedDataRegSync(ctx, data)
		s.updatePeerScorerStats(data, count, err)
	}
	if err := queue.stop(); err != nil {
		log.WithError(err).Debug("Error stopping queue")
	}
	return nil
}
