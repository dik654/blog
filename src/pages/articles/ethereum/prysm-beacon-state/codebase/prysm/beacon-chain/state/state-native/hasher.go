// beacon-chain/state/state-native/hasher.go — Prysm v5

// HashTreeRoot는 비콘 상태의 SSZ Merkle Root를 계산한다.
// 변경된 필드만 다시 해시하여 성능을 최적화한다.
func (b *BeaconState) HashTreeRoot(ctx context.Context) ([32]byte, error) {
	b.lock.Lock()
	defer b.lock.Unlock()

	// 변경된 필드 트라이만 재계산
	for field := range b.dirtyFields {
		if err := b.recomputeFieldTrie(field); err != nil {
			return [32]byte{}, err
		}
		delete(b.dirtyFields, field)
	}
	// 모든 필드의 리프 해시를 모아 최종 루트 계산
	fieldRoots := make([][32]byte, params.BeaconStateFieldCount)
	for i := 0; i < params.BeaconStateFieldCount; i++ {
		fi := types.FieldIndex(i)
		fieldRoots[i] = b.stateFieldLeaves[fi].TrieRoot()
	}
	return ssz.BitwiseMerkleize(fieldRoots, uint64(len(fieldRoots)), uint64(len(fieldRoots)))
}

// recomputeFieldTrie는 특정 필드의 Merkle 트라이를 재구성한다.
func (b *BeaconState) recomputeFieldTrie(fi types.FieldIndex) error {
	if b.rebuildTrie[fi] {
		// 전체 재구성 필요 (슬라이스 크기 변경 등)
		trie, err := fieldtrie.NewFieldTrie(fi, b.fieldValue(fi))
		if err != nil {
			return err
		}
		b.stateFieldLeaves[fi] = trie
		delete(b.rebuildTrie, fi)
		return nil
	}
	// 변경된 인덱스만 업데이트
	return b.stateFieldLeaves[fi].RecomputeTrie(b.dirtyIndices(fi), b.fieldValue(fi))
}
