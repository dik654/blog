// ScoreNoLock is a lock-free version of Score.
func (s *Service) ScoreNoLock(pid peer.ID) float64 {
	score := float64(0)
	if _, ok := s.store.PeerData(pid); !ok {
		return 0
	}
	score += s.scorers.badResponsesScorer.scoreNoLock(pid) * s.scorerWeight(s.scorers.badResponsesScorer)
	score += s.scorers.blockProviderScorer.scoreNoLock(pid) * s.scorerWeight(s.scorers.blockProviderScorer)
	score += s.scorers.peerStatusScorer.scoreNoLock(pid) * s.scorerWeight(s.scorers.peerStatusScorer)
	score += s.scorers.gossipScorer.scoreNoLock(pid) * s.scorerWeight(s.scorers.gossipScorer)
	return math.Round(score*ScoreRoundingFactor) / ScoreRoundingFactor
}
