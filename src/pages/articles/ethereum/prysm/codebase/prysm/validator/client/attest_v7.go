// SubmitAttestation completes the validator client's attester responsibility at a given slot.
// It fetches the latest beacon block head along with the latest canonical beacon state
// information in order to sign the block and include information about the validator's
// participation in voting on the block.
func (v *validator) SubmitAttestation(ctx context.Context, slot primitives.Slot, pubKey [fieldparams.BLSPubkeyLength]byte) {
	ctx, span := trace.StartSpan(ctx, "validator.SubmitAttestation")
	defer span.End()
	span.SetAttributes(trace.StringAttribute("validator", fmt.Sprintf("%#x", pubKey)))

	v.waitUntilAttestationDueOrValidBlock(ctx, slot)

	var b strings.Builder
	if err := b.WriteByte(byte(roleAttester)); err != nil {
		log.WithError(err).Error("Could not write role byte for lock key")
		tracing.AnnotateError(span, err)
		return
	}
	_, err := b.Write(pubKey[:])
	if err != nil {
		log.WithError(err).Error("Could not write pubkey bytes for lock key")
		tracing.AnnotateError(span, err)
		return
	}
	lock := async.NewMultilock(b.String())
	lock.Lock()
	defer lock.Unlock()

	fmtKey := fmt.Sprintf("%#x", pubKey[:])
	log := log.WithField("pubkey", fmt.Sprintf("%#x", bytesutil.Trunc(pubKey[:]))).WithField("slot", slot)
	duty, err := v.duty(pubKey)
	if err != nil {
		log.WithError(err).Error("Could not fetch validator assignment")
		if v.emitAccountMetrics {
			ValidatorAttestFailVec.WithLabelValues(fmtKey).Inc()
		}
		tracing.AnnotateError(span, err)
		return
	}
	if duty.CommitteeLength == 0 {
		log.Debug("Empty committee for validator duty, not attesting")
		return
	}

	postElectra := slots.ToEpoch(slot) >= params.BeaconConfig().ElectraForkEpoch

	data, err := v.getAttestationData(ctx, slot, duty.CommitteeIndex)
	if err != nil {
		log.WithError(err).Error("Could not request attestation to sign at slot")
		if v.emitAccountMetrics {
			ValidatorAttestFailVec.WithLabelValues(fmtKey).Inc()
		}
		tracing.AnnotateError(span, err)
		return
	}

	sig, _, err := v.signAtt(ctx, pubKey, data, slot)
	if err != nil {
		log.WithError(err).Error("Could not sign attestation")
		if v.emitAccountMetrics {
			ValidatorAttestFailVec.WithLabelValues(fmtKey).Inc()
		}
		tracing.AnnotateError(span, err)
		return
	}

	var indexedAtt ethpb.IndexedAtt
	if postElectra {
		indexedAtt = &ethpb.IndexedAttestationElectra{
			AttestingIndices: []uint64{uint64(duty.ValidatorIndex)},
			Data:             data,
			Signature:        sig,
		}
	} else {
		indexedAtt = &ethpb.IndexedAttestation{
			AttestingIndices: []uint64{uint64(duty.ValidatorIndex)},
			Data:             data,
			Signature:        sig,
		}
	}

	_, signingRoot, err := v.domainAndSigningRoot(ctx, indexedAtt.GetData())
	if err != nil {
		log.WithError(err).Error("Could not get domain and signing root from attestation")
		if v.emitAccountMetrics {
			ValidatorAttestFailVec.WithLabelValues(fmtKey).Inc()
		}
		tracing.AnnotateError(span, err)
		return
	}

	// Send the attestation to the beacon node.
	if err := v.db.SlashableAttestationCheck(ctx, indexedAtt, pubKey, signingRoot, v.emitAccountMetrics, ValidatorAttestFailVec); err != nil {
		log.WithError(err).Error("Failed attestation slashing protection check")
		log.WithFields(
			attestationLogFields(pubKey, indexedAtt),
		).Debug("Attempted slashable attestation details")
		tracing.AnnotateError(span, err)
		return
	}

	var aggregationBitfield bitfield.Bitlist
	var attestation ethpb.Att
	var attResp *ethpb.AttestResponse
	if postElectra {
		sa := &ethpb.SingleAttestation{
			Data:          data,
			AttesterIndex: duty.ValidatorIndex,
			CommitteeId:   duty.CommitteeIndex,
			Signature:     sig,
		}
		attestation = sa
		attResp, err = v.validatorClient.ProposeAttestationElectra(ctx, sa)
	} else {
		aggregationBitfield = bitfield.NewBitlist(duty.CommitteeLength)
		aggregationBitfield.SetBitAt(duty.ValidatorCommitteeIndex, true)
		a := &ethpb.Attestation{
			Data:            data,
			AggregationBits: aggregationBitfield,
			Signature:       sig,
		}
		attestation = a
		attResp, err = v.validatorClient.ProposeAttestation(ctx, a)
	}
	if err != nil {
		log.WithError(err).Error("Could not submit attestation to beacon node")
		if v.emitAccountMetrics {
			ValidatorAttestFailVec.WithLabelValues(fmtKey).Inc()
		}
		tracing.AnnotateError(span, err)
		return
	}

	if err := v.saveSubmittedAtt(attestation, pubKey[:], false); err != nil {
		log.WithError(err).Error("Could not save validator index for logging")
		if v.emitAccountMetrics {
			ValidatorAttestFailVec.WithLabelValues(fmtKey).Inc()
		}
		tracing.AnnotateError(span, err)
		return
	}

	span.SetAttributes(
		trace.Int64Attribute("slot", int64(slot)), // lint:ignore uintcast -- This conversion is OK for tracing.
		trace.StringAttribute("attestationHash", fmt.Sprintf("%#x", attResp.AttestationDataRoot)),
		trace.StringAttribute("blockRoot", fmt.Sprintf("%#x", data.BeaconBlockRoot)),
		trace.Int64Attribute("justifiedEpoch", int64(data.Source.Epoch)),
		trace.Int64Attribute("targetEpoch", int64(data.Target.Epoch)),
	)
	if postElectra {
		span.SetAttributes(trace.Int64Attribute("attesterIndex", int64(duty.ValidatorIndex)))
		span.SetAttributes(trace.Int64Attribute("committeeIndex", int64(duty.CommitteeIndex)))
	} else {
		span.SetAttributes(trace.StringAttribute("aggregationBitfield", fmt.Sprintf("%#x", aggregationBitfield)))
		span.SetAttributes(trace.Int64Attribute("committeeIndex", int64(data.CommitteeIndex)))
	}

	if v.emitAccountMetrics {
		ValidatorAttestSuccessVec.WithLabelValues(fmtKey).Inc()
		ValidatorAttestedSlotsGaugeVec.WithLabelValues(fmtKey).Set(float64(slot))
	}
}
