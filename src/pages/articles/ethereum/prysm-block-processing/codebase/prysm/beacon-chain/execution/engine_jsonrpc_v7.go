// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/execution/engine_jsonrpc.go — 발췌

func (s *Service) NewPayload(
	ctx context.Context,
	payload interfaces.ExecutionData,
	versionedHashes []common.Hash,
	parentBlockRoot *common.Hash,
	executionRequests pb.ExecutionRequester,
) ([]byte, error) {
	result := &pb.PayloadStatus{}

	switch payloadPb := payload.Proto().(type) {
	case *pb.ExecutionPayload:
		err := s.rpcClient.CallContext(ctx, result, NewPayloadMethod, payloadPb)
		if err != nil { return nil, handleRPCError(err) }
	case *pb.ExecutionPayloadCapella:
		err := s.rpcClient.CallContext(ctx, result, NewPayloadMethodV2, payloadPb)
		if err != nil { return nil, handleRPCError(err) }
	case *pb.ExecutionPayloadDeneb:
		if executionRequests == nil {
			err := s.rpcClient.CallContext(ctx, result, NewPayloadMethodV3, payloadPb, versionedHashes, parentBlockRoot)
			if err != nil { return nil, handleRPCError(err) }
		} else {
			flattenedRequests, err := executionRequests.FlattenRequests()
			if err != nil { return nil, errors.Wrap(err, "failed to encode execution requests") }
			err = s.rpcClient.CallContext(ctx, result, NewPayloadMethodV4, payloadPb, versionedHashes, parentBlockRoot, flattenedRequests)
			if err != nil { return nil, handleRPCError(err) }
		}
	}

	switch result.Status {
	case pb.PayloadStatus_ACCEPTED, pb.PayloadStatus_SYNCING:
		return nil, ErrAcceptedSyncingPayloadStatus
	case pb.PayloadStatus_INVALID:
		return result.LatestValidHash, ErrInvalidPayloadStatus
	case pb.PayloadStatus_VALID:
		return result.LatestValidHash, nil
	default:
		return nil, errors.Wrapf(ErrUnknownPayloadStatus, "unknown payload status: %s", result.Status.String())
	}
}
