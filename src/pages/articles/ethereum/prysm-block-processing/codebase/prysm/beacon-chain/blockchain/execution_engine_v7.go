// OffchainLabs/prysm v7.3.1 @ 96d418cd
// beacon-chain/blockchain/execution_engine.go — 발췌

func (s *Service) notifyNewPayload(
	ctx context.Context,
	stVersion int,
	header interfaces.ExecutionData,
	blk blocktypes.ROBlock,
) (bool, error) {
	if stVersion < version.Bellatrix {
		return true, nil
	}
	if blk.Version() >= version.Gloas {
		return false, nil
	}

	body := blk.Block().Body()
	enabled, err := blocks.IsExecutionEnabledUsingHeader(header, body)
	if err != nil {
		return false, errors.Wrap(invalidBlock{error: err}, "could not determine if execution is enabled")
	}
	if !enabled {
		return true, nil
	}
	payload, err := body.Execution()
	if err != nil {
		return false, errors.Wrap(invalidBlock{error: err}, "could not get execution payload")
	}

	var lastValidHash []byte
	var parentRoot *common.Hash
	var versionedHashes []common.Hash
	var requests *enginev1.ExecutionRequests
	if blk.Version() >= version.Deneb {
		versionedHashes, err = kzgCommitmentsToVersionedHashes(blk.Block().Body())
		if err != nil {
			return false, errors.Wrap(err, "could not get versioned hashes to feed the engine")
		}
		prh := common.Hash(blk.Block().ParentRoot())
		parentRoot = &prh
	}
	if blk.Version() >= version.Electra {
		requests, err = blk.Block().Body().ExecutionRequests()
		if err != nil {
			return false, errors.Wrap(err, "could not get execution requests")
		}
		if requests == nil {
			return false, errors.New("nil execution requests")
		}
	}

	var requester enginev1.ExecutionRequester
	if requests != nil {
		requester = requests
	}
	lastValidHash, err = s.cfg.ExecutionEngineCaller.NewPayload(
		ctx, payload, versionedHashes, parentRoot, requester,
	)
	if err == nil {
		return true, nil
	}
	if errors.Is(err, execution.ErrAcceptedSyncingPayloadStatus) {
		return false, nil
	}
	if errors.Is(err, execution.ErrInvalidPayloadStatus) {
		return false, invalidBlock{
			error:         ErrInvalidPayload,
			lastValidHash: bytesutil.ToBytes32(lastValidHash),
		}
	}
	return false, errors.WithMessage(ErrUndefinedExecutionEngineError, err.Error())
}
