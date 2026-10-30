// Source excerpt: OffchainLabs/prysm v7.3.1
// beacon-chain/state/fieldtrie/field_trie.go

func (f *FieldTrie) RecomputeTrie(
	indices []uint64,
	elements any,
) (*FieldTrie, [32]byte, error) {
	if indices != nil {
		indices = slice.SetUint64(indices)
	}

	f.mu.Lock()
	defer f.mu.Unlock()

	if f.isShared() {
		forked := f.fork()
		root, err := forked.recomputeInPlace(indices, elements)
		return forked, root, err
	}

	root, err := f.recomputeInPlace(indices, elements)
	return f, root, err
}

// Balances is a CompressedArray: four uint64 values share one 32-byte chunk.
func (f *FieldTrie) compressedIndicesToChunks(
	indices []uint64,
) ([]uint64, error) {
	if f.dataType != types.CompressedArray {
		return indices, nil
	}

	numOfElems, err := f.field.ElemsInChunk()
	if err != nil {
		return nil, fmt.Errorf("elems in chunk: %w", err)
	}

	seen := make(map[uint64]bool, len(indices))
	chunkIndices := make([]uint64, 0, len(indices))
	for _, idx := range indices {
		chunkIdx := idx / numOfElems
		if seen[chunkIdx] {
			continue
		}
		seen[chunkIdx] = true
		chunkIndices = append(chunkIndices, chunkIdx)
	}
	return chunkIndices, nil
}
