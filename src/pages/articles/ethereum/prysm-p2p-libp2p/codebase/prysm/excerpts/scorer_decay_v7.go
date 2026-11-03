// Decay reduces the bad responses of all peers, giving reformed peers a chance to join the network.
// This can be run periodically, although note that each time it runs it does give all bad peers another chance as well
// to clog up the network with bad responses, so should not be run too frequently; once an hour would be reasonable.
func (s *BadResponsesScorer) Decay() {
	s.store.Lock()
	defer s.store.Unlock()

	for _, peerData := range s.store.Peers() {
		if peerData.BadResponses > 0 {
			peerData.BadResponses--
		}
	}
}
