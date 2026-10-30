func (s *Service) ForkchoiceUpdated(
	ctx context.Context, state *pb.ForkchoiceState, attrs payloadattribute.Attributer,
) (*pb.PayloadIDBytes, []byte, error) {
	d := time.Now().Add(time.Duration(params.BeaconConfig().ExecutionEngineTimeoutValue) * time.Second)
	ctx, cancel := context.WithDeadline(ctx, d)
	defer cancel()
	result := &ForkchoiceUpdatedResponse{}

	if attrs == nil {
		return nil, nil, errors.New("nil payload attributer")
	}
	switch attrs.Version() {
	case version.Bellatrix:
		a, err := attrs.PbV1()
		if err != nil {
			return nil, nil, err
		}
		err = s.rpcClient.CallContext(ctx, result, ForkchoiceUpdatedMethod, state, a)
		if err != nil {
			return nil, nil, handleRPCError(err)
		}
	case version.Capella:
		a, err := attrs.PbV2()
		if err != nil {
			return nil, nil, err
		}
		err = s.rpcClient.CallContext(ctx, result, ForkchoiceUpdatedMethodV2, state, a)
		if err != nil {
			return nil, nil, handleRPCError(err)
		}
	case version.Deneb, version.Electra, version.Fulu:
		a, err := attrs.PbV3()
		if err != nil {
			return nil, nil, err
		}
		err = s.rpcClient.CallContext(ctx, result, ForkchoiceUpdatedMethodV3, state, a)
		if err != nil {
			return nil, nil, handleRPCError(err)
		}
	case version.Gloas:
		a, err := attrs.PbV4()
		if err != nil {
			return nil, nil, err
		}
		err = s.rpcClient.CallContext(ctx, result, ForkchoiceUpdatedMethodV4, state, a)
		if err != nil {
			return nil, nil, handleRPCError(err)
		}
	default:
		return nil, nil, fmt.Errorf("unknown payload attribute version: %v", attrs.Version())
	}

	if result.Status == nil {
		return nil, nil, ErrNilResponse
	}
	resp := result.Status
	switch resp.Status {
	case pb.PayloadStatus_SYNCING:
		return nil, nil, ErrAcceptedSyncingPayloadStatus
	case pb.PayloadStatus_INVALID:
		return nil, resp.LatestValidHash, ErrInvalidPayloadStatus
	case pb.PayloadStatus_VALID:
		return result.PayloadId, resp.LatestValidHash, nil
	default:
		return nil, nil, ErrUnknownPayloadStatus
	}
}
