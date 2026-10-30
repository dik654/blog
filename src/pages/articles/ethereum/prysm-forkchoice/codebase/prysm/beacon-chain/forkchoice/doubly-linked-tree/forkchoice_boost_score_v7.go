// applyProposerBoostScore applies the current proposer boost scores to the
// relevant nodes.
func (f *ForkChoice) applyProposerBoostScore() error {
	s := f.store
	proposerScore := uint64(0)
	s.removePreviousProposerBoost()
	if s.shouldApplyProposerBoost() {
		proposerScore = s.applyNewProposerBoost()
	}
	s.previousProposerBoostRoot = s.proposerBoostRoot
	s.previousProposerBoostScore = proposerScore
	return nil
}

// applyNewProposerBoost applies the new proposer boost and returns the new proposer boost score.
func (s *Store) applyNewProposerBoost() uint64 {
	if s.proposerBoostRoot == params.BeaconConfig().ZeroHash {
		return 0
	}
	currentNode, ok := s.emptyNodeByRoot[s.proposerBoostRoot]
	if !ok || currentNode == nil {
		log.WithError(errInvalidProposerBoostRoot).Errorf("invalid current root %#x", s.proposerBoostRoot)
		return 0
	}
	proposerScore := (s.committeeWeight * params.BeaconConfig().ProposerScoreBoost) / 100
	currentNode.node.balance += proposerScore
	return proposerScore
}
