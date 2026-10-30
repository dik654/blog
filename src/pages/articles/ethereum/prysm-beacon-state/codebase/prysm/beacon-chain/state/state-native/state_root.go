// Source excerpt: OffchainLabs/prysm v7.3.1
// beacon-chain/state/state-native/state_trie.go

func (b *BeaconState) HashTreeRoot(ctx context.Context) ([32]byte, error) {
	b.lock.Lock()
	defer b.lock.Unlock()

	if err := b.initializeMerkleLayers(ctx); err != nil {
		return [32]byte{}, err
	}
	if err := b.recomputeDirtyFields(ctx); err != nil {
		return [32]byte{}, err
	}
	return bytesutil.ToBytes32(
		b.merkleLayers[len(b.merkleLayers)-1][0],
	), nil
}

func (b *BeaconState) recomputeDirtyFields(ctx context.Context) error {
	for field := range b.dirtyFields {
		root, err := b.rootSelector(ctx, field)
		if err != nil {
			return err
		}
		idx := field.RealPosition()
		b.merkleLayers[0][idx] = root[:]
		b.recomputeRoot(idx)
		delete(b.dirtyFields, field)
	}
	return nil
}

func (b *BeaconState) recomputeFieldTrie(
	index types.FieldIndex,
	elements any,
) ([32]byte, error) {
	trie, root, err := b.stateFieldLeaves[index].RecomputeTrie(
		b.dirtyIndices[index],
		elements,
	)
	b.stateFieldLeaves[index] = trie
	if err != nil {
		return [32]byte{}, err
	}
	b.dirtyIndices[index] = []uint64{}
	return root, nil
}
