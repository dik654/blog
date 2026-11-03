// Sign signs the message by using a remote web3signer server.
func (km *Keymanager) Sign(ctx context.Context, request *validatorpb.SignRequest) (bls.Signature, error) {
	signRequest, err := getSignRequestJson(ctx, km.validator, request, km.genesisValidatorsRoot)
	if err != nil {
		return nil, err
	}
	signature, err := km.client.Sign(ctx, hexutil.Encode(request.PublicKey), signRequest)
	if err != nil {
		erroredResponsesTotal.Inc()
		return nil, errors.Wrap(err, "failed to sign the request")
	}
	log.WithField("publicKey", request.PublicKey).Debug("Successfully signed the request")
	signRequestsTotal.Inc()
	return signature, nil
}
