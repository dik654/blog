// OffchainLabs Prysm v7.3.1 @ 96d418cd
// crypto/bls/blst/secret_key.go — focused source excerpt

// PublicKey obtains the public key corresponding to the BLS secret key.
func (s *bls12SecretKey) PublicKey() common.PublicKey {
	return &PublicKey{p: new(blstPublicKey).From(s.p)}
}

// Sign a message using a secret key - in a beacon/validator client.
//
// In the Ethereum proof of stake specification:
// def Sign(SK: int, message: Bytes) -> BLSSignature
func (s *bls12SecretKey) Sign(msg []byte) common.Signature {
	signature := new(blstSignature).Sign(s.p, msg, dst)
	return &Signature{s: signature}
}
