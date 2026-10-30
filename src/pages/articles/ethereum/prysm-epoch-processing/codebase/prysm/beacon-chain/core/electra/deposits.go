func ProcessPendingDeposits(ctx context.Context, st state.BeaconState, activeBalance primitives.Gwei) error {
	_, span := trace.StartSpan(ctx, "electra.ProcessPendingDeposits")
	defer span.End()

	if st == nil || st.IsNil() {
		return errors.New("nil state")
	}

	// constants & initializations
	nextEpoch := slots.ToEpoch(st.Slot()) + 1
	processedAmount := uint64(0)
	nextDepositIndex := uint64(0)
	isChurnLimitReached := false

	var pendingDepositsToBatchVerify []*ethpb.PendingDeposit
	var pendingDepositsToPostpone []*ethpb.PendingDeposit

	depBalToConsume, err := st.DepositBalanceToConsume()
	if err != nil {
		return errors.Wrap(err, "could not get deposit balance to consume")
	}
	availableForProcessing := depBalToConsume + helpers.ActivationChurnLimitForVersion(st.Version(), activeBalance)

	finalizedSlot, err := slots.EpochStart(st.FinalizedCheckpoint().Epoch)
	if err != nil {
		return errors.Wrap(err, "could not get finalized slot")
	}

	// The former deposit mechanism is removed, so the Eth1 bridge gate in the
	// loop below, and the start index it reads, only exist before Fulu.
	var startIndex uint64
	bridgeGateApplies := st.Version() < version.Fulu

	if bridgeGateApplies {
		startIndex, err = st.DepositRequestsStartIndex()
		if err != nil {
			return errors.Wrap(err, "could not get starting pendingDeposit index")
		}
	}

	pendingDeposits, err := st.PendingDeposits()
	if err != nil {
		return err
	}
	for _, pendingDeposit := range pendingDeposits {
		// Do not process pendingDeposit requests if Eth1 bridge deposits are not yet applied.
		if bridgeGateApplies && pendingDeposit.Slot > params.BeaconConfig().GenesisSlot && st.Eth1DepositIndex() < startIndex {
			break
		}

		// Check if pendingDeposit has been finalized, otherwise, stop processing.
		if pendingDeposit.Slot > finalizedSlot {
			break
		}

		// Check if number of processed deposits has not reached the limit, otherwise, stop processing.
		if nextDepositIndex >= params.BeaconConfig().MaxPendingDepositsPerEpoch {
			break
		}

		var isValidatorExited bool
		var isValidatorWithdrawn bool
		index, found := st.ValidatorIndexByPubkey(bytesutil.ToBytes48(pendingDeposit.PublicKey))
		if found {
			val, err := st.ValidatorAtIndexReadOnly(index)
			if err != nil {
				return errors.Wrap(err, "could not get validator")
			}
			isValidatorExited = val.ExitEpoch() < params.BeaconConfig().FarFutureEpoch
			isValidatorWithdrawn = val.WithdrawableEpoch() < nextEpoch
		}

		if isValidatorWithdrawn {
			// note: the validator will never be active, just increase the balance
			if err := helpers.IncreaseBalance(st, index, pendingDeposit.Amount); err != nil {
				return errors.Wrap(err, "could not increase balance")
			}
		} else if isValidatorExited {
			pendingDepositsToPostpone = append(pendingDepositsToPostpone, pendingDeposit)
		} else {
			isChurnLimitReached = primitives.Gwei(processedAmount+pendingDeposit.Amount) > availableForProcessing
			if isChurnLimitReached {
				break
			}
			processedAmount += pendingDeposit.Amount

			// note: the following code deviates from the spec in order to perform batch signature verification
			if found {
				if err := helpers.IncreaseBalance(st, index, pendingDeposit.Amount); err != nil {
					return errors.Wrap(err, "could not increase balance")
				}
			} else {
				// Collect deposit for batch signature verification
				pendingDepositsToBatchVerify = append(pendingDepositsToBatchVerify, pendingDeposit)
			}
		}

		// Regardless of how the pendingDeposit was handled, we move on in the queue.
		nextDepositIndex++
	}
	// ...
}
