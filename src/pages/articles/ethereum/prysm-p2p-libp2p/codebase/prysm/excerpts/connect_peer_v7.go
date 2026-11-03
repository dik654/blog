func (s *Service) connectWithPeer(ctx context.Context, info peer.AddrInfo) error {
	ctx, span := trace.StartSpan(ctx, "p2p.connectWithPeer")
	defer span.End()

	if info.ID == s.host.ID() {
		return nil
	}

	if err := s.Peers().IsBad(info.ID); err != nil {
		return errors.Wrap(err, "bad peer")
	}

	ctx, cancel := context.WithTimeout(ctx, maxDialTimeout)
	defer cancel()

	if err := s.host.Connect(ctx, info); err != nil {
		s.downscorePeer(info.ID, "connectionError")
		return errors.Wrap(err, "peer connect")
	}
	return nil
}
