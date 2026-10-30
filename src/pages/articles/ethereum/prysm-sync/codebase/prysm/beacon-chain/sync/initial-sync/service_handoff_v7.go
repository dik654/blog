func (s *Service) Start() {
	// Clock, verification initializer, genesis and peer setup are above this excerpt.
	currentSlot := s.clock.CurrentSlot()
	if s.cfg.Chain.HeadSlot() >= currentSlot {
		log.Info("Already synced to the current chain head")
		s.markSynced()
		return
	}

	peers, err := s.waitForMinimumPeers()
	if err != nil {
		log.WithError(err).Error("Error waiting for minimum number of peers")
		return
	}

	if err := s.fetchOriginSidecars(peers); err != nil {
		log.WithError(err).Error("Error fetching origin sidecars")
		return
	}
	if err := s.roundRobinSync(); err != nil {
		if errors.Is(s.ctx.Err(), context.Canceled) {
			return
		}
		panic(err)
	}
	log.WithField("slot", s.cfg.Chain.HeadSlot()).Info("Synced up to")
	s.markSynced()
}

func (s *Service) markSynced() {
	s.synced.Store(true)
	close(s.cfg.InitialSyncComplete)
}
