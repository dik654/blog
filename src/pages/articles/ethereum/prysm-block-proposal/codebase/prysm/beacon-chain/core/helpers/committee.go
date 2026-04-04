// beacon-chain/core/helpers/committee.go — Prysm v5

// ComputeProposerIndex는 RANDAO 기반 셔플로 슬롯의 제안자를 결정한다.
// 유효 잔액에 비례한 확률로 선정되어 잔액이 높을수록 제안 기회가 많다.
func ComputeProposerIndex(
	state state.ReadOnlyBeaconState,
	indices []primitives.ValidatorIndex,
	seed [32]byte,
) (primitives.ValidatorIndex, error) {
	if len(indices) == 0 {
		return 0, errors.New("empty active indices")
	}
	maxRandomByte := uint64(1<<8 - 1)
	// RANDAO 시드 기반 반복 추첨
	for i := uint64(0); ; i++ {
		candidateIndex := indices[ComputeShuffledIndex(
			primitives.ValidatorIndex(i%uint64(len(indices))),
			uint64(len(indices)),
			seed,
		)]
		// 해시 기반 랜덤 바이트 추출
		b := hashutil.Hash(append(seed[:], bytesutil.Bytes8(i/32)...))
		randomByte := b[i%32]
		// 유효 잔액 비례 확률 체크
		effectiveBalance := state.Validators()[candidateIndex].EffectiveBalance
		if effectiveBalance*maxRandomByte >= params.BeaconConfig().MaxEffectiveBalance*uint64(randomByte) {
			return candidateIndex, nil
		}
	}
}
