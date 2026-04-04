// beacon-chain/p2p/peers/scorers/service.go — Prysm v5.x

// Score returns the overall score for a given peer.
func (s *Service) Score(pid peer.ID) float64 {
	s.store.RLock()
	defer s.store.RUnlock()

	score := float64(0)
	// Gossipsub topic score
	score += s.gossipScorer.Score(pid)
	// Block provider score (delivery speed & accuracy)
	score += s.blockProviderScorer.Score(pid)
	// Peer status score (chain head, finalized epoch)
	score += s.peerStatusScorer.Score(pid)
	// Bad response penalty
	score += s.badResponsesScorer.Score(pid)

	return score
}

// Decay reduces scores over time (exponential decay).
func (s *Service) Decay() {
	s.store.Lock()
	defer s.store.Unlock()
	for _, scorer := range s.scorers {
		scorer.Decay()
	}
}
