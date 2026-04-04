// beacon-chain/sync/validate_beacon_blocks.go — Prysm v5.x

// validateBeaconBlockPubSub validates an incoming beacon block from gossip.
func (s *Service) validateBeaconBlockPubSub(
	ctx context.Context, pid peer.ID, msg *pubsub.Message,
) (pubsub.ValidationResult, error) {
	// 1. SSZ-Snappy decompress + decode
	blk, err := s.decodePubSubMessage(msg)
	if err != nil {
		return pubsub.ValidationReject, err
	}
	// 2. Check block slot is not too old
	if slots.IsEpochEnd(blk.Block().Slot()) {
		return pubsub.ValidationIgnore, nil
	}
	// 3. Verify proposer signature
	if err := s.validateBlockSignature(ctx, blk); err != nil {
		return pubsub.ValidationReject, err
	}
	// 4. Check if block already known
	if s.hasBlockAndState(ctx, blk.Block().ParentRoot()) {
		// Parent exists — valid block
	} else {
		return pubsub.ValidationIgnore, nil
	}
	// 5. Verify proposer is expected for this slot
	if err := s.validateProposerIndex(ctx, blk); err != nil {
		return pubsub.ValidationReject, err
	}
	// 6. Check for equivocation (double proposal)
	if s.hasSeenBlockProposer(blk.Block().Slot(), blk.Block().ProposerIndex()) {
		return pubsub.ValidationIgnore, nil
	}
	s.setSeenBlockProposer(blk.Block().Slot(), blk.Block().ProposerIndex())
	msg.ValidatorData = blk
	return pubsub.ValidationAccept, nil
}
