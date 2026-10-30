// OffchainLabs Prysm v7.3.1 @ 96d418cd
// crypto/bls/blst/signature.go — focused source excerpts

var dst = []byte("BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_")

const scalarBytes = 32
const randBitsEntropy = 64

// SignatureFromBytes creates a BLS signature from a LittleEndian byte slice.
func SignatureFromBytes(sig []byte) (common.Signature, error) {
	signature, err := signatureFromBytesNoValidation(sig)
	if err != nil {
		return nil, errors.Wrap(err, "could not create signature from byte slice")
	}
	// Group check signature. Do not check for infinity since an aggregated signature
	// could be infinite.
	if !signature.SigValidate(false) {
		return nil, errors.New("signature not in group")
	}
	return &Signature{s: signature}, nil
}

// Verify a bls signature given a public key, a message.
func (s *Signature) Verify(pubKey common.PublicKey, msg []byte) bool {
	// Signature and PKs are assumed to have been validated upon decompression!
	return s.s.Verify(false, pubKey.(*PublicKey).p, false, msg, dst)
}

// FastAggregateVerify verifies all the provided public keys with their aggregated signature.
func (s *Signature) FastAggregateVerify(pubKeys []common.PublicKey, msg [32]byte) bool {
	if len(pubKeys) == 0 {
		return false
	}
	rawKeys := make([]*blstPublicKey, len(pubKeys))
	for i := range pubKeys {
		rawKeys[i] = pubKeys[i].(*PublicKey).p
	}
	return s.s.FastAggregateVerify(true, rawKeys, msg[:], dst)
}

// VerifyMultipleSignatures verifies a non-singular set of signatures and its respective pubkeys and messages.
func VerifyMultipleSignatures(sigs [][]byte, msgs [][32]byte, pubKeys []common.PublicKey) (bool, error) {
	if len(sigs) == 0 || len(pubKeys) == 0 {
		return false, nil
	}
	rawSigs := new(blstSignature).BatchUncompress(sigs)

	length := len(sigs)
	if length != len(pubKeys) || length != len(msgs) {
		return false, errors.Errorf("provided signatures, pubkeys and messages have differing lengths. S: %d, P: %d,M %d",
			length, len(pubKeys), len(msgs))
	}
	mulP1Aff := make([]*blstPublicKey, length)
	rawMsgs := make([]blst.Message, length)

	for i := range length {
		mulP1Aff[i] = pubKeys[i].(*PublicKey).p
		rawMsgs[i] = msgs[i][:]
	}
	randGen := rand.NewGenerator()
	randLock := new(sync.Mutex)

	randFunc := func(scalar *blst.Scalar) {
		var rbytes [scalarBytes]byte
		randLock.Lock()
		randGen.Read(rbytes[:]) // #nosec G104 -- Error will always be nil in `read` in math/rand
		randLock.Unlock()
		rbytes[len(rbytes)-1] |= 0x01
		scalar.FromBEndian(rbytes[:])
	}
	dummySig := new(blstSignature)

	return dummySig.MultipleAggregateVerify(rawSigs, true, mulP1Aff, false, rawMsgs, dst, randFunc, randBitsEntropy), nil
}
