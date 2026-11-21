// IsBadPeerNoLock is a lock-free version of IsBadPeer.
func (s *Service) IsBadPeerNoLock(pid peer.ID) error {
	if err := s.scorers.badResponsesScorer.isBadPeerNoLock(pid); err != nil {
		return errors.Wrap(err, "bad responses scorer")
	}

	if err := s.scorers.peerStatusScorer.isBadPeerNoLock(pid); err != nil {
		return errors.Wrap(err, "peer status scorer")
	}

	if features.Get().EnablePeerScorer {
		if err := s.scorers.gossipScorer.isBadPeerNoLock(pid); err != nil {
			return errors.Wrap(err, "gossip scorer")
		}
	}

	return nil
}
