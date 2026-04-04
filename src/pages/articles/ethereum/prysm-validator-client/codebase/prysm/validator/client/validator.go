// validator/client/validator.go (Prysm v5)

// Run — 검증자 클라이언트 메인 루프. 슬롯 틱마다 의무를 확인·실행한다.
func (v *validator) Run(ctx context.Context) {
	headSlot := v.CanonicalHeadSlot()
	for {
		select {
		case <-ctx.Done():
			return
		case slot := <-v.NextSlot():
			// 1. 슬롯 변경 알림
			log.WithField("slot", slot).Info("New slot")

			// 2. 이 슬롯에서의 의무(역할) 조회
			duties, err := v.RolesAt(ctx, slot)
			if err != nil {
				log.WithError(err).Error("Could not get roles")
				continue
			}

			// 3. 역할별 실행
			for pubkey, roles := range duties {
				for _, role := range roles {
					switch role {
					case iface.RoleProposer:
						go v.ProposeBlock(ctx, slot, pubkey)
					case iface.RoleAttester:
						go v.SubmitAttestation(ctx, slot, pubkey)
					case iface.RoleSyncCommittee:
						go v.SubmitSyncCommitteeMessage(ctx, slot, pubkey)
					case iface.RoleAggregator:
						go v.SubmitAggregateAndProof(ctx, slot, pubkey)
					}
				}
			}
		}
	}
}

// RolesAt — 특정 슬롯에서 각 검증자의 의무를 조회한다.
func (v *validator) RolesAt(ctx context.Context,
	slot primitives.Slot,
) (map[[fieldparams.BLSPubkeyLength]byte][]iface.ValidatorRole, error) {
	duties := make(map[[fieldparams.BLSPubkeyLength]byte][]iface.ValidatorRole)
	// 비콘 노드에 duty 조회 RPC 호출
	resp, err := v.validatorClient.DutiesAt(ctx, slot)
	if err != nil {
		return nil, err
	}
	for _, duty := range resp {
		var roles []iface.ValidatorRole
		if duty.IsProposer {
			roles = append(roles, iface.RoleProposer)
		}
		if duty.IsAttester {
			roles = append(roles, iface.RoleAttester)
		}
		duties[duty.PublicKey] = roles
	}
	return duties, nil
}
