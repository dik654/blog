// validator/client/attest.go (Prysm v5)

// SubmitAttestation — 어테스테이션을 생성하고 비콘 노드에 제출한다.
func (v *validator) SubmitAttestation(ctx context.Context,
	slot primitives.Slot, pubKey [fieldparams.BLSPubkeyLength]byte,
) {
	// 1. 위원회 할당 조회 (어떤 서브넷에서 투표할지)
	duty, err := v.duty(pubKey)
	if err != nil {
		log.WithError(err).Error("Could not get duty")
		return
	}
	// 2. 비콘 노드에서 AttestationData 수신
	data, err := v.validatorClient.AttestationData(ctx, &ethpb.AttestationDataRequest{
		Slot:           slot,
		CommitteeIndex: duty.CommitteeIndex,
	})
	if err != nil {
		log.WithError(err).Error("Could not get attestation data")
		return
	}
	// 3. 슬래싱 방지 DB 확인
	if err := v.slashableAttestationCheck(ctx, data, pubKey); err != nil {
		log.WithError(err).Warn("Slashable attestation detected")
		return
	}
	// 4. BLS 서명
	sig, err := v.signAttestation(ctx, pubKey, data)
	if err != nil {
		log.WithError(err).Error("Could not sign attestation")
		return
	}
	// 5. 서브넷 계산 후 비콘 노드에 제출
	subnet := helpers.ComputeSubnetForAttestation(
		duty.CommitteeIndex, duty.CommitteesAtSlot,
	)
	att := &ethpb.Attestation{Data: data, Signature: sig}
	v.validatorClient.ProposeAttestation(ctx, att)
	log.WithFields(logrus.Fields{
		"slot": slot, "subnet": subnet,
	}).Info("Submitted attestation")
}
