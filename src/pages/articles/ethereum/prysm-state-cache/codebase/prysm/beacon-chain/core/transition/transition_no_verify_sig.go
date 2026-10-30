// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/core/transition/transition_no_verify_sig.go — 경계 발췌

func ProcessBlockForStateRoot(
	ctx context.Context,
	st state.BeaconState,
	signed interfaces.ReadOnlySignedBeaconBlock,
) (state.BeaconState, error) {
	blk := signed.Block()
	body := blk.Body()
	bodyRoot, err := body.HashTreeRoot()
	if err != nil {
		return nil, err
	}
	parentRoot := blk.ParentRoot()
	st, err = b.ProcessBlockHeaderNoVerify(
		ctx, st, blk.Slot(), blk.ProposerIndex(), parentRoot[:], bodyRoot[:],
	)
	if err != nil {
		return nil, err
	}

	// 실제 함수는 여기서 execution context, RANDAO, Eth1 data,
	// operations와 sync aggregate를 순서대로 적용합니다.
	// Signature와 post-state root 비교는 이 함수 안에 없습니다.
	return st, nil
}
