// validator/client/sync_committee.go (Prysm v5)

// SubmitSyncCommitteeMessage — 싱크 위원회 멤버가 매 슬롯 서명을 제출한다.
// 라이트 클라이언트가 체인 헤드를 빠르게 검증할 수 있도록 돕는 메커니즘.
func (v *validator) SubmitSyncCommitteeMessage(ctx context.Context,
	slot primitives.Slot, pubKey [fieldparams.BLSPubkeyLength]byte,
) {
	// 1. 현재 헤드 블록 루트 조회
	headRoot, err := v.validatorClient.HeadBlockRoot(ctx)
	if err != nil {
		log.WithError(err).Error("Could not get head root")
		return
	}
	// 2. 블록 루트에 BLS 서명 생성
	sig, err := v.keyManager.Sign(ctx, &validatorpb.SignRequest{
		PublicKey:   pubKey[:],
		SigningRoot: headRoot,
		SignatureDomain: params.BeaconConfig().DomainSyncCommittee,
	})
	if err != nil {
		log.WithError(err).Error("Could not sign sync message")
		return
	}
	// 3. SyncCommitteeMessage 구성 + 제출
	msg := &ethpb.SyncCommitteeMessage{
		Slot:           slot,
		BlockRoot:      headRoot,
		ValidatorIndex: v.validatorIndex(pubKey),
		Signature:      sig.Marshal(),
	}
	if _, err := v.validatorClient.SubmitSyncMessage(ctx, msg); err != nil {
		log.WithError(err).Error("Could not submit sync message")
		return
	}
	log.WithField("slot", slot).Info("Submitted sync committee message")
}
