// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/db/kv/blocks.go — blocksAncestryQuery 핵심 발췌

func (s *Store) blocksAncestryQuery(
	ctx context.Context,
	q filters.AncestryQuery,
) ([]interfaces.ReadOnlySignedBeaconBlock, [][32]byte, error) {
	blocks := make([]interfaces.ReadOnlySignedBeaconBlock, 0, q.Span())
	roots := make([][32]byte, 0, q.Span())
	sr, err := s.slotRootsInRange(ctx, q.Earliest, q.Descendent.Slot-1, -1)
	if err != nil {
		return nil, nil, err
	}
	err = s.db.View(func(tx *bolt.Tx) error {
		descendent, err := s.getBlock(ctx, q.Descendent.Root, tx)
		if err != nil {
			return err
		}
		proot := descendent.Block().ParentRoot()
		lowest := descendent.Block().Slot()
		blocks = append(blocks, descendent)
		roots = append(roots, q.Descendent.Root)
		for _, prev := range sr {
			if prev.slot < q.Earliest {
				return nil
			}
			if prev.slot >= lowest {
				continue
			}
			if prev.root == proot {
				p, err := s.getBlock(ctx, prev.root, tx)
				if err != nil {
					return err
				}
				roots = append(roots, prev.root)
				blocks = append(blocks, p)
				proot = p.Block().ParentRoot()
				lowest = p.Block().Slot()
			}
		}
		return nil
	})
	if err != nil {
		return nil, nil, err
	}
	slices.Reverse(roots)
	slices.Reverse(blocks)
	return blocks, roots, err
}
