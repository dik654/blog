// Source excerpt: OffchainLabs/prysm v7.3.1
// beacon-chain/state/state-native/state_trie.go

// Copy returns a deep copy of the beacon state.
func (b *BeaconState) Copy() state.BeaconState {
	b.lock.RLock()
	defer b.lock.RUnlock()

	dst := &BeaconState{
		version: b.version,

		// Primitive values are copied directly.
		slot: b.slot,

		// Large fields initially keep the same multi-value container.
		blockRootsMultiValue:  b.blockRootsMultiValue,
		stateRootsMultiValue:  b.stateRootsMultiValue,
		balancesMultiValue:    b.balancesMultiValue,
		validatorsMultiValue:  b.validatorsMultiValue,

		id: types.Enumerator.Inc(),

		dirtyFields:      make(map[types.FieldIndex]bool, fieldCount),
		dirtyIndices:     make(map[types.FieldIndex][]uint64, fieldCount),
		rebuildTrie:      make(map[types.FieldIndex]bool, fieldCount),
		stateFieldLeaves: make(map[types.FieldIndex]*fieldtrie.FieldTrie, len(fieldMap)),
	}

	// The destination ID is registered as another view of each multi-value field.
	b.blockRootsMultiValue.Copy(b, dst)
	b.stateRootsMultiValue.Copy(b, dst)
	b.balancesMultiValue.Copy(b, dst)
	b.validatorsMultiValue.Copy(b, dst)

	for field, ref := range b.sharedFieldReferences {
		ref.AddRef()
		dst.sharedFieldReferences[field] = ref
	}

	for fldIdx, fieldTrie := range b.stateFieldLeaves {
		dst.stateFieldLeaves[fldIdx] = fieldTrie.CopyTrie()
	}

	return dst
}
