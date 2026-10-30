// updateBalances updates the balances that directly voted for each block taking into account the
// validators' latest votes.
func (f *ForkChoice) updateBalances() error {
	newBalances := f.justifiedBalances
	zHash := params.BeaconConfig().ZeroHash

	for index := 0; index < len(f.votes); index++ {
		// Skip if validator has been slashed
		if f.store.slashedIndices[primitives.ValidatorIndex(index)] {
			continue
		}
		vote := &f.votes[index]
		// ...
		oldBalance := uint64(0)
		newBalance := uint64(0)
		// If the validator index did not exist in `f.balances` or
		// `newBalances` list above, the balance is just 0.
		if index < len(f.balances) {
			oldBalance = f.balances[index]
		}
		if index < len(newBalances) {
			newBalance = newBalances[index]
		}
		if oldBalance != newBalance || vote.currentRoot != vote.nextRoot ||
			vote.currentSlot != vote.nextSlot || vote.currentPayloadStatus != vote.nextPayloadStatus {
			// Add new balance to the next vote target if the root is known.
			pn, pending := f.store.resolveVoteNode(vote.nextRoot, vote.nextSlot, vote.nextPayloadStatus)
			if pn != nil && vote.nextRoot != zHash {
				if pending {
					pn.node.balance += newBalance
				} else {
					pn.balance += newBalance
				}
			}

			// Subtract old balance from the current vote target if the root is known.
			pn, pending = f.store.resolveVoteNode(vote.currentRoot, vote.currentSlot, vote.currentPayloadStatus)
			if pn != nil && vote.currentRoot != zHash {
				if pending {
					if pn.node.balance < oldBalance {
						// ...
						pn.node.balance = 0
					} else {
						pn.node.balance -= oldBalance
					}
				} else {
					if pn.balance < oldBalance {
						// ...
						pn.balance = 0
					} else {
						pn.balance -= oldBalance
					}
				}
			}
		}
		// Rotate the validator vote.
		f.votes[index].currentRoot = vote.nextRoot
		f.votes[index].currentSlot = vote.nextSlot
		f.votes[index].currentPayloadStatus = vote.nextPayloadStatus
	}
	f.balances = newBalances
	return nil
}
