// SlashableAttestationCheck checks if an attestation is slashable by comparing it with the attesting
// history for the given public key in our complete slashing protection database defined by EIP-3076.
// If it is not, it updates the database.
func (s *Store) SlashableAttestationCheck(
	ctx context.Context,
	indexedAtt ethpb.IndexedAtt,
	pubKey [fieldparams.BLSPubkeyLength]byte,
	signingRoot32 [32]byte,
	emitAccountMetrics bool,
	validatorAttestFailVec *prometheus.CounterVec,
) error {
	ctx, span := trace.StartSpan(ctx, "validator.postAttSignUpdate")
	defer span.End()

	signingRoot := signingRoot32[:]

	// Based on EIP-3076, validator should refuse to sign any attestation with source epoch less
	// than the minimum source epoch present in that signer’s attestations.
	lowestSourceEpoch, exists, err := s.LowestSignedSourceEpoch(ctx, pubKey)
	if err != nil {
		return err
	}
	if exists && indexedAtt.GetData().Source.Epoch < lowestSourceEpoch {
		return fmt.Errorf(
			"could not sign attestation lower than lowest source epoch in db, %d < %d",
			indexedAtt.GetData().Source.Epoch,
			lowestSourceEpoch,
		)
	}
	existingSigningRoot, err := s.SigningRootAtTargetEpoch(ctx, pubKey, indexedAtt.GetData().Target.Epoch)
	if err != nil {
		return err
	}
	signingRootsDiffer := slashings.SigningRootsDiffer(existingSigningRoot, signingRoot)

	// Based on EIP-3076, validator should refuse to sign any attestation with target epoch less
	// than or equal to the minimum target epoch present in that signer’s attestations, except
	// if it is a repeat signing as determined by the signingRoot.
	lowestTargetEpoch, exists, err := s.LowestSignedTargetEpoch(ctx, pubKey)
	if err != nil {
		return err
	}
	if signingRootsDiffer && exists && indexedAtt.GetData().Target.Epoch <= lowestTargetEpoch {
		return fmt.Errorf(
			"could not sign attestation lower than or equal to lowest target epoch in db if signing roots differ, %d <= %d",
			indexedAtt.GetData().Target.Epoch,
			lowestTargetEpoch,
		)
	}
	fmtKey := "0x" + hex.EncodeToString(pubKey[:])
	slashingKind, err := s.CheckSlashableAttestation(ctx, pubKey, signingRoot, indexedAtt)
	if err != nil {
		if emitAccountMetrics {
			validatorAttestFailVec.WithLabelValues(fmtKey).Inc()
		}
		switch slashingKind {
		case DoubleVote:
			log.Warn("Attestation is slashable as it is a double vote")
		case SurroundingVote:
			log.Warn("Attestation is slashable as it is surrounding a previous attestation")
		case SurroundedVote:
			log.Warn("Attestation is slashable as it is surrounded by a previous attestation")
		}
		return errors.Wrap(err, failedAttLocalProtectionErr)
	}

	if err := s.SaveAttestationForPubKey(ctx, pubKey, signingRoot32[:], indexedAtt); err != nil {
		return errors.Wrap(err, "could not save attestation history for validator public key")
	}

	return nil
}
