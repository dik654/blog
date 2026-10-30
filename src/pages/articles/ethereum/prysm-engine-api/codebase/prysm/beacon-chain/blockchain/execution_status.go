lastValidHash, err = s.cfg.ExecutionEngineCaller.NewPayload(ctx, payload, versionedHashes, parentRoot, requester)
if err == nil {
	newPayloadValidNodeCount.Inc()
	return true, nil
}
if errors.Is(err, execution.ErrAcceptedSyncingPayloadStatus) {
	newPayloadOptimisticNodeCount.Inc()
	log.WithFields(logFields).Info("Called new payload with optimistic block")
	return false, nil
}
if errors.Is(err, execution.ErrInvalidPayloadStatus) {
	log.WithFields(logFields).WithError(err).Error("Invalid payload status")
	return false, invalidBlock{
		error:         ErrInvalidPayload,
		lastValidHash: bytesutil.ToBytes32(lastValidHash),
	}
}

func (s *Service) pruneInvalidBlock(ctx context.Context, root, parentRoot, parentHash [32]byte, lvh [32]byte) error {
	newPayloadInvalidNodeCount.Inc()
	invalidRoots, err := s.cfg.ForkChoiceStore.SetOptimisticToInvalid(ctx, root, parentRoot, parentHash, lvh)
	if err != nil {
		return err
	}
	if err := s.removeInvalidBlockAndState(ctx, invalidRoots); err != nil {
		return err
	}
	return invalidBlock{
		invalidAncestorRoots: invalidRoots,
		error:                ErrInvalidPayload,
		lastValidHash:        lvh,
	}
}
