// IKeymanager defines a general keymanager interface for Prysm wallets.
type IKeymanager interface {
	PublicKeysFetcher
	Signer
	KeyChangeSubscriber
	KeyStoreExtractor
	AccountLister
	Deleter
}

// KeysFetcher for validating private and public keys.
type KeysFetcher interface {
	FetchValidatingPrivateKeys(ctx context.Context) ([][32]byte, error)
	PublicKeysFetcher
}

// PublicKeysFetcher for validating public keys.
type PublicKeysFetcher interface {
	FetchValidatingPublicKeys(ctx context.Context) ([][fieldparams.BLSPubkeyLength]byte, error)
}

// Signer allows signing messages using a validator private key.
type Signer interface {
	Sign(context.Context, *validatorpb.SignRequest) (bls.Signature, error)
}
