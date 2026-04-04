// beacon-chain/rpc/prysm/v1alpha1/validator/proposer.go — Prysm v5

// GetBlock은 검증자 클라이언트의 블록 제안 요청을 처리한다.
// 어테스테이션, 예치금, 서명을 수집하여 완성된 블록을 반환한다.
func (vs *Server) GetBlock(ctx context.Context, req *ethpb.BlockRequest) (*ethpb.GenericBeaconBlock, error) {
	// 1. 헤드 상태 조회 + 슬롯 전진
	headState, err := vs.HeadFetcher.HeadStateReadOnly(ctx)
	if err != nil {
		return nil, err
	}
	headState, err = transition.ProcessSlots(ctx, headState, req.Slot)
	if err != nil {
		return nil, err
	}
	// 2. 제안자 인덱스 확인
	idx, err := helpers.BeaconProposerIndex(ctx, headState)
	if err != nil {
		return nil, err
	}
	// 3. 어테스테이션 수집 (풀에서 최적 선택)
	atts := vs.AttPool.AggregatedAttestations()
	atts = vs.filterAttestations(ctx, headState, atts)

	// 4. eth1 데이터 + 예치금 수집
	eth1Data, deposits := vs.getEth1DataAndDeposits(ctx, headState)

	// 5. 블록 조립
	block := &ethpb.BeaconBlock{
		Slot:          req.Slot,
		ProposerIndex: idx,
		ParentRoot:    vs.HeadFetcher.HeadRoot(ctx),
		Body: &ethpb.BeaconBlockBody{
			RandaoReveal: req.RandaoReveal,
			Eth1Data:     eth1Data,
			Graffiti:     req.Graffiti,
			Attestations: atts,
			Deposits:     deposits,
		},
	}
	// 6. 상태 루트 계산
	stateRoot, err := vs.computeStateRoot(ctx, block)
	if err != nil {
		return nil, err
	}
	block.StateRoot = stateRoot
	return block, nil
}
