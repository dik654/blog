// filterPeer validates each node that we retrieve from our dht. We
// try to ascertain that the peer can be a valid protocol peer.
// Validity Conditions:
//  1. Peer has a valid IP and a (QUIC and/or TCP) port set in their enr.
//  2. Peer hasn't been marked as 'bad'.
//  3. Peer is not currently active or connected.
//  4. Peer is ready to receive incoming connections.
//  5. Peer's fork digest in their ENR matches that of our localnodes.
func (s *Service) filterPeer(node *enode.Node) bool {
	// Ignore nil node entries passed in.
	if node == nil {
		return false
	}

	// Ignore nodes with no IP address stored.
	if node.IP() == nil {
		return false
	}

	peerData, multiAddrs, err := convertToAddrInfo(node)
	if err != nil {
		log.WithError(err).WithField("node", node.String()).Debug("Could not convert to peer data")
		return false
	}

	if peerData == nil || len(multiAddrs) == 0 {
		return false
	}

	// Ignore bad nodes.
	if s.peers.IsBad(peerData.ID) != nil {
		return false
	}

	// Ignore nodes that are already active.
	if s.peers.IsActive(peerData.ID) {
		// Constantly update enr for known peers
		s.peers.UpdateENR(node.Record(), peerData.ID)
		return false
	}

	// Ignore nodes that are already connected.
	if s.host.Network().Connectedness(peerData.ID) == network.Connected {
		return false
	}

	// Ignore nodes that are not ready to receive incoming connections.
	if !s.peers.IsReadyToDial(peerData.ID) {
		return false
	}

	// Ignore nodes that don't match our fork digest.
	nodeENR := node.Record()
	if s.genesisValidatorsRoot != nil {
		if err := compareForkENR(s.dv5Listener.LocalNode().Node().Record(), nodeENR); err != nil {
			log.WithError(err).Trace("Fork ENR mismatches between peer and local node")
			return false
		}
	}

	// If the peer has 2 multiaddrs, favor the QUIC address, which is in first position.
	multiAddr := multiAddrs[0]

	// Add peer to peer handler.
	s.peers.Add(nodeENR, peerData.ID, multiAddr, network.DirUnknown)

	return true
}
