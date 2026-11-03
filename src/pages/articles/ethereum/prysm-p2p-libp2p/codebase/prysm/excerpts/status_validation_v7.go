func (s *Service) validateStatusMessage(ctx context.Context, genericMsg any) error {
	msg, err := statusV2(genericMsg)
	if err != nil {
		return errors.Wrap(err, "status data")
	}

	if msg.HeadSlot > s.cfg.clock.CurrentSlot()+maxFutureStatusHeadSlot {
		return errors.Wrap(p2ptypes.ErrInvalidRequest, "head slot too far in the future")
	}

	forkDigest := s.currentForkDigest()
	if !bytes.Equal(forkDigest[:], msg.ForkDigest) {
		return fmt.Errorf("mismatch fork digest: expected %#x, got %#x: %w", forkDigest[:], msg.ForkDigest, p2ptypes.ErrWrongForkDigestVersion)
	}
	genesis := s.cfg.clock.GenesisTime()
	cp := s.cfg.chain.FinalizedCheckpt()
	finalizedEpoch := cp.Epoch
	maxEpoch := slots.EpochsSinceGenesis(genesis)
	// It would take a minimum of 2 epochs to finalize a
	// previous epoch
	maxFinalizedEpoch := primitives.Epoch(0)
	if maxEpoch > 2 {
		maxFinalizedEpoch = maxEpoch - 2
	}
	if msg.FinalizedEpoch > maxFinalizedEpoch {
		return p2ptypes.ErrInvalidEpoch
	}
	// Exit early if the peer's finalized epoch
	// is less than that of the remote peer's.
	if finalizedEpoch < msg.FinalizedEpoch {
		return nil
	}
	finalizedAtGenesis := msg.FinalizedEpoch == 0
	rootIsEqual := bytes.Equal(params.BeaconConfig().ZeroHash[:], msg.FinalizedRoot)
	// If peer is at genesis with the correct genesis root hash we exit.
	if finalizedAtGenesis && rootIsEqual {
		return nil
	}
	// We hold no blocks below our origin, so this checkpoint is neither provable nor refutable.
	if s.predatesEarliestBlock(ctx, msg.FinalizedEpoch) {
		return nil
	}
	if !s.cfg.chain.IsFinalized(ctx, bytesutil.ToBytes32(msg.FinalizedRoot)) {
		log.WithField("root", fmt.Sprintf("%#x", msg.FinalizedRoot)).Debug("Could not validate finalized root")
		return p2ptypes.ErrInvalidFinalizedRoot
	}
