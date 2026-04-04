// beacon-chain/core/altair/sync_committee.go (Prysm v5)

// ProcessSyncAggregate — 블록의 SyncAggregate를 처리한다.
// 참여한 싱크 위원회 멤버에게 보상, 불참 멤버에게 패널티를 적용한다.
func ProcessSyncAggregate(
	ctx context.Context, state state.BeaconState,
	aggregate *ethpb.SyncAggregate,
) (state.BeaconState, error) {
	committee, err := state.CurrentSyncCommittee()
	if err != nil {
		return nil, err
	}
	// 참여 비트필드에서 서명한 멤버 확인
	participantIndices := make([]primitives.ValidatorIndex, 0)
	for i, pubkey := range committee.Pubkeys {
		if aggregate.SyncCommitteeBits.BitAt(uint64(i)) {
			idx, _ := state.ValidatorIndexByPubkey(bytesutil.ToBytes48(pubkey))
			participantIndices = append(participantIndices, idx)
		}
	}
	// 참여자 보상 계산
	totalActiveBalance := helpers.TotalActiveBalance(state)
	reward := totalActiveBalance / uint64(len(committee.Pubkeys)) /
		params.BeaconConfig().SlotsPerEpoch
	// 참여자에게 보상 지급
	for _, idx := range participantIndices {
		helpers.IncreaseBalance(state, idx, reward)
	}
	// 불참자에게 패널티 부과
	allMembers := helpers.SyncCommitteeIndices(state)
	for _, idx := range allMembers {
		if !slices.Contains(participantIndices, idx) {
			helpers.DecreaseBalance(state, idx, reward)
		}
	}
	return state, nil
}
