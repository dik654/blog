// OffchainLabs Prysm v7.3.1 @ 96d418cd964b083e37519a9df274030a1beac7db
// beacon-chain/db/kv/state.go — focused source excerpt

// SaveStates stores multiple states to the db using the provided corresponding roots.
func (s *Store) SaveStates(ctx context.Context, states []state.ReadOnlyBeaconState, blockRoots [][32]byte) error {
	ctx, span := trace.StartSpan(ctx, "BeaconDB.SaveStates")
	defer span.End()
	if states == nil {
		return errors.New("nil state")
	}
	multipleEncs := make([][]byte, len(states))
	for i, st := range states {
		stateBytes, err := marshalState(st)
		if err != nil {
			return err
		}
		multipleEncs[i] = stateBytes
	}

	if err := s.db.Update(func(tx *bolt.Tx) error {
		bucket := tx.Bucket(stateBucket)
		for i, rt := range blockRoots {
			indicesByBucket := createStateIndicesFromStateSlot(ctx, states[i].Slot())
			if err := updateValueForIndices(ctx, indicesByBucket, rt[:], tx); err != nil {
				return errors.Wrap(err, "could not update DB indices")
			}
			if err := bucket.Put(rt[:], multipleEncs[i]); err != nil {
				return err
			}
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}
