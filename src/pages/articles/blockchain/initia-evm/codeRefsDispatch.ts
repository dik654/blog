import type { CodeRef } from '@/components/code/types';

export const dispatchRefs: Record<string, CodeRef> = {
  'mini-dispatch': {
    path: 'minievm/x/evm/keeper/context.go',
    lang: 'go',
    project: 'minievm',
    highlight: [1, 28],
    desc: 'dispatchMessage — EVM에서 큐잉된 Cosmos 메시지 실행 + 콜백.',
    code: `// x/evm/keeper/context.go — Cosmos 메시지 디스패치

func (k Keeper) dispatchMessage(parentCtx sdk.Context,
    request types.ExecuteRequest,
) (logs types.Logs, err error) {
    msg := request.Msg
    caller := request.Caller
    allowFailure := request.AllowFailure
    callbackId := request.CallbackId

    // CacheContext로 실행 — 실패 시 롤백 가능
    ctx, commit := parentCtx.CacheContext()
    ctx = ctx.WithGasMeter(storetypes.NewGasMeter(request.GasLimit))

    defer func() {
        success := err == nil
        if success {
            commit()  // 성공: Cosmos 상태 커밋
        } else if !allowFailure {
            return    // 실패 + 롤백 불가: 에러 전파
        }
        // 콜백이 있으면 EVM으로 다시 호출
        if callbackId > 0 {
            inputBz, _ := k.cosmosCallbackABI.Pack(
                "callback", callbackId, success)
            k.EVMCall(parentCtx, caller, caller, inputBz, ...)
        }
    }()

    handler := k.msgRouter.Handler(msg)
    res, err := handler(ctx, msg)
}`,
    annotations: [
      { lines: [11, 12], color: 'sky' as const, note: 'CacheContext — Cosmos의 트랜잭션 격리' },
      { lines: [17, 18], color: 'emerald' as const, note: '성공: commit() → 상태 영구 반영' },
      { lines: [23, 26], color: 'amber' as const, note: '콜백: Cosmos 실행 결과를 EVM에 전달' },
      { lines: [30, 31], color: 'rose' as const, note: 'msgRouter — Cosmos SDK 메시지 핸들러 실행' },
    ],
  },
};
