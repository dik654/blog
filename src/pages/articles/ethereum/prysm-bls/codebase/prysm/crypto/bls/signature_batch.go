// OffchainLabs Prysm v7.3.1 @ 96d418cd
// crypto/bls/signature_batch.go — focused source excerpt

// Verify the current signature batch using the batch verify algorithm.
func (s *SignatureBatch) Verify() (bool, error) {
	return VerifyMultipleSignatures(s.Signatures, s.Messages, s.PublicKeys)
}

// VerifyVerbosely verifies signatures as a whole at first, if fails, fallback
// to verify each single signature to identify invalid ones.
func (s *SignatureBatch) VerifyVerbosely() (bool, error) {
	valid, err := s.Verify()
	if err != nil || valid {
		return valid, err
	}

	var errmsg strings.Builder
	errmsg.WriteString("some signatures are invalid. details:")
	for i := 0; i < len(s.Signatures); i++ {
		sig := s.Signatures[i]
		msg := s.Messages[i]
		pubKey := s.PublicKeys[i]

		valid, err := VerifySignature(sig, msg, pubKey)
		if !valid {
			desc := s.Descriptions[i]
			if err != nil {
				errmsg.WriteString(fmt.Sprintf("\nsignature '%s' is invalid."+
					" signature: 0x%s, public key: 0x%s, message: 0x%v, error: %v",
					desc, hex.EncodeToString(sig), hex.EncodeToString(pubKey.Marshal()),
					hex.EncodeToString(msg[:]), err))
			} else {
				errmsg.WriteString(fmt.Sprintf("\nsignature '%s' is invalid."+
					" signature: 0x%s, public key: 0x%s, message: 0x%v",
					desc, hex.EncodeToString(sig), hex.EncodeToString(pubKey.Marshal()),
					hex.EncodeToString(msg[:])))
			}
		}
	}

	return false, errors.New(errmsg.String())
}
