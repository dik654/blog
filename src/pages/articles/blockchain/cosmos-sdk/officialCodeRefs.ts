import type { CodeRef } from "@/components/code/types";

export const officialCosmosCodeRefs: Record<string, CodeRef> = {
  "cosmos-runtx-branches": {
    path: "cosmos-sdk/baseapp/baseapp.go · RunTx",
    lang: "go",
    highlight: [1, 43],
    desc: "Cosmos SDK v0.55.0 commit 64fd208a · Ante와 message를 서로 다른 cache branch에서 실행하는 RunTx 핵심 부분입니다. 생략부를 표시하고 한국어 주석만 덧붙였습니다.",
    code: `// Transaction context는 실행 mode의 state에서 시작합니다.
ctx := app.getContextForTx(mode, txBytes, txIndex)
ms := ctx.MultiStore()

// 1. Ante 전용 child branch를 만듭니다.
anteCtx, anteCache := app.cacheTxContext(ctx)
newCtx, err := app.anteHandler(anteCtx, tx, mode == execModeSimulate)

// Ante가 만든 gas meter와 context 값은 유지하되,
// 이후 실행의 parent multistore는 원래 ms로 되돌립니다.
if !newCtx.IsZero() {
    ctx = newCtx.WithMultiStore(ms)
}
if err != nil {
    // Ante 실패: anteCache.Write() 전에 반환하므로 ante write도 폐기됩니다.
    return gInfo, nil, nil, err
}

// Ante 성공: fee·sequence 같은 변경을 현재 mode의 parent state에 합칩니다.
anteCache.Write()

switch mode {
case execModeCheck:
    // CheckTx는 node-local mempool에 넣습니다.
    err = app.mempool.Insert(ctx, tx, mempool.InsertOption{GasWanted: gasWanted})
case execModeFinalize:
    // FinalizeBlock에서는 mempool에서 제거하고 message 실행을 이어갑니다.
    err = mempool.RemoveWithReason(ctx, app.mempool, tx, reason)
}

// 2. Message 전용 child branch를 다시 만듭니다.
runMsgCtx, msgCache := app.cacheTxContext(ctx)
result, err = app.runMsgs(runMsgCtx, msgs, msgsV2, mode)

if err == nil && mode == execModeFinalize {
    // Message와 post-handler가 모두 성공한 FinalizeBlock에서만 합칩니다.
    consumeBlockGas()
    msgCache.Write()
}

// Message 실패 시 msgCache는 버리지만 이미 합친 ante 변경은 남습니다.
return gInfo, result, anteEvents, err`,
    annotations: [
      { lines: [1, 17], color: "sky", note: "Ante가 실패하면 첫 child branch를 parent에 합치지 않습니다." },
      { lines: [19, 28], color: "amber", note: "Ante 성공 write의 목적지는 mode별 parent입니다. CheckTx와 FinalizeBlock의 parent는 서로 다릅니다." },
      { lines: [30, 39], color: "emerald", note: "Message는 두 번째 branch에서 실행되고 FinalizeBlock 성공일 때만 합칩니다." },
      { lines: [41, 43], color: "rose", note: "Message 실패에서도 ante fee·sequence가 남는 이유가 두 branch의 merge 시점 차이입니다." },
    ],
  },
  "cosmos-bank-send": {
    path: "cosmos-sdk/x/bank/keeper/msg_server.go · Send",
    lang: "go",
    highlight: [1, 31],
    desc: "같은 commit · MsgSend가 주소, amount, send policy와 blocked recipient를 검사한 뒤 keeper의 SendCoins를 호출하는 경로입니다.",
    code: `func (k msgServer) Send(goCtx context.Context, msg *types.MsgSend) (*types.MsgSendResponse, error) {
    // 문자열 주소를 chain이 설정한 address codec으로 해석합니다.
    from, err := base.ak.AddressCodec().StringToBytes(msg.FromAddress)
    if err != nil {
        return nil, sdkerrors.ErrInvalidAddress.Wrapf("invalid from address: %s", err)
    }
    to, err := base.ak.AddressCodec().StringToBytes(msg.ToAddress)
    if err != nil {
        return nil, sdkerrors.ErrInvalidAddress.Wrapf("invalid to address: %s", err)
    }

    // Amount 형식과 양수 조건은 signature 검사와 별개입니다.
    if !msg.Amount.IsValid() || !msg.Amount.IsAllPositive() {
        return nil, errorsmod.Wrap(sdkerrors.ErrInvalidCoins, msg.Amount.String())
    }

    ctx := sdk.UnwrapSDKContext(goCtx)

    // Denom별 송금 허용 정책과 수신 금지 주소를 확인합니다.
    if err := k.IsSendEnabledCoins(ctx, msg.Amount...); err != nil {
        return nil, err
    }
    if k.BlockedAddr(to) {
        return nil, errorsmod.Wrapf(sdkerrors.ErrUnauthorized, "%s is not allowed to receive funds", msg.ToAddress)
    }

    // 실제 balance 변경은 bank keeper가 소유합니다.
    if err := k.SendCoins(ctx, from, to, msg.Amount); err != nil {
        return nil, err
    }
    return &types.MsgSendResponse{}, nil
}`,
    annotations: [
      { lines: [1, 10], color: "sky", note: "주소 형식은 application wiring의 codec 규칙을 따릅니다." },
      { lines: [12, 24], color: "amber", note: "서명이 맞아도 coin 형식·send policy·blocked address 검사에서 실패할 수 있습니다." },
      { lines: [26, 31], color: "emerald", note: "Balance keyspace의 수정 권한은 bank keeper에 모입니다." },
    ],
  },
  "cosmos-branch-tests": {
    path: "cosmos-sdk/baseapp/baseapp_test.go · TestBaseAppAnteHandler",
    lang: "go",
    highlight: [1, 29],
    desc: "같은 commit의 공식 테스트입니다. Ante 실패, message 실패, 전체 성공에서 parent state에 남는 값을 구분합니다.",
    code: `// Ante 자체가 실패하면 어느 key도 바뀌지 않습니다.
res, _ := app.FinalizeBlock(blockWith(failOnAnteTx))
require.False(t, res.TxResults[0].IsOK())
require.Equal(t, int64(0), get(store, anteKey))

// Ante는 통과하고 message handler만 실패합니다.
res, _ = app.FinalizeBlock(blockWith(failOnHandlerTx))
require.False(t, res.TxResults[0].IsOK())

// Ante branch는 이미 parent에 합쳐졌습니다.
require.Equal(t, int64(1), get(store, anteKey))

// Message child branch는 합치지 않았습니다.
require.Equal(t, int64(0), get(store, deliverKey))

// 다음 transaction은 sequence 1에서 시작해 전체 성공합니다.
res, _ = app.FinalizeBlock(blockWith(successTxSequence1))
require.True(t, res.TxResults[0].IsOK())
require.Equal(t, int64(2), get(store, anteKey))
require.Equal(t, int64(1), get(store, deliverKey))

// 마지막 Commit에서 finalize state가 durable version이 됩니다.
_, err := app.Commit()
require.NoError(t, err)`,
    annotations: [
      { lines: [1, 4], color: "rose", note: "Ante 실패는 첫 child branch까지 폐기합니다." },
      { lines: [6, 14], color: "amber", note: "Message 실패는 ante state와 message state를 다르게 남깁니다." },
      { lines: [16, 23], color: "emerald", note: "성공한 다음 transaction은 두 branch를 순서대로 합칩니다." },
    ],
  },
  "cosmos-check-commit-tests": {
    path: "cosmos-sdk/baseapp/abci_test.go · TestABCI_CheckTx",
    lang: "go",
    highlight: [1, 27],
    desc: "같은 commit의 공식 테스트입니다. CheckTx ante state는 연속 호출 사이에 유지되지만 committed query에는 보이지 않고 Commit 뒤 최신 state에서 다시 만들어집니다.",
    code: `// 다섯 CheckTx의 ante counter가 node-local check state에 누적됩니다.
for i := int64(0); i < 5; i++ {
    tx := newTxCounter(t, txConfig, i, 0)
    response, err := app.CheckTx(&abci.RequestCheckTx{Tx: encode(tx)})
    require.NoError(t, err)
    require.True(t, response.IsOK())
}

checkStore := getCheckStateCtx(app).KVStore(capKey)
require.Equal(t, int64(5), get(checkStore, counterKey))

// CheckTx만으로 committed query 값은 생기지 않습니다.
queryResponse, err := app.Query(context.Background(), query)
require.NoError(t, err)
require.Empty(t, queryResponse.Value)

// 빈 block이라도 FinalizeBlock + Commit이 끝나면
// check state는 최신 committed root에서 새로 만들어집니다.
_, err = app.FinalizeBlock(&abci.RequestFinalizeBlock{Height: 1})
require.NoError(t, err)
_, err = app.Commit()
require.NoError(t, err)

checkStore = getCheckStateCtx(app).KVStore(capKey)
require.Nil(t, checkStore.Get(counterKey))`,
    annotations: [
      { lines: [1, 10], color: "sky", note: "CheckTx branch는 즉시 폐기되는 임시값이 아니라 연속 admission에서 읽는 node-local state입니다." },
      { lines: [12, 15], color: "rose", note: "그러나 committed query에는 노출되지 않습니다." },
      { lines: [17, 27], color: "emerald", note: "Commit 뒤 check state는 새로운 committed state를 기준으로 재설정됩니다." },
    ],
  },
  "cosmos-working-commit": {
    path: "cosmos-sdk/baseapp/abci.go · workingHash / Commit",
    lang: "go",
    highlight: [1, 29],
    desc: "같은 commit · FinalizeBlock의 block branch를 root multistore에 합쳐 working AppHash를 계산하는 단계와 실제 version commit을 구분합니다.",
    code: `func (app *BaseApp) workingHash() []byte {
    // FinalizeBlock branch의 성공한 state transition을 root multistore에 합칩니다.
    app.stateManager.GetState(execModeFinalize).MultiStore.Write()

    // 아직 disk Commit 전이지만 현재 write set의 Merkle root를 계산합니다.
    return app.cms.WorkingHash()
}

func (app *BaseApp) Commit() (*abci.ResponseCommit, error) {
    finalizeState := app.stateManager.GetState(execModeFinalize)
    header := finalizeState.Context().BlockHeader()

    // Root multistore의 각 substore를 다음 version으로 저장합니다.
    app.cms.Commit()

    // CheckTx state는 방금 저장된 committed state에서 다시 만듭니다.
    app.stateManager.SetState(
        execModeCheck,
        app.cms,
        header,
        app.logger,
        app.streamingManager,
    )

    // 다음 block 전에는 이전 finalize branch를 재사용하지 않습니다.
    app.stateManager.ClearState(execModeFinalize)
    return &abci.ResponseCommit{RetainHeight: retainHeight}, nil
}`,
    annotations: [
      { lines: [1, 6], color: "amber", note: "Working AppHash 계산과 durable version commit은 서로 다른 호출입니다." },
      { lines: [8, 15], color: "emerald", note: "app.cms.Commit이 root multistore의 durable 경계입니다." },
      { lines: [17, 29], color: "sky", note: "Commit 뒤 mode별 state를 재정렬해 다음 block과 CheckTx를 준비합니다." },
    ],
  },
};
