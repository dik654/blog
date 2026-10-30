import type { CodeRef } from "@/components/code/types";

export const officialDydxCodeRefs: Record<string, CodeRef> = {
  "dydx-order-flags": {
    path: "protocol/x/clob/types/order_id.go",
    lang: "go",
    highlight: [1, 27],
    desc: "v9.7.1의 OrderId flag가 short-term과 stateful order를 나누는 실제 코드입니다.",
    code: `const (
    OrderIdFlags_ShortTerm    = uint32(0)
    OrderIdFlags_Conditional  = uint32(32)
    OrderIdFlags_LongTerm     = uint32(64)
    OrderIdFlags_Twap         = uint32(128)
    OrderIdFlags_TwapSuborder = uint32(256)
)

func (o *OrderId) IsShortTermOrder() bool {
    return o.OrderFlags == OrderIdFlags_ShortTerm
}

func (o *OrderId) IsConditionalOrder() bool {
    return o.OrderFlags == OrderIdFlags_Conditional
}

func (o *OrderId) IsTwapOrder() bool {
    return o.OrderFlags == OrderIdFlags_Twap
}

func (o *OrderId) IsLongTermOrder() bool {
    return o.OrderFlags == OrderIdFlags_LongTerm
}

func (o *OrderId) IsStatefulOrder() bool {
    return o.IsLongTermOrder() || o.IsConditionalOrder() ||
        o.IsTwapOrder() || o.IsTwapSuborder()
}`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "숫자 flag가 주문의 보존·만료 경로를 고릅니다." },
      { lines: [9, 11], color: "emerald", note: "flag 0만 short-term order입니다." },
      { lines: [24, 27], color: "amber", note: "나머지 네 유형은 stateful order 경로로 묶입니다." },
    ],
  },
  "dydx-prepare-proposal": {
    path: "protocol/app/prepare/prepare_proposal.go",
    lang: "go",
    highlight: [1, 23],
    desc: "Proposer가 local operations queue를 MsgProposedOperations로 block candidate에 넣는 지점입니다.",
    code: `// Gather "Other" group messages.
otherBytesAllocated := txs.GetAvailableBytes() / 4
otherTxsToInclude, otherTxsRemainder := GetGroupMsgOther(
    txsWithoutDisallowMsgs,
    otherBytesAllocated,
)
if len(otherTxsToInclude) > 0 {
    if err := txs.AddOtherTxs(otherTxsToInclude); err != nil {
        return &abci.ResponsePrepareProposal{Txs: [][]byte{}}, nil
    }
}

// Gather "OperationsRelated" group messages.
operationsTxResp, err := GetProposedOperationsTx(
    ctx,
    txConfig,
    clobKeeper,
)
if err != nil {
    return &EmptyResponse, nil
}
if err := txs.SetProposedOperationsTx(operationsTxResp.Tx); err != nil {
    return &abci.ResponsePrepareProposal{Txs: [][]byte{}}, nil
}`,
    annotations: [
      { lines: [1, 10], color: "sky", note: "일반 transaction에는 남은 byte의 약 25%를 먼저 배정합니다." },
      { lines: [12, 18], color: "emerald", note: "CLOB의 local queue를 별도 proposed-operations transaction으로 만듭니다." },
      { lines: [19, 23], color: "rose", note: "생성하거나 삽입하지 못하면 빈 proposal을 반환해 잘못된 후보를 내지 않습니다." },
    ],
  },
  "dydx-process-proposal": {
    path: "protocol/app/process/process_proposal.go",
    lang: "go",
    highlight: [1, 22],
    desc: "Validator가 candidate transaction의 형식·순서·필수 메시지를 검사해 ACCEPT 또는 REJECT하는 경계입니다.",
    code: `txs, err := DecodeProcessProposalTxs(
    ctx,
    txConfig.TxDecoder(),
    req,
    bridgeKeeper,
    pricesTxDecoder,
)
if err != nil {
    recordErrorMetricsWithLabel(metrics.Decode)
    return &abci.ResponseProcessProposal{
        Status: abci.ResponseProcessProposal_REJECT,
    }, nil
}

if err = txs.Validate(); err != nil {
    recordErrorMetricsWithLabel(metrics.Validate)
    return &abci.ResponseProcessProposal{
        Status: abci.ResponseProcessProposal_REJECT,
    }, nil
}

return &abci.ResponseProcessProposal{
    Status: abci.ResponseProcessProposal_ACCEPT,
}, nil`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "먼저 candidate bytes를 protocol이 기대하는 transaction 묶음으로 해석합니다." },
      { lines: [8, 12], color: "rose", note: "해석할 수 없으면 proposal 전체를 거절합니다." },
      { lines: [14, 19], color: "amber", note: "순서·필수 injected message·ValidateBasic을 통과하지 못해도 거절합니다." },
      { lines: [21, 24], color: "emerald", note: "ACCEPT는 아직 각 fill의 최종 state commit 자체가 아닙니다." },
    ],
  },
  "dydx-proposed-operations": {
    path: "protocol/x/clob/keeper/msg_server_proposed_operations.go",
    lang: "go",
    highlight: [1, 12],
    desc: "FinalizeBlock 실행 중 MsgProposedOperations가 keeper의 deterministic state transition으로 들어가는 지점입니다.",
    code: `func (k msgServer) ProposedOperations(
    goCtx context.Context,
    msg *types.MsgProposedOperations,
) (*types.MsgProposedOperationsResponse, error) {
    ctx := lib.UnwrapSDKContext(goCtx, types.ModuleName)

    if err := k.Keeper.ProcessProposerOperations(
        ctx,
        msg.GetOperationsQueue(),
    ); err != nil {
        return nil, err
    }
    return &types.MsgProposedOperationsResponse{}, nil
}`,
    annotations: [
      { lines: [1, 5], color: "sky", note: "Consensus application의 SDK context에서 실행합니다." },
      { lines: [7, 10], color: "emerald", note: "제안자가 고른 operation을 keeper가 같은 순서로 다시 처리합니다." },
      { lines: [10, 12], color: "rose", note: "어느 operation이라도 실패하면 성공 응답을 만들지 않습니다." },
    ],
  },
  "dydx-indexer-event": {
    path: "protocol/indexer/indexer_manager/event_manager.go",
    lang: "go",
    highlight: [1, 27],
    desc: "Committed block의 versioned events를 indexer message로 내보내는 source-side 경계입니다.",
    code: `func (i *indexerEventManagerImpl) AddTxnEvent(
    ctx sdk.Context,
    subType string,
    version uint32,
    dataBytes []byte,
) {
    if i.Enabled() {
        addTxnEvent(
            ctx,
            subType,
            version,
            i.indexerEventsTransientStoreKey,
            dataBytes,
        )
    }
}

// ProduceBlock is called in EndBlocker after all onchain events exist.
func (i *indexerEventManagerImpl) ProduceBlock(
    ctx sdk.Context,
) *IndexerTendermintBlock {
    if i.Enabled() {
        return produceBlock(ctx, i.indexerEventsTransientStoreKey)
    }
    return nil
}`,
    annotations: [
      { lines: [1, 14], color: "sky", note: "subtype·version·bytes와 block 안의 순서를 transient store에 모읍니다." },
      { lines: [16, 22], color: "emerald", note: "EndBlocker에서 한 block의 on-chain events를 묶습니다." },
      { lines: [23, 25], color: "amber", note: "Indexer가 꺼져 있으면 query projection이 없을 뿐 chain transition이 되돌아가지는 않습니다." },
    ],
  },
};
