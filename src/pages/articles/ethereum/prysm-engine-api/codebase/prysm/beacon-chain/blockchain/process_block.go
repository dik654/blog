// beacon-chain/blockchain/process_block.go — notifyNewPayload (prysm v5.x)

// notifyNewPayload sends the execution payload to the EL.
// 블록 처리 파이프라인에서 실행 페이로드 검증을 트리거한다.
func (s *Service) notifyNewPayload(
	ctx context.Context, blk interfaces.ReadOnlySignedBeaconBlock,
) error {
	// 실행 페이로드 추출 (Bellatrix 이후 블록만)
	payload, err := blk.Block().Body().Execution()
	if err != nil {
		return errors.Wrap(err, "could not get execution payload")
	}
	// Deneb: blob versioned hashes 추출
	versionedHashes, err := blk.Block().Body().BlobKzgCommitments()
	if err != nil {
		return err
	}
	// Engine API 호출: NewPayload
	lastValidHash, err := s.cfg.ExecutionEngineCaller.NewPayload(
		ctx, payload, kzgToVersionedHashes(versionedHashes),
		blk.Block().ParentRoot(),
	)
	if err != nil {
		// INVALID → 해당 블록을 포크 선택에서 제거
		if errors.Is(err, execution.ErrInvalidPayload) {
			s.cfg.ForkChoiceStore.SetOptimisticToInvalid(
				ctx, blk.Block().ParentRoot(), lastValidHash,
			)
		}
		return err
	}
	return nil
}
