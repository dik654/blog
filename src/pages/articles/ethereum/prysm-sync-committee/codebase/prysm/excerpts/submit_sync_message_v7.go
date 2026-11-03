func (v *validator) SubmitSyncCommitteeMessage(ctx context.Context, slot primitives.Slot, pubKey [fieldparams.BLSPubkeyLength]byte) {
	ctx, span := trace.StartSpan(ctx, "validator.SubmitSyncCommitteeMessage")
	defer span.End()
	span.SetAttributes(trace.StringAttribute("validator", fmt.Sprintf("%#x", pubKey)))

	v.waitUntilAttestationDueOrValidBlock(ctx, slot)

	ctx, err := v.withHeadHint(ctx, slot, syncMessageDueComponent(slot))
	if err != nil {
		log.WithField("slot", slot).WithError(err).Error("Could not attach freshness hint")
		tracing.AnnotateError(span, err)
		return
	}

	res, err := v.validatorClient.SyncMessageBlockRoot(ctx, &emptypb.Empty{})
	if err != nil {
		log.WithError(err).Error("Could not request sync message block root to sign")
		tracing.AnnotateError(span, err)
		return
	}

	duty, err := v.duty(pubKey)
	if err != nil {
		log.WithError(err).Error("Could not fetch validator assignment")
		return
	}

	d, err := v.domainData(ctx, slots.ToEpoch(slot), params.BeaconConfig().DomainSyncCommittee[:])
	if err != nil {
		log.WithError(err).Error("Could not get sync committee domain data")
		return
	}
	sszRoot := primitives.SSZBytes(res.Root)
	r, err := signing.ComputeSigningRoot(&sszRoot, d.SignatureDomain)
	if err != nil {
		log.WithError(err).Error("Could not get sync committee message signing root")
		return
	}

	sig, err := v.km.Sign(ctx, &validatorpb.SignRequest{
		PublicKey:       pubKey[:],
		SigningRoot:     r[:],
		SignatureDomain: d.SignatureDomain,
		Object: &validatorpb.SignRequest_SyncMessageBlockRoot{
			SyncMessageBlockRoot: res.Root,
		},
		SigningSlot: slot,
	})
	if err != nil {
		log.WithError(err).Error("Could not sign sync committee message")
		return
	}

	msg := &ethpb.SyncCommitteeMessage{
		Slot:           slot,
		BlockRoot:      res.Root,
		ValidatorIndex: duty.ValidatorIndex,
		Signature:      sig.Marshal(),
	}
	if _, err := v.validatorClient.SubmitSyncMessage(ctx, msg); err != nil {
		log.WithError(err).Error("Could not submit sync committee message")
		return
	}

	msgSlot := msg.Slot
	slotTime, err := slots.StartTime(v.genesisTime, msgSlot)
	if err != nil {
		log.WithError(err).Error("Failed to determine slot start time")
	}
	log.WithFields(logrus.Fields{
		"slot":               msg.Slot,
		"slotStartTime":      slotTime,
		"timeSinceSlotStart": time.Since(slotTime),
		"blockRoot":          fmt.Sprintf("%#x", bytesutil.Trunc(msg.BlockRoot)),
		"validatorIndex":     msg.ValidatorIndex,
	}).Debug("Submitted new sync message")
	v.saveSubmittedSyncMessage(msg)
}
