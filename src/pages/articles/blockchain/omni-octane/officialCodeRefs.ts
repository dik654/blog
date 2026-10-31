import type { CodeRef } from "@/components/code/types";

const source = "Omni Octane · commit 9864f25fa9bcb473ee34d2442012fc5fbd2683ea";
const excerpt = `${source}에서 긴 로그·오류 문구와 주변 분기를 생략한 제어 흐름 발췌입니다.`;

export const officialOctaneCodeRefs: Record<string, CodeRef> = {
  "prepare-payload": {
    path: "octane/evmengine/keeper/abci.go · PrepareProposal @ 9864f25",
    lang: "go",
    highlight: [1, 43],
    desc: `${excerpt} 제한된 PrepareProposal context 안에서 build를 시작하고 payload를 받아 단 하나의 unsigned Cosmos transaction으로 포장합니다.`,
    code: `const prepareTimeout = time.Second * 10

func (k *Keeper) PrepareProposal(
    ctx sdk.Context,
    req *abci.RequestPrepareProposal,
) (*abci.ResponsePrepareProposal, error) {
    timeoutCtx, cancel := context.WithTimeout(
        ctx.Context(), prepareTimeout,
    )
    defer cancel()
    ctx = ctx.WithContext(timeoutCtx)

    payloadID, height, triggeredAt := k.getOptimisticPayload()
    if reqHeight != height {
        fcr, err := k.startBuild(
            ctx, appHash, req.Time, reqHeight,
        )
        if err != nil { /* network retry */ }
        if isSyncing(fcr.PayloadStatus) { /* abort */ }
        if invalid, err := isInvalid(fcr.PayloadStatus); invalid {
            return nil, err
        }
        payloadID = *fcr.PayloadID
        triggeredAt = time.Now()
    }

    waitTo := triggeredAt.Add(k.buildDelay)
    select {
    case <-ctx.Done(): return nil, ctx.Err()
    case <-time.After(time.Until(waitTo)):
    }

    payloadResp, err := k.engineCl.GetPayloadV3(ctx, payloadID)
    if err != nil { /* retry except unknown payload */ }

    payloadMsg := &types.MsgExecutionPayload{
        Authority: moduleAddress,
        BlobCommitments: blobCommitments,
        ExecutionPayloadDeneb: payloadProto,
    }
    b := k.txConfig.NewTxBuilder()
    b.SetMsgs(append(voteMsgs, payloadMsg)...)
    tx, err := k.txConfig.TxEncoder()(b.GetTx())
    return &abci.ResponsePrepareProposal{Txs: [][]byte{tx}}, err
}`,
    annotations: [
      { lines: [1, 11], color: "sky", note: "10초는 이 고정 코드의 proposal 준비 한도이며 timeout이면 빈 proposal 경로가 가능합니다." },
      { lines: [13, 25], color: "amber", note: "Optimistic payload height가 맞지 않으면 FCU V3로 새 build를 시작하고 payload ID를 받습니다." },
      { lines: [27, 34], color: "violet", note: "Build delay 뒤 getPayloadV3가 ID에 대응하는 candidate bytes를 가져옵니다." },
      { lines: [36, 46], color: "emerald", note: "Vote messages와 execution payload를 한 unsigned Cosmos transaction으로 encode합니다." },
    ],
  },
  "verify-payload-envelope": {
    path: "octane/evmengine/keeper/keeper.go · parseAndVerifyProposedPayload @ 9864f25",
    lang: "go",
    highlight: [1, 44],
    desc: `${excerpt} Engine 실행 전에 module authority와 withdrawals·parent·height·time·fee recipient 등 proposal envelope 불변식을 검사합니다.`,
    code: `func (k *Keeper) parseAndVerifyProposedPayload(
    ctx context.Context,
    msg *types.MsgExecutionPayload,
) (engine.ExecutableData, error) {
    if msg.Authority != moduleAddress {
        return engine.ExecutableData{}, errors.New("invalid authority")
    }
    payload, err := types.PayloadFromProto(msg.ExecutionPayloadDeneb)
    if err != nil { return engine.ExecutableData{}, err }

    eligible, err := k.eligibleWithdrawals(ctx, height)
    if err != nil { return engine.ExecutableData{}, err }
    if !withdrawalsEqual(payload.Withdrawals, eligible) {
        return engine.ExecutableData{}, errors.New("withdrawals mismatch")
    }
    if payload.ExecutionWitness != nil {
        return engine.ExecutableData{}, errors.New("witness not allowed")
    }
    if err := k.feeRecProvider.VerifyFeeRecipient(
        payload.FeeRecipient,
    ); err != nil { return engine.ExecutableData{}, err }

    head, err := k.getExecutionHead(ctx)
    if err != nil { return engine.ExecutableData{}, err }
    headHash, err := head.Hash()
    if err != nil { return engine.ExecutableData{}, err }
    if payload.Number != head.GetBlockHeight()+1 {
        return engine.ExecutableData{}, errors.New("invalid number")
    }
    if payload.ParentHash != headHash {
        return engine.ExecutableData{}, errors.New("invalid parent")
    }

    minTime := head.GetBlockTime() + 1
    maxTime := uint64(sdk.UnwrapSDKContext(ctx).BlockTime().Unix())
    if maxTime < minTime { maxTime = minTime }
    if payload.Timestamp < minTime || payload.Timestamp > maxTime {
        return engine.ExecutableData{}, errors.New("invalid timestamp")
    }
    if payload.Random != headHash {
        return engine.ExecutableData{}, errors.New("invalid random")
    }
    return payload, nil
}`,
    annotations: [
      { lines: [5, 20], color: "sky", note: "Cosmos message 권한과 application이 계산한 withdrawals·fee recipient를 먼저 맞춥니다." },
      { lines: [22, 34], color: "amber", note: "Keeper DB의 execution head를 기준으로 다음 height와 exact parent hash를 검사합니다." },
      { lines: [36, 45], color: "emerald", note: "Timestamp 범위와 이 snapshot의 Randao 대용 규칙까지 통과해야 Engine client로 보냅니다." },
    ],
  },
  "process-candidate": {
    path: "octane/evmengine/keeper/proposal_server.go · ExecutionPayload @ 9864f25",
    lang: "go",
    highlight: [1, 29],
    desc: `${excerpt} ProcessProposal용 service가 candidate를 newPayloadV3에 넣고 INVALID와 liveness 상태를 구분합니다.`,
    code: `func (s proposalServer) ExecutionPayload(
    ctx context.Context,
    msg *types.MsgExecutionPayload,
) (*types.ExecutionPayloadResponse, error) {
    payload, err := s.parseAndVerifyProposedPayload(ctx, msg)
    if err != nil { return nil, err }
    blockHashes, err := blobHashes(msg.BlobCommitments)
    if err != nil { return nil, err }

    err = retryForever(ctx, func(ctx context.Context) (bool, error) {
        status, err := pushPayload(
            ctx, s.engineCl, payload, blockHashes,
        )
        if err != nil {
            return false, nil // network retry
        }
        if invalid, err := isInvalid(status); invalid {
            return false, err // proposal reject
        }
        if isSyncing(status) {
            // Continue so initial sync can receive a target head.
        }
        return true, nil
    })
    if err != nil { return nil, err }
    return &types.ExecutionPayloadResponse{}, nil
}`,
    annotations: [
      { lines: [5, 8], color: "sky", note: "Engine 호출 전에 같은 deterministic envelope 검사를 다시 사용합니다." },
      { lines: [10, 18], color: "amber", note: "Transport 오류는 retry하고 INVALID는 candidate rejection으로 반환합니다." },
      { lines: [19, 24], color: "violet", note: "SYNCING·ACCEPTED는 VALID와 같지 않지만 initial sync가 target을 받도록 이 경로는 계속합니다." },
      { lines: [25, 28], color: "emerald", note: "여기서 canonical execution head를 전진시키지 않습니다." },
    ],
  },
  "finalize-payload": {
    path: "octane/evmengine/keeper/msg_server.go · ExecutionPayload @ 9864f25",
    lang: "go",
    highlight: [1, 55],
    desc: `${excerpt} Finalize mode에서 payload를 다시 넣고 FCU가 성공한 뒤 events·execution head·withdrawals를 application state에 반영합니다.`,
    code: `func (s msgServer) ExecutionPayload(
    ctx context.Context,
    msg *types.MsgExecutionPayload,
) (*types.ExecutionPayloadResponse, error) {
    sdkCtx := sdk.UnwrapSDKContext(ctx)
    if sdkCtx.ExecMode() != sdk.ExecModeFinalize {
        return nil, errors.New("only allowed in finalize mode")
    }
    payload, err := s.parseAndVerifyProposedPayload(ctx, msg)
    if err != nil { return nil, err }

    err = retryForever(ctx, func(ctx context.Context) (bool, error) {
        status, err := pushPayload(ctx, s.engineCl, payload, blockHashes)
        if err != nil { return false, nil }
        if invalid, err := isInvalid(status); invalid { return false, err }
        return true, nil // SYNCING also proceeds to FCU
    })
    if err != nil { return nil, err }

    fcs := engine.ForkchoiceStateV1{
        HeadBlockHash: payload.BlockHash,
        SafeBlockHash: payload.BlockHash,
        FinalizedBlockHash: payload.BlockHash,
    }
    err = retryForever(ctx, func(ctx context.Context) (bool, error) {
        fcr, err := s.engineCl.ForkchoiceUpdatedV3(ctx, fcs, nil)
        if err != nil || isSyncing(fcr.PayloadStatus) {
            return false, nil
        }
        if invalid, err := isInvalid(fcr.PayloadStatus); invalid {
            return false, err
        }
        return true, nil
    })
    if err != nil { return nil, err }

    events, err := s.evmEvents(ctx, payload.BlockHash)
    if err != nil { return nil, err }
    if err := s.deliverEvents(ctx, payload.Number, payload.BlockHash, events); err != nil {
        return nil, err
    }
    if err := s.updateExecutionHead(ctx, payload); err != nil { return nil, err }
    if err := s.deleteWithdrawals(ctx, payload.Withdrawals); err != nil { return nil, err }
    return &types.ExecutionPayloadResponse{}, nil
}`,
    annotations: [
      { lines: [5, 10], color: "sky", note: "같은 message handler라도 Finalize 실행 모드에서만 committed path를 엽니다." },
      { lines: [12, 18], color: "amber", note: "Committed payload가 local Engine에 없을 수 있어 newPayloadV3를 다시 호출합니다." },
      { lines: [21, 35], color: "violet", note: "FCU가 SYNCING이면 retry하며 성공 전에는 세 canonical pointer를 확정하지 않습니다." },
      { lines: [38, 47], color: "emerald", note: "EVM logs 적용 뒤 keeper execution head와 withdrawal queue를 순서대로 갱신합니다." },
    ],
  },
  "deliver-events": {
    path: "octane/evmengine/keeper/msg_server.go · deliverEvents @ 9864f25",
    lang: "go",
    highlight: [1, 35],
    desc: `${excerpt} EVM log마다 별도 CacheMultiStore branch를 만들고 실패한 event만 버린 뒤 다음 event를 계속 처리합니다.`,
    code: `func (s msgServer) deliverEvents(
    ctx context.Context,
    height uint64,
    blockHash common.Hash,
    events []types.EVMEvent,
) error {
    procs := processorsByAddress(s.eventProcs)
    for _, event := range events {
        if err := event.Verify(); err != nil {
            return errors.Wrap(err, "verify log [BUG]")
        }
        elog, err := event.ToEthLog()
        if err != nil { return err }
        proc, ok := procs[elog.Address]
        if !ok { return errors.New("unknown log address [BUG]") }

        sdkCtx := sdk.UnwrapSDKContext(ctx)
        branchMS := sdkCtx.MultiStore().CacheMultiStore()
        branchCtx := sdkCtx.WithMultiStore(branchMS)

        if err := catch(func() error {
            return proc.Deliver(branchCtx, blockHash, event)
        }); err != nil {
            log.Warn(ctx, "Delivering EVM log event failed", err)
            continue // failed branch is not written
        }
        branchMS.Write()
    }
    return nil
}`,
    annotations: [
      { lines: [7, 15], color: "sky", note: "미리 등록한 processor address와 검증된 log만 application code에 전달합니다." },
      { lines: [17, 20], color: "amber", note: "각 event는 같은 block branch 아래에 별도 cache branch를 가집니다." },
      { lines: [22, 27], color: "violet", note: "Error나 panic이면 그 branch를 쓰지 않고 다음 event로 진행합니다." },
      { lines: [28, 31], color: "emerald", note: "성공한 event만 parent branch에 merge되므로 block 단위 all-or-nothing이 아닙니다." },
    ],
  },
  "engine-status": {
    path: "lib/ethclient/engineclient.go · NewPayloadV3 @ 9864f25",
    lang: "go",
    highlight: [1, 35],
    desc: `${excerpt} Authenticated JSON-RPC response를 VALID·INVALID·SYNCING·ACCEPTED와 transport error로 분류합니다.`,
    code: `func (c engineClient) NewPayloadV3(
    ctx context.Context,
    params engine.ExecutableData,
    versionedHashes []common.Hash,
    beaconRoot *common.Hash,
) (engine.PayloadStatusV1, error) {
    isStatusOk := func(status engine.PayloadStatusV1) bool {
        return map[string]bool{
            engine.VALID: true,
            engine.INVALID: true,
            engine.SYNCING: true,
            engine.ACCEPTED: true,
        }[status.Status]
    }

    var resp engine.PayloadStatusV1
    var rpcErr rpc.Error
    err := c.CallContext(
        ctx, &resp, "engine_newPayloadV3",
        params, versionedHashes, beaconRoot,
    )
    if isStatusOk(resp) {
        return resp, nil
    }
    if errors.As(err, &rpcErr) {
        validationError := err.Error()
        return engine.PayloadStatusV1{
            Status: engine.INVALID,
            ValidationError: &validationError,
        }, nil
    }
    if err != nil { return engine.PayloadStatusV1{}, err }
    return engine.PayloadStatusV1{}, errors.New("unknown status")
}`,
    annotations: [
      { lines: [7, 14], color: "sky", note: "네 status를 transport 성공과 분리된 typed 결과로 인정합니다." },
      { lines: [16, 23], color: "amber", note: "Engine method는 JWT가 붙은 JSON-RPC transport를 통해 호출됩니다." },
      { lines: [24, 31], color: "violet", note: "이 snapshot은 geth RPC error 일부를 INVALID application result로 변환합니다." },
      { lines: [32, 35], color: "emerald", note: "그 밖의 transport error와 알 수 없는 status는 별도 오류로 남깁니다." },
    ],
  },
};

// 이전 하위 컴포넌트가 같은 index를 읽어도 실제 원문을 열도록 alias만 유지합니다.
officialOctaneCodeRefs["octane-abci"] = officialOctaneCodeRefs["prepare-payload"];
officialOctaneCodeRefs["octane-enginecl"] = officialOctaneCodeRefs["engine-status"];
