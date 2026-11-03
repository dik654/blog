// Given validator's public key, this function returns the signature of an attestation data and its signing root.
func (v *validator) signAtt(ctx context.Context, pubKey [fieldparams.BLSPubkeyLength]byte, data *ethpb.AttestationData, slot primitives.Slot) ([]byte, [32]byte, error) {
	ctx, span := trace.StartSpan(ctx, "validator.signAtt")
	defer span.End()

	domain, root, err := v.domainAndSigningRoot(ctx, data)
	if err != nil {
		return nil, [32]byte{}, err
	}
	sig, err := v.km.Sign(ctx, &validatorpb.SignRequest{
		PublicKey:       pubKey[:],
		SigningRoot:     root[:],
		SignatureDomain: domain.SignatureDomain,
		Object:          &validatorpb.SignRequest_AttestationData{AttestationData: data},
		SigningSlot:     slot,
	})
	if err != nil {
		return nil, [32]byte{}, err
	}

	return sig.Marshal(), root, nil
}

func (v *validator) domainAndSigningRoot(ctx context.Context, data *ethpb.AttestationData) (*ethpb.DomainResponse, [32]byte, error) {
	domain, err := v.domainData(ctx, data.Target.Epoch, params.BeaconConfig().DomainBeaconAttester[:])
	if err != nil {
		return nil, [32]byte{}, err
	}
	root, err := signing.ComputeSigningRoot(data, domain.SignatureDomain)
	if err != nil {
		return nil, [32]byte{}, err
	}
	return domain, root, nil
}
