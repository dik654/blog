// OffchainLabs Prysm v7.3.1 @ 96d418cd964b083e37519a9df274030a1beac7db
// beacon-chain/db/kv/checkpoint.go — focused source excerpt

// SaveFinalizedCheckpoint saves finalized checkpoint in beacon chain.
func (s *Store) SaveFinalizedCheckpoint(ctx context.Context, checkpoint *ethpb.Checkpoint) error {
	ctx, span := trace.StartSpan(ctx, "BeaconDB.SaveFinalizedCheckpoint")
	defer span.End()

	enc, err := encode(ctx, checkpoint)
	if err != nil {
		tracing.AnnotateError(span, err)
		return err
	}
	hasStateSummary := s.HasStateSummary(ctx, bytesutil.ToBytes32(checkpoint.Root))
	hasStateInDB := s.HasState(ctx, bytesutil.ToBytes32(checkpoint.Root))
	err = s.db.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket(checkpointBucket)
		if !(hasStateInDB || hasStateSummary) {
			log.Warnf("Recovering state summary for finalized root: %#x", bytesutil.Trunc(checkpoint.Root))
			if err := recoverStateSummary(ctx, tx, checkpoint.Root); err != nil {
				return errors.Wrapf(errMissingStateForCheckpoint, "could not save finalized checkpoint, finalized root: %#x", bytesutil.Trunc(checkpoint.Root))
			}
		}
		if err := bucket.Put(finalizedCheckpointKey, enc); err != nil {
			return err
		}
		return s.updateFinalizedBlockRoots(ctx, tx, checkpoint)
	})
	tracing.AnnotateError(span, err)
	return err
}
