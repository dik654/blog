// Source excerpt: OffchainLabs/prysm v7.3.1
// beacon-chain/state/state-native/setters_validator.go

// UpdateBalancesAtIndex updates one validator balance in this state view.
func (b *BeaconState) UpdateBalancesAtIndex(
	idx primitives.ValidatorIndex,
	val uint64,
) error {
	if err := b.balancesMultiValue.UpdateAt(b, uint64(idx), val); err != nil {
		return errors.Wrap(err, "could not update balances")
	}

	b.lock.Lock()
	defer b.lock.Unlock()

	b.markFieldAsDirty(types.Balances)
	b.addDirtyIndices(types.Balances, []uint64{uint64(idx)})
	return nil
}

// Source excerpt: container/multi-value-slice/multi_value_slice.go
func (s *Slice[V]) UpdateAt(obj Identifiable, index uint64, val V) error {
	s.lock.Lock()
	defer s.lock.Unlock()

	if index >= uint64(len(s.sharedItems)+len(s.appendedItems)) {
		return fmt.Errorf("index %d %w", index, ErrOutOfBounds)
	}

	if index < uint64(len(s.sharedItems)) {
		s.updateOriginalItem(obj, index, val)
		return nil
	}
	return s.updateAppendedItem(obj, index, val)
}
