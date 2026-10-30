// OffchainLabs Prysm v7.3.1 @ 96d418cd964b083e37519a9df274030a1beac7db
// beacon-chain/db/kv/blocks.go — focused source excerpts

type blockBatchEntry struct {
	root    []byte
	block   interfaces.ReadOnlySignedBeaconBlock
	enc     []byte
	updated bool
	indices map[string][]byte
}

func prepareBlockBatch(blks []blocks.ROBlock, shouldBlind bool) ([]blockBatchEntry, error) {
	batch := make([]blockBatchEntry, len(blks))
	for i := range blks {
		batch[i].root, batch[i].block = blks[i].RootSlice(), blks[i].ReadOnlySignedBeaconBlock
		batch[i].indices = blockIndices(batch[i].block.Block().Slot(), batch[i].block.Block().ParentRoot())
		if shouldBlind {
			blinded, err := batch[i].block.ToBlinded()
			if err != nil {
				if !errors.Is(err, blocks.ErrUnsupportedVersion) {
					return nil, errors.Wrapf(err, "could not convert block to blinded format for root %#x", batch[i].root)
				}
			} else {
				batch[i].block = blinded
			}
		}
		enc, err := encodeBlock(batch[i].block)
		if err != nil {
			return nil, errors.Wrapf(err, "failed to encode block for root %#x", batch[i].root)
		}
		batch[i].enc = enc
	}
	return batch, nil
}

func (s *Store) SaveROBlocks(ctx context.Context, blks []blocks.ROBlock, cache bool) error {
	shouldBlind, err := s.shouldSaveBlinded()
	if err != nil {
		return err
	}
	// Precompute expensive values outside the db transaction.
	batch, err := prepareBlockBatch(blks, shouldBlind)
	if err != nil {
		return errors.Wrap(err, "failed to encode all blocks in batch for saving to the db")
	}
	err = s.db.Update(func(tx *bolt.Tx) error {
		bkt := tx.Bucket(blocksBucket)
		for i := range batch {
			if exists := bkt.Get(batch[i].root); exists != nil {
				continue
			}
			if err := bkt.Put(batch[i].root, batch[i].enc); err != nil {
				return errors.Wrapf(err, "could write block to db with root %#x", batch[i].root)
			}
			if err := updateValueForIndices(ctx, batch[i].indices, batch[i].root, tx); err != nil {
				return errors.Wrapf(err, "could not update DB indices for root %#x", batch[i].root)
			}
			batch[i].updated = true
		}
		return nil
	})
	if !cache {
		return err
	}
	for i := range batch {
		if batch[i].updated {
			s.blockCache.Set(string(batch[i].root), batch[i].block, int64(len(batch[i].enc)))
		}
	}
	return err
}

func blockIndices(slot primitives.Slot, parentRoot [32]byte) map[string][]byte {
	return map[string][]byte{
		string(blockSlotIndicesBucket):       bytesutil.SlotToBytesBigEndian(slot),
		string(blockParentRootIndicesBucket): parentRoot[:],
	}
}

// BlockRootsBySlot retrieves a list of beacon block roots by slot
func (s *Store) BlockRootsBySlot(ctx context.Context, slot primitives.Slot) (bool, [][32]byte, error) {
	ctx, span := trace.StartSpan(ctx, "BeaconDB.BlockRootsBySlot")
	defer span.End()
	blockRoots := make([][32]byte, 0)
	err := s.db.View(func(tx *bolt.Tx) error {
		var err error
		blockRoots, err = blockRootsBySlot(ctx, tx, slot)
		return err
	})
	if err != nil {
		return false, nil, errors.Wrap(err, "could not retrieve block roots by slot")
	}
	return len(blockRoots) > 0, blockRoots, nil
}

// DeleteHistoricalDataBeforeSlot deletes all blocks and states before the given slot.
func (s *Store) DeleteHistoricalDataBeforeSlot(ctx context.Context, cutoffSlot primitives.Slot, batchSize int) (int, error) {
	slotRoots, err := s.slotRootsInRange(ctx, primitives.Slot(0), cutoffSlot, batchSize)
	if err != nil {
		return 0, err
	}

	var numSlotsDeleted int
	err = s.db.Update(func(tx *bolt.Tx) error {
		blocksBkt := tx.Bucket(blocksBucket)
		for _, sr := range slotRoots {
			if ctx.Err() != nil {
				//nolint:nilerr
				return nil
			}
			if err = s.deleteBlock(tx, sr.root[:]); err != nil {
				return err
			}
			if err = tx.Bucket(finalizedBlockRootsIndexBucket).Delete(sr.root[:]); err != nil {
				return errors.Wrap(err, "could not delete finalized block root index")
			}
			if err = tx.Bucket(stateBucket).Delete(sr.root[:]); err != nil {
				return errors.Wrap(err, "could not delete state")
			}
			if err = tx.Bucket(stateSummaryBucket).Delete(sr.root[:]); err != nil {
				return errors.Wrap(err, "could not delete state summary")
			}
			if err = s.deleteValidatorHashes(tx, sr.root[:]); err != nil {
				return errors.Wrap(err, "could not delete validators")
			}

			// TODO: execution payload envelopes (Gloas+) are keyed by execution payload
			// block hash, not beacon block root, so they cannot be pruned in this loop.
			// A separate pruning mechanism is needed (e.g. secondary index or cursor scan).
			numSlotsDeleted++
		}

		for _, sr := range slotRoots {
			if err = tx.Bucket(blockSlotIndicesBucket).Delete(bytesutil.SlotToBytesBigEndian(sr.slot)); err != nil {
				return errors.Wrap(err, "could not delete block slot index")
			}
			if err = tx.Bucket(stateSlotIndicesBucket).Delete(bytesutil.SlotToBytesBigEndian(sr.slot)); err != nil {
				return errors.Wrap(err, "could not delete state slot index")
			}
		}

		for _, sr := range slotRoots {
			s.blockCache.Del(string(sr.root[:]))
			s.stateSummaryCache.delete(sr.root)
		}

		originRoot := blocksBkt.Get(originCheckpointBlockRootKey)
		if originRoot != nil && blocksBkt.Get(originRoot) == nil {
			if err = blocksBkt.Delete(originCheckpointBlockRootKey); err != nil {
				return errors.Wrap(err, "could not delete origin checkpoint block root")
			}
		}
		return nil
	})

	return numSlotsDeleted, err
}
