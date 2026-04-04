import type { CodeRef } from '@/components/code/types';

export const cosmosRefs: Record<string, CodeRef> = {
  'mini-precompile': {
    path: 'minievm/x/evm/precompiles/cosmos/contract.go',
    lang: 'go',

    highlight: [1, 38],
    desc: 'CosmosPrecompile — EVM에서 Cosmos 기능 호출. IBC, 쿼리, 주소 변환.',
    code: `// x/evm/precompiles/cosmos/contract.go

type CosmosPrecompile struct {
    *abi.ABI        // ICosmos Solidity 인터페이스 ABI
    stateDB  types.StateDB
    cdc      codec.Codec
    ac       address.Codec
    ak       types.AccountKeeper
    bk       types.BankKeeper
    edk      types.ERC20DenomKeeper
    grpcRouter types.GRPCRouter  // Cosmos gRPC 쿼리 라우터
    queryWhitelist types.QueryCosmosWhitelist
}

// ExtendedRun — 메서드별 분기 처리
func (e *CosmosPrecompile) ExtendedRun(
    caller common.Address, input []byte,
    suppliedGas uint64, readOnly bool,
) (resBz []byte, usedGas uint64, err error) {
    method, _ := e.MethodById(input)
    args, _ := method.Inputs.Unpack(input[4:])

    switch method.Name {
    case "execute_cosmos":
        // Cosmos 메시지 실행 (IBC 전송, 스테이킹 등)
        // callerAddr == msg signer 검증 후
        // ExecuteRequest 큐에 추가 → TX 종료 후 일괄 실행
    case "query_cosmos":
        // gRPC 쿼리 라우터로 Cosmos 상태 조회
        // whitelist에 등록된 쿼리만 허용
    case "to_cosmos_address":
        // EVM address → Cosmos bech32 주소 변환
    case "to_evm_address":
        // Cosmos bech32 → EVM address 변환
    case "to_denom":
        // ERC20 컨트랙트 주소 → Cosmos denom 조회
    case "to_erc20":
        // Cosmos denom → ERC20 컨트랙트 주소 조회
    }
}`,
    annotations: [
      { lines: [3, 13], color: 'sky' as const, note: 'CosmosPrecompile — ABI + Cosmos keeper 참조' },
      { lines: [25, 28], color: 'emerald' as const, note: 'execute_cosmos — EVM에서 Cosmos TX 실행' },
      { lines: [29, 31], color: 'amber' as const, note: 'query_cosmos — 화이트리스트 기반 Cosmos 쿼리' },
      { lines: [32, 37], color: 'rose' as const, note: '주소·denom 변환 — 두 세계 브릿지' },
    ],
  },
};
