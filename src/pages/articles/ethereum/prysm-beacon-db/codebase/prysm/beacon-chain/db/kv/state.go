// beacon-chain/db/kv/state.go — Prysm v5.x

// SaveState saves a beacon state to the DB.
func (s *Store) SaveState(ctx context.Context, st state.ReadOnlyBeaconState, root [32]byte) error {
	enc, err := st.MarshalSSZ()
	if err != nil {
		return err
	}
	return s.db.Update(func(tx *bolt.Tx) error {
		return tx.Bucket(stateBucket).Put(root[:], enc)
	})
}

// State retrieves a beacon state by block root.
func (s *Store) State(ctx context.Context, root [32]byte) (state.ReadOnlyBeaconState, error) {
	// Check cache first
	if v, ok := s.stateCache.Get(root); ok {
		return v.(state.ReadOnlyBeaconState), nil
	}
	var st state.ReadOnlyBeaconState
	if err := s.db.View(func(tx *bolt.Tx) error {
		enc := tx.Bucket(stateBucket).Get(root[:])
		if enc == nil {
			return nil
		}
		var err error
		st, err = unmarshalState(enc)
		return err
	}); err != nil {
		return nil, err
	}
	return st, nil
}
