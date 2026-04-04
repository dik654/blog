// crypto/bls/blst/secret_key.go — Sign (prysm v5.x)

// Sign signs a message with the secret key.
// BLST C 라이브러리의 blst_sign_pk_in_g1 을 CGo로 호출한다.
func (s *secretKey) Sign(msg []byte) common.Signature {
	// DST: Domain Separation Tag (BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_)
	signature := new(blstSignature).Sign(
		s.p,           // *blst.SecretKey (32-byte 스칼라)
		msg,           // 서명할 메시지
		dst,           // Domain Separation Tag
	)
	return &Signature{s: signature}
}

// PublicKey derives the public key from the secret key.
// sk * G1 → pk (G1 포인트)
func (s *secretKey) PublicKey() common.PublicKey {
	return &PublicKey{p: new(blstPublicKey).From(s.p)}
}

// Marshal returns the raw 32-byte secret key.
func (s *secretKey) Marshal() []byte {
	return s.p.Serialize()
}

// RandKey generates a cryptographically random secret key.
// crypto/rand → 32 bytes → blst.KeyGen
func RandKey() (common.SecretKey, error) {
	var ikm [32]byte
	_, err := rand.Read(ikm[:])
	if err != nil {
		return nil, err
	}
	sk := blst.KeyGen(ikm[:])
	return &secretKey{p: sk}, nil
}
