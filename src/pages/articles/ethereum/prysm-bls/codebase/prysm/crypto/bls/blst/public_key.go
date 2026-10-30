// OffchainLabs Prysm v7.3.1 @ 96d418cd
// crypto/bls/blst/public_key.go — focused source excerpt

// PublicKeyFromBytes creates a BLS public key from a BigEndian byte slice.
func PublicKeyFromBytes(pubKey []byte) (common.PublicKey, error) {
	return publicKeyFromBytes(pubKey, true)
}

func publicKeyFromBytes(pubKey []byte, cacheCopy bool) (common.PublicKey, error) {
	if len(pubKey) != params.BeaconConfig().BLSPubkeyLength {
		return nil, fmt.Errorf("public key must be %d bytes", params.BeaconConfig().BLSPubkeyLength)
	}
	newKey := (*[fieldparams.BLSPubkeyLength]byte)(pubKey)
	if cv, ok := pubkeyCache.pubkey(*newKey); ok {
		if cacheCopy {
			return cv.Copy(), nil
		}
		return cv, nil
	}
	// Subgroup check NOT done when decompressing pubkey.
	p := new(blstPublicKey).Uncompress(pubKey)
	if p == nil {
		return nil, errors.New("could not unmarshal bytes into public key")
	}
	// Subgroup and infinity check
	if !p.KeyValidate() {
		return nil, common.ErrInfinitePubKey
	}
	pubKeyObj := &PublicKey{p: p}
	copiedKey := pubKeyObj.Copy()
	pubkeyCache.setPubkey(*newKey, copiedKey)
	return pubKeyObj, nil
}
