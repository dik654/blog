// waitUntilAttestationDueOrValidBlock waits until (a) or (b) whichever comes first:
//
//	(a) the validator has received a valid block that is the same slot as input slot
//	(b) the configured attestation due time has transpired (as basis points of the slot duration)
func (v *validator) waitUntilAttestationDueOrValidBlock(ctx context.Context, slot primitives.Slot) {
	ctx, span := trace.StartSpan(ctx, "validator.waitUntilAttestationDueOrValidBlock")
	defer span.End()

	// Don't need to wait if requested slot is the same as highest valid slot.
	if slot <= v.highestSlot() {
		return
	}

	finalTime, err := v.slotComponentDeadline(slot, attestationDueComponent(slot))
	if err != nil {
		log.WithError(err).WithField("slot", slot).Error("Slot overflows, unable to wait for attestation deadline")
		return
	}
	wait := prysmTime.Until(finalTime)
	if wait <= 0 {
		return
	}
	t := time.NewTimer(wait)
	defer t.Stop()

	ch := make(chan primitives.Slot, 1)
	sub := v.slotFeed.Subscribe(ch)
	defer sub.Unsubscribe()

	for {
		select {
		case s := <-ch:
			if features.Get().AttestTimely {
				if slot <= s {
					return
				}
			}
		case <-ctx.Done():
			tracing.AnnotateError(span, ctx.Err())
			return
		case <-sub.Err():
			log.Error("Subscriber closed, exiting goroutine")
			return
		case <-t.C:
			return
		}
	}
}
