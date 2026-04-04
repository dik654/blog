import type { CodeRef } from '@/components/code/types';

export const contextRefs: Record<string, CodeRef> = {
  'mini-create-evm': {
    path: 'minievm/x/evm/keeper/context.go',
    lang: 'go',
    project: 'minievm',
    highlight: [1, 30],
    desc: 'CreateEVM — EVM 인스턴스 생성. BlockContext + StateDB + Precompile 조립.',
    code: `// x/evm/keeper/context.go — EVM 인스턴스 생성

func (k Keeper) CreateEVM(ctx context.Context, caller common.Address,
) (context.Context, *vm.EVM, func(), error) {
    params, _ := k.Params.Get(ctx)
    extraEIPs := params.ToExtraEIPs()
    fee, _ := k.LoadFee(ctx, params)

    // SDK 컨텍스트 준비: 재귀 깊이 체크 (최대 8단계)
    ctx, _ = prepareSDKContext(sdk.UnwrapSDKContext(ctx))

    chainConfig := types.DefaultChainConfig(ctx)
    vmConfig := vm.Config{ExtraEips: extraEIPs}

    // 블록 컨텍스트: height, time, baseFee, gasLimit
    defaultBlockContext, _ := buildDefaultBlockContext(ctx)
    txContext, _ := k.buildTxContext(ctx, caller, fee)

    // go-ethereum EVM 인스턴스 생성
    evm := vm.NewEVM(defaultBlockContext, nil, chainConfig, vmConfig)

    // 커스텀 BlockContext: CanTransfer, Transfer, GetHash
    evm.Context, _ = k.buildBlockContext(ctx, defaultBlockContext, evm, fee)

    // StateDB 생성: Cosmos KVStore → vm.StateDB
    stateDB, _ := k.NewStateDB(ctx, evm, fee)
    cleanup, _ := decorateTracing(ctx, evm, stateDB)

    // 프리컴파일 등록
    evm.SetPrecompiles(k.precompiles(rules, stateDB))
    return ctx, evm, cleanup, nil
}`,
    annotations: [
      { lines: [9, 10], color: 'sky' as const, note: '재귀 깊이 제한 — EVM↔Cosmos 무한 루프 방지' },
      { lines: [20, 20], color: 'emerald' as const, note: 'go-ethereum의 vm.NewEVM() 호출' },
      { lines: [23, 23], color: 'amber' as const, note: 'CanTransfer: ERC20 balanceOf 호출로 잔액 확인' },
      { lines: [26, 26], color: 'rose' as const, note: 'StateDB: Cosmos KVStore 기반 어댑터' },
    ],
  },

  'mini-evm-call': {
    path: 'minievm/x/evm/keeper/context.go',
    lang: 'go',
    project: 'minievm',
    highlight: [1, 34],
    desc: 'EVMCall — EVM 컨트랙트 호출 실행 + 상태 커밋 + 이벤트 발행.',
    code: `// x/evm/keeper/context.go — EVMCall 실행

func (k Keeper) EVMCall(ctx context.Context,
    caller, contractAddr common.Address,
    inputBz []byte, value *uint256.Int,
    accessList coretypes.AccessList,
    authList []coretypes.SetCodeAuthorization,
) ([]byte, types.Logs, error) {
    // 1. EVM 인스턴스 생성
    ctx, evm, cleanup, _ := k.CreateEVM(ctx, caller)
    defer cleanup()

    // 2. intrinsic gas 차감
    gasBalance := k.computeGasLimit(sdkCtx)
    gasRemaining, _ := chargeIntrinsicGas(...)

    // 3. StateDB 준비: access list, sender, destination
    evm.StateDB.Prepare(rules, caller, types.NullAddress, &contractAddr, ...)

    // 4. EVM 호출 실행
    retBz, gasRemaining, err := evm.Call(
        caller, contractAddr, inputBz, gasRemaining, value)

    // 5. gas 소비 기록 (London: refund 포함)
    gasUsed := types.CalGasUsed(gasBalance, gasRemaining, evm.StateDB.GetRefund())
    consumeGas(sdkCtx, gasUsed, gasRemaining, "EVM gas consumption")

    // 6. StateDB 커밋 → Cosmos KVStore 반영
    stateDB := evm.StateDB.(types.StateDB)
    stateDB.Commit()

    // 7. Cosmos 메시지 디스패치 (프리컴파일에서 큐잉된 요청)
    requests := sdkCtx.Value(types.CONTEXT_KEY_EXECUTE_REQUESTS)
    k.dispatchMessages(sdkCtx, *requests)
}`,
    annotations: [
      { lines: [10, 10], color: 'sky' as const, note: 'CreateEVM — BlockCtx + StateDB + Precompile 조립' },
      { lines: [21, 22], color: 'emerald' as const, note: 'go-ethereum evm.Call() — 바이트코드 실행' },
      { lines: [29, 30], color: 'amber' as const, note: 'Commit — 스냅샷 체인 역순 커밋' },
      { lines: [33, 34], color: 'rose' as const, note: 'Cosmos 메시지 디스패치 — EVM↔Cosmos 양방향 호출' },
    ],
  },
};
