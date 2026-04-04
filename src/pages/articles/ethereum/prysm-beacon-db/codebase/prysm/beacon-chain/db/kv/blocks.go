// beacon-chain/db/kv/blocks.go — Prysm v5.x

// SaveBlock saves a signed beacon block to the DB.
func (s *Store) SaveBlock(ctx context.Context, signed interfaces.ReadOnlySignedBeaconBlock) error {
	root, err := signed.Block().HashTreeRoot()
	if err != nil {
		return err
	}
	enc, err := signed.MarshalSSZ()
	if err != nil {
		return err
	}
	return s.db.Update(func(tx *bolt.Tx) error {
		bkt := tx.Bucket(blocksBucket)
		if err := bkt.Put(root[:], enc); err != nil {
			return err
		}
		// Index: slot → root mapping
		return s.saveBlockSlotIndex(tx, root, signed.Block().Slot())
	})
}

// Block retrieves a signed beacon block by its root.
func (s *Store) Block(ctx context.Context, root [32]byte) (interfaces.ReadOnlySignedBeaconBlock, error) {
	// Check cache first
	if v, ok := s.blockCache.Get(root); ok {
		return v.(interfaces.ReadOnlySignedBeaconBlock), nil
	}
	var block interfaces.ReadOnlySignedBeaconBlock
	if err := s.db.View(func(tx *bolt.Tx) error {
		enc := tx.Bucket(blocksBucket).Get(root[:])
		if enc == nil {
			return nil
		}
		var err error
		block, err = unmarshalBlock(enc)
		return err
	}); err != nil {
		return nil, err
	}
	return block, nil
}
