import type { CodeRef } from '@/components/code/types';

export const precompileRefs: Record<string, CodeRef> = {
  'mini-precompile-reg': {
    path: 'minievm/x/evm/keeper/precompiles.go',
    lang: 'go',

    highlight: [1, 22],
    desc: 'precompiles — 3개 커스텀 프리컴파일 등록 + 이더리움 기본 세트.',
    code: `// x/evm/keeper/precompiles.go — 프리컴파일 등록

func (k *Keeper) precompiles(rules params.Rules, stateDB types.StateDB,
) (vm.PrecompiledContracts, error) {
    // 1. ERC20 레지스트리: denom↔ERC20 매핑 관리
    erc20RegistryPrecompile, _ := erc20registryprecompile.NewERC20RegistryPrecompile(
        stateDB, k.erc20StoresKeeper)

    // 2. ICosmos: EVM에서 Cosmos 메시지 실행 + 쿼리
    cosmosPrecompile, _ := cosmosprecompile.NewCosmosPrecompile(
        stateDB, k.cdc, k.ac,
        k.accountKeeper, k.bankKeeper, k,
        k.grpcRouter, k.queryCosmosWhitelist, k.authority)

    // 3. JSON 유틸: Solidity에서 JSON 파싱
    jsonutilsPrecompile, _ := jsonutils.NewJSONUtilsPrecompile(stateDB)

    // 이더리움 기본 프리컴파일 + 커스텀 3개 합산
    precompiles := vm.ActivePrecompiledContracts(rules)
    precompiles[types.CosmosPrecompileAddress] = cosmosPrecompile
    precompiles[types.ERC20RegistryPrecompileAddress] = erc20RegistryPrecompile
    precompiles[types.JSONUtilsPrecompileAddress] = jsonutilsPrecompile
    return precompiles, nil
}`,
    annotations: [
      { lines: [6, 7], color: 'sky' as const, note: 'ERC20 레지스트리 — Cosmos denom↔ERC20 양방향' },
      { lines: [10, 13], color: 'emerald' as const, note: 'ICosmos — EVM에서 Cosmos msg 실행의 핵심' },
      { lines: [16, 16], color: 'amber' as const, note: 'JSON 유틸 — Solidity의 JSON 파싱 한계 보완' },
      { lines: [19, 23], color: 'rose' as const, note: '이더리움 기본 + 커스텀 3개 통합' },
    ],
  },

  'mini-execute-cosmos': {
    path: 'minievm/x/evm/precompiles/cosmos/contract.go',
    lang: 'go',

    highlight: [1, 30],
    desc: 'execute_cosmos — EVM 컨트랙트에서 Cosmos 메시지 실행.',
    code: `// x/evm/precompiles/cosmos/contract.go — execute_cosmos 처리

case METHOD_EXECUTE_COSMOS, METHOD_EXECUTE_COSMOS_WITH_OPTIONS:
    if readOnly {
        return nil, 0, types.ErrNonReadOnlyMethod.Wrap(method.Name)
    }
    // Cosmos dispatch가 비활성화되었는지 확인
    if e.stateDB.EVM().GetDisallowCosmosDispatch() {
        return nil, 0, types.ErrExecuteCosmosDisabled.Wrap(method.Name)
    }

    var executeCosmosArguments ExecuteCosmos
    method.Inputs.Copy(&executeCosmosArguments, args)

    // JSON → Cosmos SDK 메시지 디코딩
    var sdkMsg sdk.Msg
    e.cdc.UnmarshalInterfaceJSON([]byte(executeCosmosArguments.Msg), &sdkMsg)

    // 서명자 검증: caller == msg signer
    signers, _, _ := e.cdc.GetMsgV1Signers(sdkMsg)
    callerAddr, _ := e.originAddress(ctx, caller.Bytes())
    for _, signer := range signers {
        if !bytes.Equal(callerAddr, signer) {
            return nil, 0, sdkerrors.ErrUnauthorized
        }
    }

    // ExecuteRequest 큐에 추가 (EVM 실행 후 일괄 처리)
    messages := ctx.Value(types.CONTEXT_KEY_EXECUTE_REQUESTS).(*[]types.ExecuteRequest)
    *messages = append(*messages, types.ExecuteRequest{
        Caller: caller, Msg: sdkMsg,
        AllowFailure: executeCosmosArguments.Options.AllowFailure,
        CallbackId:   executeCosmosArguments.Options.CallbackId,
        GasLimit:     executeCosmosArguments.GasLimit,
    })`,
    annotations: [
      { lines: [3, 6], color: 'sky' as const, note: 'readOnly 체크 — staticcall에서 상태 변경 차단' },
      { lines: [15, 17], color: 'emerald' as const, note: 'JSON → Cosmos Msg: codec UnmarshalInterfaceJSON' },
      { lines: [20, 25], color: 'amber' as const, note: '서명자 검증: EVM caller == Cosmos msg signer' },
      { lines: [28, 34], color: 'rose' as const, note: '큐잉 패턴: 즉시 실행하지 않고 EVM 종료 후 일괄 처리' },
    ],
  },
};
