// crypto/bls/blst/signature.go — Verify + Aggregate (prysm v5.x)

// Verify checks a single BLS signature against a public key and message.
// e(sig, G2) == e(H(msg), pk) 패어링 검증
func (s *Signature) Verify(pubKey common.PublicKey, msg []byte) bool {
	return s.s.Verify(
		false,              // compress: false
		pubKey.(*PublicKey).p, // *blst.P1Affine
		false,              // hash: false (already in G2)
		msg,                // 메시지
		dst,                // Domain Separation Tag
	)
}

// AggregateVerify verifies multiple (pk, msg) pairs against one aggregate sig.
// 서로 다른 메시지에 대한 집계 서명 검증
func (s *Signature) AggregateVerify(
	pubKeys []common.PublicKey, msgs [][32]byte,
) bool {
	pks := make([]*blstPublicKey, len(pubKeys))
	for i, pk := range pubKeys {
		pks[i] = pk.(*PublicKey).p
	}
	return s.s.AggregateVerify(false, pks, false, msgs, dst)
}

// FastAggregateVerify — 동일 메시지, 다수 서명자 (어테스테이션 최적화)
// 모든 pk를 먼저 집계한 뒤 단일 패어링만 수행 → O(1) 패어링
func (s *Signature) FastAggregateVerify(
	pubKeys []common.PublicKey, msg [32]byte,
) bool {
	pks := make([]*blstPublicKey, len(pubKeys))
	for i, pk := range pubKeys {
		pks[i] = pk.(*PublicKey).p
	}
	return s.s.FastAggregateVerify(true, pks, msg, dst)
}
