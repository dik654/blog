// Head returns the head root from fork choice store.
// It firsts computes validator's balance changes then recalculates block tree from leaves to root.
func (f *ForkChoice) Head(
	ctx context.Context,
) ([32]byte, error) {
	ctx, span := trace.StartSpan(ctx, "doublyLinkedForkchoice.Head")
	defer span.End()

	calledHeadCount.Inc()

	if err := f.updateBalances(); err != nil {
		return [32]byte{}, errors.Wrap(err, "could not update balances")
	}

	if err := f.applyProposerBoostScore(); err != nil {
		return [32]byte{}, errors.Wrap(err, "could not apply proposer boost score")
	}

	if err := f.store.applyWeightChangesConsensusNode(ctx, f.store.treeRootNode); err != nil {
		return [32]byte{}, errors.Wrap(err, "could not apply weight changes")
	}
	f.store.removeProposerBoostFromParent()

	jc := f.JustifiedCheckpoint()
	fc := f.FinalizedCheckpoint()
	currentEpoch := slots.EpochsSinceGenesis(f.store.genesisTime)
	if err := f.store.updateBestDescendantConsensusNode(ctx, f.store.treeRootNode, jc.Epoch, fc.Epoch, currentEpoch); err != nil {
		return [32]byte{}, errors.Wrap(err, "could not update best descendant")
	}
	return f.store.head(ctx)
}
