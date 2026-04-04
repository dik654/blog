// beacon-chain/blockchain/process_block.go — Prysm v5

// onBlock은 새 블록을 수신했을 때 상태 전이 + 포크 선택을 수행한다.
// gossip이나 sync에서 블록이 도착하면 이 함수가 호출된다.
func (s *Service) onBlock(ctx context.Context, signed interfaces.ReadOnlySignedBeaconBlock) error {
	block := signed.Block()
	// 1. 부모 상태 조회
	preState, err := s.getBlockPreState(ctx, block)
	if err != nil {
		return err
	}
	// 2. 슬롯 전진 (빈 슬롯 처리 포함)
	postState, err := transition.ProcessSlots(ctx, preState, block.Slot())
	if err != nil {
		return err
	}
	// 3. 블록 상태 전이 (헤더, RANDAO, operations)
	postState, err = transition.ProcessBlockNoVerifyAnySig(ctx, postState, signed)
	if err != nil {
		return err
	}
	// 4. 실행 페이로드 검증 (CL → EL)
	if err := s.validateExecutionOnBlock(ctx, postState, signed); err != nil {
		return err
	}
	// 5. 포크 선택 업데이트
	s.forkchoiceStore.InsertNode(ctx, signed, postState)
	// 6. DB 저장
	return s.saveBlock(ctx, signed, postState)
}

// validateExecutionOnBlock은 Engine API를 통해 EL에 페이로드 검증을 요청한다.
func (s *Service) validateExecutionOnBlock(ctx context.Context, state state.BeaconState, signed interfaces.ReadOnlySignedBeaconBlock) error {
	payload, err := signed.Block().Body().Execution()
	if err != nil {
		return err
	}
	result, err := s.cfg.ExecutionEngineCaller.NewPayload(ctx, payload)
	if err != nil {
		return err
	}
	if result.Status != enginev1.VALID {
		return fmt.Errorf("execution payload invalid: %v", result.Status)
	}
	return nil
}
