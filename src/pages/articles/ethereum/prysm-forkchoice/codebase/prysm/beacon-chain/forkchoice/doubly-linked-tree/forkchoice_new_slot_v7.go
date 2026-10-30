func (f *ForkChoice) NewSlot(ctx context.Context, slot primitives.Slot) error {
	// Reset proposer boost root
	f.store.proposerBoostRoot = [32]byte{}

	// Return if it's not a new epoch.
	if !slots.IsEpochStart(slot) {
		return nil
	}

	// Update store.justified_checkpoint if a better checkpoint on the store.finalized_checkpoint chain
	if err := f.updateUnrealizedCheckpoints(ctx); err != nil {
		return errors.Wrap(err, "could not update unrealized checkpoints")
	}
	return f.store.prune(ctx)
}
