func NewService(ctx context.Context, store *peerdata.Store, config *Config) *Service {
	s := &Service{
		store:   store,
		weights: make(map[Scorer]float64),
	}

	// Register scorers.
	s.scorers.badResponsesScorer = newBadResponsesScorer(store, config.BadResponsesScorerConfig)
	s.setScorerWeight(s.scorers.badResponsesScorer, 0.3)
	s.scorers.blockProviderScorer = newBlockProviderScorer(store, config.BlockProviderScorerConfig)
	s.setScorerWeight(s.scorers.blockProviderScorer, 0.0)
	s.scorers.peerStatusScorer = newPeerStatusScorer(store, config.PeerStatusScorerConfig)
	s.setScorerWeight(s.scorers.peerStatusScorer, 0.3)
	s.scorers.gossipScorer = newGossipScorer(store, config.GossipScorerConfig)
	s.setScorerWeight(s.scorers.gossipScorer, 0.4)

	// Start background tasks.
	go s.loop(ctx)

	return s
}
