func ProcessJustificationAndFinalizationPreCompute(state state.BeaconState, pBal *Balance) (state.BeaconState, error) {
	canProcessSlot, err := slots.EpochStart(2 /*epoch*/)
	if err != nil {
		return nil, err
	}
	if state.Slot() <= canProcessSlot {
		return state, nil
	}

	newBits := processJustificationBits(state, pBal.ActiveCurrentEpoch, pBal.PrevEpochTargetAttested, pBal.CurrentEpochTargetAttested)

	return weighJustificationAndFinalization(state, newBits)
}

func processJustificationBits(state state.BeaconState, totalActiveBalance, prevEpochTargetBalance, currEpochTargetBalance uint64) bitfield.Bitvector4 {
	newBits := state.JustificationBits()
	newBits.Shift(1)
	if 3*prevEpochTargetBalance >= 2*totalActiveBalance {
		newBits.SetBitAt(1, true)
	}

	if 3*currEpochTargetBalance >= 2*totalActiveBalance {
		newBits.SetBitAt(0, true)
	}

	return newBits
}

func weighJustificationAndFinalization(state state.BeaconState, newBits bitfield.Bitvector4) (state.BeaconState, error) {
	jc, fc, err := computeCheckpoints(state, newBits)
	if err != nil {
		return nil, err
	}

	if err := state.SetPreviousJustifiedCheckpoint(state.CurrentJustifiedCheckpoint()); err != nil {
		return nil, err
	}

	if err := state.SetCurrentJustifiedCheckpoint(jc); err != nil {
		return nil, err
	}

	if err := state.SetJustificationBits(newBits); err != nil {
		return nil, err
	}

	if err := state.SetFinalizedCheckpoint(fc); err != nil {
		return nil, err
	}
	return state, nil
}

func computeCheckpoints(state state.BeaconState, newBits bitfield.Bitvector4) (*ethpb.Checkpoint, *ethpb.Checkpoint, error) {
	prevEpoch := time.PrevEpoch(state)
	currentEpoch := time.CurrentEpoch(state)
	oldPrevJustifiedCheckpoint := state.PreviousJustifiedCheckpoint()
	oldCurrJustifiedCheckpoint := state.CurrentJustifiedCheckpoint()

	justifiedCheckpoint := state.CurrentJustifiedCheckpoint()
	finalizedCheckpoint := state.FinalizedCheckpoint()

	if newBits.BitAt(0) && currentEpoch >= justifiedCheckpoint.Epoch {
		blockRoot, err := helpers.BlockRoot(state, currentEpoch)
		if err != nil {
			return nil, nil, errors.Wrapf(err, "could not get block root for current epoch %d", currentEpoch)
		}
		justifiedCheckpoint.Epoch = currentEpoch
		justifiedCheckpoint.Root = blockRoot
	} else if newBits.BitAt(1) && prevEpoch >= justifiedCheckpoint.Epoch {
		blockRoot, err := helpers.BlockRoot(state, prevEpoch)
		if err != nil {
			return nil, nil, errors.Wrapf(err, "could not get block root for previous epoch %d", prevEpoch)
		}
		justifiedCheckpoint.Epoch = prevEpoch
		justifiedCheckpoint.Root = blockRoot
	}

	if len(newBits) == 0 {
		return nil, nil, errors.New("empty justification bits")
	}
	justification := newBits.Bytes()[0]

	if justification&0x0E == 0x0E && (oldPrevJustifiedCheckpoint.Epoch+3) == currentEpoch {
		finalizedCheckpoint = oldPrevJustifiedCheckpoint
	}

	if justification&0x06 == 0x06 && (oldPrevJustifiedCheckpoint.Epoch+2) == currentEpoch {
		finalizedCheckpoint = oldPrevJustifiedCheckpoint
	}

	if justification&0x07 == 0x07 && (oldCurrJustifiedCheckpoint.Epoch+2) == currentEpoch {
		finalizedCheckpoint = oldCurrJustifiedCheckpoint
	}

	if justification&0x03 == 0x03 && (oldCurrJustifiedCheckpoint.Epoch+1) == currentEpoch {
		finalizedCheckpoint = oldCurrJustifiedCheckpoint
	}
	return justifiedCheckpoint, finalizedCheckpoint, nil
}
