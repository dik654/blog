// beacon-chain/p2p/service.go — Prysm v5.x

// Start begins the p2p networking service.
func (s *Service) Start() {
	s.isPreGenesis = false
	s.cfg.StateNotifier.StateFeed().Subscribe(s.stateNotifier)

	// Initialize Discv5 for peer discovery
	listener, err := s.startDiscoveryV5(s.cfg.UDPAddress)
	if err != nil {
		log.WithError(err).Fatal("Could not start discovery")
	}
	s.dv5Listener = listener

	// Start libp2p host with noise transport
	s.host, err = libp2p.New(
		libp2p.ListenAddrs(s.cfg.TCPAddress),
		libp2p.Security(noise.ID, noise.New),
		libp2p.Muxer("/mplex/6.7.0", mplex.DefaultTransport),
		libp2p.ConnectionGater(s.connectionGater),
		libp2p.UserAgent("Prysm/" + version.Version()),
	)

	// Register RPC handlers & subscribe gossip topics
	s.registerRPCHandlers()
	s.subscribeToPersistentTopics()

	// Start peer scoring & pruning loop
	go s.peerManager()
}

// initDiscoveryV5 creates a Discv5 listener for UDP-based peer discovery.
func (s *Service) initDiscoveryV5(addr *net.UDPAddr) (*discover.UDPv5, error) {
	cfg := discover.Config{
		PrivateKey: s.privKey,
		Bootnodes: s.cfg.Bootnodes,
	}
	return discover.ListenV5(addr, s.localNode, cfg)
}
