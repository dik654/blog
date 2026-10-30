func getPayloadMethodAndMessage(slot primitives.Slot) (string, proto.Message) {
	epoch := slots.ToEpoch(slot)
	if epoch >= params.BeaconConfig().GloasForkEpoch {
		return GetPayloadMethodV6, &pb.ExecutionBundleGloas{}
	}
	if epoch >= params.BeaconConfig().FuluForkEpoch {
		return GetPayloadMethodV5, &pb.ExecutionBundleFulu{}
	}
	if epoch >= params.BeaconConfig().ElectraForkEpoch {
		return GetPayloadMethodV4, &pb.ExecutionBundleElectra{}
	}
	if epoch >= params.BeaconConfig().DenebForkEpoch {
		return GetPayloadMethodV3, &pb.ExecutionPayloadDenebWithValueAndBlobsBundle{}
	}
	if epoch >= params.BeaconConfig().CapellaForkEpoch {
		return GetPayloadMethodV2, &pb.ExecutionPayloadCapellaWithValue{}
	}
	return GetPayloadMethod, &pb.ExecutionPayload{}
}

func (s *Service) GetPayload(ctx context.Context, payloadId [8]byte, slot primitives.Slot) (*blocks.GetPayloadResponse, error) {
	d := time.Now().Add(getPayloadTimeout(slot))
	ctx, cancel := context.WithDeadline(ctx, d)
	defer cancel()

	method, result := getPayloadMethodAndMessage(slot)
	err := s.rpcClient.CallContext(ctx, result, method, pb.PayloadIDBytes(payloadId))
	if err != nil {
		return nil, handleRPCError(err)
	}
	res, err := blocks.NewGetPayloadResponse(result)
	if err != nil {
		return nil, errors.Wrap(err, "new get payload response")
	}
	return res, nil
}
