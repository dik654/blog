// beacon-chain/execution/engine_client.go — Engine API calls (prysm v5.x)

// NewPayload sends an execution payload to the EL for validation.
// CL이 새 블록을 받으면 실행 페이로드를 EL에 전달하여 검증 요청한다.
func (s *Service) NewPayload(
	ctx context.Context, payload interfaces.ExecutionData,
	versionedHashes []common.Hash, parentBlockRoot *common.Hash,
) ([]byte, error) {
	// Deneb 이후: versionedHashes와 parentBlockRoot 포함
	d := buildNewPayloadRequest(payload, versionedHashes, parentBlockRoot)
	result := &pb.PayloadStatus{}
	err := s.rpcClient.CallContext(ctx, result, NewPayloadMethodV3, d)
	if err != nil {
		return nil, handleRPCError(err)
	}
	// VALID, INVALID, SYNCING, ACCEPTED 상태 반환
	switch result.Status {
	case pb.PayloadStatus_VALID:
		return result.LatestValidHash, nil
	case pb.PayloadStatus_INVALID:
		return result.LatestValidHash, ErrInvalidPayload
	default:
		return nil, ErrUnknownPayloadStatus
	}
}

// ForkchoiceUpdated informs the EL of the current head, safe, finalized.
// 포크 선택 결과를 EL에 전달 + 페이로드 빌드 트리거
func (s *Service) ForkchoiceUpdated(
	ctx context.Context,
	state *pb.ForkchoiceState, attrs interfaces.PayloadAttributer,
) (*pb.PayloadIDBytes, []byte, error) {
	result := &pb.ForkchoiceUpdatedResponse{}
	err := s.rpcClient.CallContext(ctx, result,
		ForkchoiceUpdatedMethodV3, state, attrs,
	)
	if err != nil {
		return nil, nil, handleRPCError(err)
	}
	// payloadID가 있으면 EL이 블록 빌드를 시작한 것
	return result.PayloadId, result.PayloadStatus.LatestValidHash, nil
}
