import type { CodeRef } from "@/components/code/types";

export const officialEvmosCodeRefs: Record<string, CodeRef> = {
  "rpc-broadcast": {
    path: "evmos/rpc/backend/call_tx.go",
    lang: "go",
    highlight: [1, 31],
    desc: "SendRawTransaction — raw Ethereum transaction을 MsgEthereumTx가 든 Cosmos transaction으로 바꾸고 sync broadcast한 뒤 Ethereum hash를 반환합니다.",
    code: `ethereumTx := &evmtypes.MsgEthereumTx{}
if err := ethereumTx.FromEthereumTx(tx); err != nil {
    return common.Hash{}, err
}

res, err := b.queryClient.QueryClient.Params(
    b.ctx, &evmtypes.QueryParamsRequest{},
)
if err != nil {
    return common.Hash{}, err
}

cosmosTx, err := ethereumTx.BuildTx(
    b.clientCtx.TxConfig.NewTxBuilder(),
    res.Params.EvmDenom,
)
if err != nil {
    return common.Hash{}, err
}

txBytes, err := b.clientCtx.TxConfig.TxEncoder()(cosmosTx)
if err != nil {
    return common.Hash{}, err
}

txHash := ethereumTx.AsTransaction().Hash()
syncCtx := b.clientCtx.WithBroadcastMode(flags.BroadcastSync)
rsp, err := syncCtx.BroadcastTx(txBytes)
if rsp != nil && rsp.Code != 0 {
    err = errorsmod.ABCIError(rsp.Codespace, rsp.Code, rsp.RawLog)
}
return txHash, err`,
    annotations: [
      { lines: [1, 4], color: "sky", note: "Ethereum bytes를 Evmos MsgEthereumTx 표현으로 옮깁니다." },
      { lines: [6, 17], color: "emerald", note: "현재 EVM denom을 읽어 Cosmos SDK transaction 봉투를 만듭니다." },
      { lines: [24, 31], color: "amber", note: "sync broadcast 성공과 Ethereum hash 반환은 block inclusion·Commit 영수증이 아닙니다." },
    ],
  },
  "ante-route": {
    path: "evmos/app/ante/ante.go",
    lang: "go",
    highlight: [1, 24],
    desc: "NewAnteHandler — extension option을 보고 Ethereum transaction 전용 mono ante handler와 일반 Cosmos ante handler를 나눕니다.",
    code: `func NewAnteHandler(options HandlerOptions) sdk.AnteHandler {
    return func(ctx sdk.Context, tx sdk.Tx, sim bool) (
        newCtx sdk.Context, err error,
    ) {
        var anteHandler sdk.AnteHandler

        txWithExtensions, ok := tx.(authante.HasExtensionOptionsTx)
        if ok {
            opts := txWithExtensions.GetExtensionOptions()
            if len(opts) > 0 {
                switch typeURL := opts[0].GetTypeUrl(); typeURL {
                case "/ethermint.evm.v1.ExtensionOptionsEthereumTx":
                    anteHandler = newMonoEVMAnteHandler(options)
                case "/ethermint.types.v1.ExtensionOptionDynamicFeeTx":
                    anteHandler = newCosmosAnteHandler(options)
                default:
                    return ctx, errorsmod.Wrapf(
                        errortypes.ErrUnknownExtensionOptions,
                        "rejecting tx with unsupported extension option: %s", typeURL,
                    )
                }
                return anteHandler(ctx, tx, sim)
            }
        }
        return newCosmosAnteHandler(options)(ctx, tx, sim)
    }
}`,
    annotations: [
      { lines: [7, 13], color: "sky", note: "Ethereum extension option이 전용 ante 경로를 고릅니다." },
      { lines: [14, 15], color: "emerald", note: "Cosmos dynamic-fee transaction은 다른 ante 경로입니다." },
      { lines: [16, 21], color: "rose", note: "알 수 없는 extension은 실행 전에 거절합니다." },
    ],
  },
  "ante-fee-nonce": {
    path: "evmos/app/ante/evm/mono.go · 10_increment_sequence.go",
    lang: "go",
    highlight: [1, 33],
    desc: "MonoDecorator와 IncrementNonce — sender·잔액을 검증하고 최대 가스 비용을 먼저 걷은 뒤 계정 sequence를 정확히 한 번 올립니다.",
    code: `// 5. Ethereum 서명으로 sender를 복구합니다.
if err := SignatureVerification(
    ethMsg, decUtils.Signer,
    decUtils.EvmParams.AllowUnprotectedTxs,
); err != nil {
    return ctx, err
}
from = ethMsg.GetFrom()

// 6. fee와 value를 모두 낼 수 있는지 검사합니다.
account := md.evmKeeper.GetAccount(ctx, common.HexToAddress(ethMsg.From))
if err := VerifyAccountBalance(
    ctx, md.accountKeeper, account,
    common.HexToAddress(ethMsg.From), txData,
); err != nil {
    return ctx, err
}

// 9. gasLimit × effective gas price를 먼저 차감합니다.
msgFees, err := evmkeeper.VerifyFee(
    txData, decUtils.EvmDenom, decUtils.BaseFee,
    decUtils.Rules.IsHomestead, decUtils.Rules.IsIstanbul,
    ctx.IsCheckTx(),
)
if err != nil { return ctx, err }
if err = ConsumeFeesAndEmitEvent(ctx, keepers, msgFees, from); err != nil {
    return ctx, err
}

// 10. transaction nonce와 account sequence가 같을 때 7→8로 올립니다.
if err := IncrementNonce(
    ctx, md.accountKeeper, acc, txData.GetNonce(),
); err != nil {
    return ctx, err
}`,
    annotations: [
      { lines: [1, 8], color: "sky", note: "서명 검증은 From 필드를 채워 뒤 검사들이 같은 sender를 사용하게 합니다." },
      { lines: [10, 17], color: "emerald", note: "Alice는 value와 gas 예산을 함께 감당해야 합니다." },
      { lines: [19, 28], color: "amber", note: "실행 전에 최대 gas budget을 fee collector로 옮깁니다." },
      { lines: [30, 35], color: "violet", note: "nonce 7이 현재 sequence 7과 같을 때만 sequence 8을 기록합니다." },
    ],
  },
  "apply-transaction": {
    path: "evmos/x/evm/keeper/state_transition.go",
    lang: "go",
    highlight: [1, 29],
    desc: "ApplyTransaction — EVM 실행용 CacheContext를 만들고 성공한 EVM state만 합치며, 실제 사용하지 않은 gas 비용은 바깥 ante 상태로 돌려줍니다.",
    code: `// EVM state와 hook이 실패하면 버릴 바깥 cache입니다.
tmpCtx, commit := ctx.CacheContext()

// StateDB dirty state는 tmpCtx 안에 기록합니다.
res, err := k.ApplyMessageWithConfig(
    tmpCtx, msg, nil, true, cfg, txConfig,
)
if err != nil {
    k.ResetGasMeterAndConsumeGas(tmpCtx, tmpCtx.GasMeter().Limit())
    return nil, errorsmod.Wrap(err, "failed to apply ethereum core message")
}

// VM REVERT가 아니어야 tmpCtx를 parent transaction 상태에 합칩니다.
if !res.Failed() {
    commit()
}

// REVERT 여부와 별개로 쓰지 않은 gas 비용을 Alice에게 반환합니다.
if err = k.RefundGas(
    ctx, msg, msg.Gas()-res.GasUsed, cfg.Params.EvmDenom,
); err != nil {
    return nil, errorsmod.Wrapf(
        err, "failed to refund gas leftover gas to sender %s", msg.From(),
    )
}

k.ResetGasMeterAndConsumeGas(ctx, totalGasUsed)
return res, nil`,
    annotations: [
      { lines: [1, 7], color: "sky", note: "StateDB Commit은 durable database가 아니라 tmpCtx 안의 keeper state를 갱신합니다." },
      { lines: [8, 11], color: "rose", note: "내부 Go error는 Msg 실행 오류로 전파됩니다." },
      { lines: [13, 16], color: "emerald", note: "성공한 EVM 결과만 parent transaction branch에 합칩니다." },
      { lines: [18, 25], color: "amber", note: "VM REVERT도 사용한 gas는 내고 남은 gas만 돌려받습니다." },
    ],
  },
  "statedb-commit": {
    path: "evmos/x/evm/statedb/statedb.go",
    lang: "go",
    highlight: [1, 35],
    desc: "StateDB Snapshot·Revert·Commit — EVM journal을 되감고 dirty account·code·storage를 현재 Cosmos cache context의 keeper에 씁니다.",
    code: `func (s *StateDB) Snapshot() int {
    id := s.nextRevisionID
    s.nextRevisionID++
    s.validRevisions = append(
        s.validRevisions,
        revision{id, s.journal.length()},
    )
    return id
}

func (s *StateDB) RevertToSnapshot(revid int) {
    idx := sort.Search(len(s.validRevisions), func(i int) bool {
        return s.validRevisions[i].id >= revid
    })
    snapshot := s.validRevisions[idx].journalIndex
    s.journal.Revert(s, snapshot)
    s.validRevisions = s.validRevisions[:idx]
}

func (s *StateDB) Commit() error {
    if s.writeCache != nil {
        s.writeCache()
    }
    return s.commitWithCtx(s.ctx)
}

func (s *StateDB) commitWithCtx(ctx sdk.Context) error {
    for _, addr := range s.journal.sortedDirties() {
        obj := s.stateObjects[addr]
        if obj.code != nil && obj.dirtyCode {
            s.keeper.SetCode(ctx, obj.CodeHash(), obj.code)
        }
        if err := s.keeper.SetAccount(ctx, obj.Address(), obj.account); err != nil {
            return err
        }
    }
    return nil
}`,
    annotations: [
      { lines: [1, 9], color: "sky", note: "Snapshot은 journal의 현재 길이를 revision으로 기억합니다." },
      { lines: [11, 18], color: "rose", note: "EVM frame 실패는 snapshot 뒤 journal change를 역순으로 되감습니다." },
      { lines: [20, 25], color: "amber", note: "Precompile cache를 먼저 합친 뒤 keeper write를 수행합니다." },
      { lines: [27, 36], color: "emerald", note: "Account·code·storage는 현재 Cosmos context에 쓰이며 root Commit은 아직 남아 있습니다." },
    ],
  },
  "ibc-callback": {
    path: "evmos/x/erc20/ibc_middleware.go",
    lang: "go",
    highlight: [1, 27],
    desc: "IBCMiddleware — ICS-20 수신·acknowledgement·timeout을 먼저 처리한 뒤 성공 조건에서 ERC-20 representation conversion이나 refund를 연결합니다.",
    code: `func (im IBCMiddleware) OnRecvPacket(
    ctx sdk.Context,
    packet channeltypes.Packet,
    relayer sdk.AccAddress,
) exported.Acknowledgement {
    ack := im.Module.OnRecvPacket(ctx, packet, relayer)
    if !ack.Success() {
        return ack
    }
    return im.keeper.OnRecvPacket(ctx, packet, ack)
}

func (im IBCMiddleware) OnAcknowledgementPacket(
    ctx sdk.Context, packet channeltypes.Packet,
    acknowledgement []byte, relayer sdk.AccAddress,
) error {
    // packet data와 acknowledgement를 decode합니다.
    if err := im.Module.OnAcknowledgementPacket(
        ctx, packet, acknowledgement, relayer,
    ); err != nil {
        return err
    }
    return im.keeper.OnAcknowledgementPacket(ctx, packet, data, ack)
}

func (im IBCMiddleware) OnTimeoutPacket(...) error {
    // ICS-20 refund가 끝난 뒤 ERC-20 representation을 복원합니다.
    return im.keeper.OnTimeoutPacket(ctx, packet, data)
}`,
    annotations: [
      { lines: [1, 10], color: "emerald", note: "수신 측 ICS-20 ack가 성공한 뒤에만 ERC-20 변환을 시도합니다." },
      { lines: [12, 23], color: "amber", note: "발신 측 acknowledgement callback은 로컬 send transaction과 다른 시점입니다." },
      { lines: [25, 28], color: "rose", note: "Timeout refund도 별도 packet lifecycle의 callback입니다." },
    ],
  },
};
