import type { CodeRef } from "@/components/code/types";

export const officialInitiaEvmCodeRefs: Record<string, CodeRef> = {
  "rpc-ingress": {
    path: "minievm/jsonrpc/backend/tx.go",
    lang: "go",
    highlight: [1, 31],
    desc: "SendRawTransaction과 SendTx — raw Ethereum transaction을 decode하고 Cosmos transaction으로 바꿔 BroadcastTxSync에 전달합니다.",
    code: `func (b *JSONRPCBackend) SendRawTransaction(input hexutil.Bytes) (common.Hash, error) {
    tx := new(coretypes.Transaction)
    if err := tx.UnmarshalBinary(input); err != nil {
        return common.Hash{}, err
    }

    if !tx.Protected() {
        return common.Hash{}, errors.New("only replay-protected (EIP-155) transactions allowed over RPC")
    }

    if err := b.SendTx(tx); err != nil {
        return common.Hash{}, err
    }

    return tx.Hash(), nil
}

func (b *JSONRPCBackend) SendTx(tx *coretypes.Transaction) error {
    queryCtx, closer, err := b.getQueryCtx()
    if closer != nil {
        defer closer.Close()
    }
    if err != nil {
        return NewReadinessError(err.Error())
    }

    cosmosTx, err := keeper.NewTxUtils(b.app.EVMKeeper).ConvertEthereumTxToCosmosTx(queryCtx, tx)
    if err != nil {
        return err
    }

    txBytes, err := b.app.TxEncode(cosmosTx)
    if err != nil {
        return err
    }

    res, err := b.clientCtx.BroadcastTxSync(txBytes)
    if err != nil {
        return err
    } else if res.Code != 0 {
        return errors.New(res.RawLog)
    }

    return nil
}`,
    annotations: [
      { lines: [1, 15], color: "sky", note: "Raw bytes decode·EIP-155 검사 뒤 원래 Ethereum hash를 반환합니다." },
      { lines: [17, 27], color: "emerald", note: "Ethereum transaction을 Cosmos SDK transaction 표현으로 바꿉니다." },
      { lines: [29, 40], color: "amber", note: "BroadcastTxSync 성공은 동기 broadcast 응답이지 block commit 영수증이 아닙니다." },
    ],
  },
  "ethereum-envelope": {
    path: "minievm/x/evm/types/txutils.go",
    lang: "go",
    highlight: [1, 39],
    desc: "ConvertEthereumTxToCosmosTx — sender와 signature·nonce·gas·value·data를 MsgCall 또는 MsgCreate가 든 SDK transaction으로 옮깁니다.",
    code: `// get tx sender
ethSender, err := coretypes.Sender(signer, ethTx)
if err != nil {
    return nil, err
}

// construct signature
sig := signing.SignatureV2{
    PubKey:   compressedPubKey,
    Data:     sigData,
    Sequence: ethTx.Nonce(),
}

sender, err := ac.BytesToString(ethSender.Bytes())
if err != nil {
    return nil, err
}

sdkMsgs := []sdk.Msg{}
if ethTx.To() == nil {
    sdkMsgs = append(sdkMsgs, &MsgCreate{
        Sender: sender, Code: hexutil.Encode(ethTx.Data()),
        Value: math.NewIntFromBigInt(value), AccessList: accessList,
    })
} else {
    sdkMsgs = append(sdkMsgs, &MsgCall{
        Sender: sender, ContractAddr: ethTx.To().String(),
        Input: hexutil.Encode(ethTx.Data()),
        Value: math.NewIntFromBigInt(value), AccessList: accessList,
        AuthList: authList,
    })
}

txBuilder := authtx.NewTxConfig(cdc, authtx.DefaultSignModes).NewTxBuilder()
if err = txBuilder.SetMsgs(sdkMsgs...); err != nil {
    return nil, err
}
txBuilder.SetFeeAmount(feeAmount)
txBuilder.SetGasLimit(enforcedGasLimit)
if err = txBuilder.SetSignatures(sig); err != nil {
    return nil, err
}`,
    annotations: [
      { lines: [1, 5], color: "sky", note: "Chain ID에 맞는 signer로 Ethereum sender를 복구합니다." },
      { lines: [7, 17], color: "emerald", note: "Ethereum nonce는 SDK signature sequence로 보존됩니다." },
      { lines: [19, 31], color: "amber", note: "to가 있으면 MsgCall, 없으면 MsgCreate로 변환합니다." },
      { lines: [33, 40], color: "rose", note: "Message·fee·gas·Ethereum sign mode signature를 한 SDK transaction에 넣습니다." },
    ],
  },
  "ante-sequence": {
    path: "minievm/app/ante/sequence.go",
    lang: "go",
    highlight: [1, 25],
    desc: "IncrementSequenceDecorator — Ante에서 signer sequence를 올리고 context flag를 남깁니다.",
    code: `func (isd IncrementSequenceDecorator) AnteHandle(
    ctx sdk.Context, tx sdk.Tx, simulate bool, next sdk.AnteHandler,
) (sdk.Context, error) {
    sigTx, ok := tx.(authsigning.SigVerifiableTx)
    if !ok {
        return ctx, errorsmod.Wrap(sdkerrors.ErrTxDecode, "invalid transaction type")
    }

    signers, err := sigTx.GetSigners()
    if err != nil {
        return sdk.Context{}, err
    }

    for _, signer := range signers {
        acc := isd.ak.GetAccount(ctx, signer)
        if err := acc.SetSequence(acc.GetSequence() + 1); err != nil {
            panic(err)
        }
        isd.ak.SetAccount(ctx, acc)
    }

    incremented := true
    ctx = ctx.WithValue(evmtypes.CONTEXT_KEY_SEQUENCE_INCREMENTED, &incremented)
    return next(ctx, tx, simulate)
}`,
    annotations: [
      { lines: [9, 19], color: "emerald", note: "Alice sequence 7을 transaction branch에서 8로 올립니다." },
      { lines: [21, 23], color: "amber", note: "뒤의 x/evm message server가 중복 증가를 피하도록 flag를 전달합니다." },
    ],
  },
  "baseapp-ante-commit": {
    path: "initia-cosmos-sdk/baseapp/baseapp.go",
    lang: "go",
    highlight: [1, 34],
    desc: "BaseApp.runTx — 성공한 Ante cache는 message 실행 전에 block working state에 쓰고, message cache는 전체 성공 때만 씁니다.",
    code: `commitAnteCache = func() {
    if msCache != nil {
        msCache.Write()
    }
    anteEvents = events.ToABCIEvents()
}

if mode == execModeCheck {
    mempoolCtx = ctx.WithMultiStore(msCache)
} else {
    commitAnteCache()
    commitAnteCache = nil
}

// Create a new Context based off of the existing Context with a MultiStore branch
// in case message processing fails.
runMsgCtx, msCache := app.cacheTxContext(ctx, txBytes)

msgsV2, err := tx.GetMsgsV2()
if err == nil {
    result, err = app.runMsgs(runMsgCtx, msgs, msgsV2, mode)
}

if err == nil {
    if mode == execModeFinalize {
        consumeBlockGas()
        msCache.Write()
    }

    if len(anteEvents) > 0 && (mode == execModeFinalize || mode == execModeSimulate) {
        result.Events = append(anteEvents, result.Events...)
    }
}`,
    annotations: [
      { lines: [1, 12], color: "amber", note: "FinalizeBlock 경로에서는 성공한 Ante cache를 runMsgs보다 먼저 현재 block state에 씁니다." },
      { lines: [15, 21], color: "sky", note: "EVM을 포함한 message 실행은 그 위에 새 CacheMultiStore branch를 만듭니다." },
      { lines: [23, 29], color: "emerald", note: "Message branch는 전체 실행이 성공했을 때만 write합니다." },
      { lines: [30, 33], color: "rose", note: "따라서 message 실패는 이미 반영한 Ante sequence 증가까지 자동으로 되돌리지 않습니다." },
    ],
  },
  "sequence-reconcile": {
    path: "minievm/x/evm/keeper/msg_server.go",
    lang: "go",
    highlight: [1, 34],
    desc: "handleSequenceIncremented — Ante와 EVM Call/Create의 nonce 증가 규칙을 한 번의 증가로 맞춥니다.",
    code: `// In the Cosmos SDK, the sequence number is incremented in the ante handler.
// In the EVM, the sequence number is incremented during the execution of create and create2 messages.
func (k *msgServerImpl) handleSequenceIncremented(
    ctx context.Context, sender sdk.AccAddress, isCreate bool,
) error {
    sdkCtx := sdk.UnwrapSDKContext(ctx)
    if sdkCtx.Value(types.CONTEXT_KEY_SEQUENCE_INCREMENTED) == nil {
        return nil
    }

    incremented := sdkCtx.Value(types.CONTEXT_KEY_SEQUENCE_INCREMENTED).(*bool)
    if isCreate && *incremented {
        acc := k.accountKeeper.GetAccount(ctx, sender)
        if err := acc.SetSequence(acc.GetSequence() - 1); err != nil {
            return err
        }
        k.accountKeeper.SetAccount(ctx, acc)
    } else if !isCreate && !*incremented {
        acc := k.accountKeeper.GetAccount(ctx, sender)
        if err := acc.SetSequence(acc.GetSequence() + 1); err != nil {
            return err
        }
        k.accountKeeper.SetAccount(ctx, acc)
    }

    *incremented = false
    return nil
}`,
    annotations: [
      { lines: [1, 2], color: "sky", note: "Cosmos Ante와 EVM CREATE가 sequence를 올리는 위치가 다릅니다." },
      { lines: [12, 18], color: "amber", note: "CREATE는 Ante 증가를 되돌려 EVM의 자체 nonce 증가와 중복되지 않게 합니다." },
      { lines: [19, 25], color: "emerald", note: "CALL이 Ante를 거치지 않은 내부 경로라면 message server가 직접 한 번 올립니다." },
      { lines: [27, 28], color: "rose", note: "같은 context에서 두 번째 message가 flag를 재사용하지 못하게 합니다." },
    ],
  },
  "evm-call": {
    path: "minievm/x/evm/keeper/context.go",
    lang: "go",
    highlight: [1, 42],
    desc: "EVMCall — EVM frame을 실행하고 StateDB 후보를 합친 뒤 예약된 Cosmos message를 dispatch합니다.",
    code: `retBz, gasRemaining, err := evm.Call(
    caller,
    contractAddr,
    inputBz,
    gasRemaining,
    value,
)

gasUsed := types.CalGasUsed(gasBalance, gasRemaining, evm.StateDB.GetRefund())
consumeGas(sdkCtx, gasUsed, gasRemaining, "EVM gas consumption")
if err != nil {
    if err == vm.ErrExecutionReverted {
        return nil, nil, types.NewRevertError(common.CopyBytes(retBz))
    }
    return nil, nil, types.ErrEVMCallFailed.Wrap(err.Error())
}

// commit state transition
stateDB := evm.StateDB.(types.StateDB)
if err := stateDB.Commit(); err != nil {
    return nil, nil, err
}

retHex := hexutil.Encode(retBz)
logs := stateDB.Logs()

sdkCtx.EventManager().EmitEvent(sdk.NewEvent(
    types.EventTypeCall,
    sdk.NewAttribute(types.AttributeKeyContract, contractAddr.Hex()),
    sdk.NewAttribute(types.AttributeKeyRet, retHex),
))

// handle cosmos execute requests
requests := sdkCtx.Value(types.CONTEXT_KEY_EXECUTE_REQUESTS).(*[]types.ExecuteRequest)
if dispatchLogs, err := k.dispatchMessages(sdkCtx, *requests); err != nil {
    return nil, nil, err
} else {
    logs = append(logs, dispatchLogs...)
}

return retBz, logs, nil`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "Geth EVM이 precompile을 포함한 call frame을 실행합니다." },
      { lines: [9, 16], color: "rose", note: "REVERT나 EVM 오류면 StateDB Commit과 Cosmos dispatch로 가지 않습니다." },
      { lines: [18, 22], color: "emerald", note: "성공한 snapshot 후보를 현재 Cosmos transaction context에 합칩니다." },
      { lines: [33, 40], color: "amber", note: "Precompile이 예약한 Cosmos messages는 EVM frame 성공 뒤 처리됩니다." },
    ],
  },
  "precompile-queue": {
    path: "minievm/x/evm/precompiles/cosmos/contract.go",
    lang: "go",
    highlight: [1, 45],
    desc: "execute_cosmos — read-only·dispatch·signer·gas 조건을 검사한 뒤 ExecuteRequest를 queue에 추가합니다.",
    code: `case METHOD_EXECUTE_COSMOS, METHOD_EXECUTE_COSMOS_WITH_OPTIONS:
    if readOnly {
        return nil, ctx.GasMeter().GasConsumedToLimit(), types.ErrNonReadOnlyMethod.Wrap(method.Name)
    }

    if e.stateDB.EVM().GetDisallowCosmosDispatch() {
        return nil, ctx.GasMeter().GasConsumedToLimit(), types.ErrExecuteCosmosDisabled.Wrap(method.Name)
    }

    ctx.GasMeter().ConsumeGas(EXECUTE_COSMOS_GAS, "execute_cosmos")

    var executeCosmosArguments ExecuteCosmos
    if method.Name == METHOD_EXECUTE_COSMOS {
        if err := method.Inputs.Copy(&executeCosmosArguments, args); err != nil {
            return nil, ctx.GasMeter().GasConsumedToLimit(), types.ErrPrecompileFailed.Wrap(err.Error())
        }
    } else {
        var withOptions ExecuteCosmosWithOptions
        if err := method.Inputs.Copy(&withOptions, args); err != nil {
            return nil, ctx.GasMeter().GasConsumedToLimit(), types.ErrPrecompileFailed.Wrap(err.Error())
        }
        executeCosmosArguments = withOptions.ToExecuteCosmos()
    }

    var sdkMsg sdk.Msg
    if err := e.cdc.UnmarshalInterfaceJSON([]byte(executeCosmosArguments.Msg), &sdkMsg); err != nil {
        return nil, ctx.GasMeter().GasConsumedToLimit(), types.ErrPrecompileFailed.Wrap(err.Error())
    }

    signers, _, err := e.cdc.GetMsgV1Signers(sdkMsg)
    if err != nil {
        return nil, ctx.GasMeter().GasConsumedToLimit(), types.ErrPrecompileFailed.Wrap(err.Error())
    }
    callerAddr, err := e.originAddress(ctx, caller.Bytes())
    if err != nil {
        return nil, ctx.GasMeter().GasConsumedToLimit(), types.ErrPrecompileFailed.Wrap(err.Error())
    }
    for _, signer := range signers {
        if !bytes.Equal(callerAddr, signer) {
            return nil, ctx.GasMeter().GasConsumedToLimit(), sdkerrors.ErrUnauthorized
        }
    }

    ctx.GasMeter().ConsumeGas(executeCosmosArguments.GasLimit, "pre-charge execute cosmos gas")
    messages := ctx.Value(types.CONTEXT_KEY_EXECUTE_REQUESTS).(*[]types.ExecuteRequest)
    *messages = append(*messages, types.ExecuteRequest{
        Caller: caller, Msg: sdkMsg,
        AllowFailure: executeCosmosArguments.Options.AllowFailure,
        CallbackId: executeCosmosArguments.Options.CallbackId,
        GasLimit: executeCosmosArguments.GasLimit,
    })`,
    annotations: [
      { lines: [1, 10], color: "sky", note: "STATICCALL과 dispatch-disabled context에서는 상태 변경 요청을 막습니다." },
      { lines: [12, 28], color: "emerald", note: "ABI arguments의 JSON을 실제 sdk.Msg로 decode합니다." },
      { lines: [30, 41], color: "amber", note: "요청 message의 signer가 precompile caller와 같은지 확인합니다." },
      { lines: [43, 50], color: "rose", note: "즉시 keeper를 호출하지 않고 gas와 실패 정책을 담은 request를 queue에 추가합니다." },
    ],
  },
  "state-snapshot": {
    path: "minievm/x/evm/state/snapshot.go",
    lang: "go",
    highlight: [1, 27],
    desc: "Snapshot — EVM call frame마다 CacheContext와 별도 ExecuteRequest queue를 만들고 성공한 snapshot만 parent로 합칩니다.",
    code: `func NewSnapshot(ctx Context) *Snapshot {
    ctx.Context = ctx.Context.
        WithValue(
            types.CONTEXT_KEY_PARENT_EXECUTE_REQUESTS,
            ctx.Context.Value(types.CONTEXT_KEY_EXECUTE_REQUESTS)).
        WithValue(types.CONTEXT_KEY_EXECUTE_REQUESTS, &[]types.ExecuteRequest{})

    cacheCtx, commit := ctx.CacheContext()
    return &Snapshot{
        ctx:    cacheCtx,
        commit: commit,
    }
}

func (s *Snapshot) Commit() {
    parentExecuteRequests := s.ctx.Value(
        types.CONTEXT_KEY_PARENT_EXECUTE_REQUESTS,
    ).(*[]types.ExecuteRequest)
    executeRequests := s.ctx.Value(
        types.CONTEXT_KEY_EXECUTE_REQUESTS,
    ).(*[]types.ExecuteRequest)
    *parentExecuteRequests = append(*parentExecuteRequests, *executeRequests...)

    s.commit()
}`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "Child call에서 만든 Cosmos requests를 parent queue와 분리합니다." },
      { lines: [8, 12], color: "amber", note: "Cosmos CacheContext가 call frame 후보 state를 격리합니다." },
      { lines: [15, 24], color: "emerald", note: "성공한 snapshot만 requests와 state를 parent에 합칩니다." },
    ],
  },
  "dispatch-message": {
    path: "minievm/x/evm/keeper/context.go",
    lang: "go",
    highlight: [1, 60],
    desc: "dispatchMessage — 예약한 sdk.Msg를 별도 CacheContext에서 실행하고 성공한 submessage만 commit합니다.",
    code: `func (k Keeper) dispatchMessage(
    parentCtx sdk.Context, request types.ExecuteRequest,
) (logs types.Logs, err error) {
    msg := request.Msg
    caller := request.Caller
    allowFailure := request.AllowFailure
    callbackId := request.CallbackId

    ctx, commit := parentCtx.CacheContext()
    ctx = ctx.WithGasMeter(storetypes.NewGasMeter(request.GasLimit))
    defer func() {
        if r := recover(); r != nil {
            switch r.(type) {
            case storetypes.ErrorOutOfGas:
                panic(r)
            default:
                err = fmt.Errorf("panic: %v", r)
            }
        }

        success := err == nil
        parentCtx.GasMeter().RefundGas(ctx.GasMeter().GasRemaining(), "refund gas from submsg")
        if !success {
            if !allowFailure {
                return
            }
        } else {
            commit()
        }

        err = nil
        if callbackId > 0 {
            var inputBz []byte
            inputBz, err = k.cosmosCallbackABI.Pack("callback", callbackId, success)
            if err != nil {
                return
            }

            var callbackLogs types.Logs
            _, callbackLogs, err = k.EVMCall(parentCtx, caller, caller, inputBz, nil, nil, nil)
            if err != nil {
                return
            }

            logs = append(logs, callbackLogs...)
        }
    }()

    handler := k.msgRouter.Handler(msg)
    if handler == nil {
        err = types.ErrNotSupportedCosmosMessage
        return
    }
    res, err := handler(ctx, msg)
    if err != nil {
        return
    }
    ctx.EventManager().EmitEvents(res.GetEvents())
    return
}`,
    annotations: [
      { lines: [9, 10], color: "sky", note: "각 Cosmos submessage에 독립된 state와 gas meter를 줍니다." },
      { lines: [21, 29], color: "emerald", note: "성공할 때만 cache branch를 parent transaction context에 씁니다." },
      { lines: [31, 47], color: "amber", note: "Options에 callback이 있으면 성공 여부를 다시 EVM에 전달합니다." },
      { lines: [50, 60], color: "rose", note: "실제 Cosmos module handler는 queue 이후 이 지점에서 실행됩니다." },
    ],
  },
};
