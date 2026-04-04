import type { CodeRef } from '@/components/code/types';

export const evmCodeRef: Record<string, CodeRef> = {
  'evm-struct': {
    path: 'core/vm/evm.go — EVM struct',
    lang: 'go',
    highlight: [1, 20],
    desc: 'EVM 인스턴스.\n블록 컨텍스트, 상태DB, 점프 테이블, 호출 깊이 등을 보유.',
    code: `type EVM struct {
    Context   BlockContext   // 블록 정보 (Coinbase, GasLimit, Time ...)
    TxContext               // 트랜잭션 정보 (Origin, GasPrice)
    StateDB   StateDB       // 상태 읽기/쓰기 인터페이스

    table     *JumpTable    // 오피코드 → operation 매핑 [256]*operation
    depth     int           // 현재 호출 깊이 (최대 1024)

    chainConfig *params.ChainConfig
    chainRules  params.Rules

    Config    Config         // Tracer 등 설정
    abort     atomic.Bool    // 외부에서 실행 중단 요청

    callGasTemp  uint64      // 63/64 규칙으로 계산된 임시 가스
    precompiles  map[common.Address]PrecompiledContract
    jumpDests    JumpDestCache  // JUMPDEST 분석 캐시

    readOnly   bool     // STATICCALL 시 상태 변경 금지 플래그
    returnData []byte   // 마지막 CALL의 반환 데이터
}`,
    annotations: [
      { lines: [2, 4], color: 'sky', note: 'Context — 블록/트랜잭션 메타데이터 (COINBASE, GASPRICE 등 오피코드에 사용)' },
      { lines: [6, 7], color: 'emerald', note: 'table — 하드포크별 JumpTable[256], depth — 재귀 호출 깊이 제한' },
      { lines: [15, 16], color: 'amber', note: 'callGasTemp — EIP-150 63/64 규칙으로 하위 호출에 전달할 가스' },
      { lines: [19, 20], color: 'violet', note: 'readOnly — STATICCALL 중 SSTORE 등 상태 변경 시 revert' },
    ],
  },
  'evm-call': {
    path: 'core/vm/evm.go — Call()',
    lang: 'go',
    highlight: [1, 36],
    desc: '컨트랙트 호출의 핵심 함수.\n스냅샷 → 값 전송 → 프리컴파일 or Run() → 에러 시 롤백.',
    code: `func (evm *EVM) Call(caller, addr common.Address,
    input []byte, gas uint64, value *uint256.Int,
) (ret []byte, leftOverGas uint64, err error) {
    // 1. 호출 깊이 제한 (최대 1024)
    if evm.depth > int(params.CallCreateDepth) {
        return nil, gas, ErrDepth
    }
    // 2. 잔액 확인
    if !value.IsZero() && !evm.Context.CanTransfer(evm.StateDB, caller, value) {
        return nil, gas, ErrInsufficientBalance
    }
    // 3. 스냅샷 저장 (에러 시 롤백용)
    snapshot := evm.StateDB.Snapshot()

    // 4. 값 전송 (caller → addr)
    evm.Context.Transfer(evm.StateDB, caller, addr, value, &evm.chainRules)

    // 5. 프리컴파일 vs 일반 컨트랙트
    if isPrecompile {
        ret, gas, err = RunPrecompiledContract(stateDB, p, addr, input, gas, ...)
    } else {
        code := evm.resolveCode(addr)
        if len(code) == 0 {
            ret, err = nil, nil  // 빈 코드 → 바로 성공
        } else {
            contract := NewContract(caller, addr, value, gas, evm.jumpDests)
            contract.SetCallCode(evm.resolveCodeHash(addr), code)
            ret, err = evm.Run(contract, input, false)
            gas = contract.Gas
        }
    }
    // 6. 에러 시 스냅샷으로 롤백
    if err != nil {
        evm.StateDB.RevertToSnapshot(snapshot)
        if err != ErrExecutionReverted { gas = 0 }  // revert 제외 가스 전소
    }
    return ret, gas, err
}`,
    annotations: [
      { lines: [4, 6], color: 'sky', note: '깊이 제한 — 재귀 호출 1024 초과 시 ErrDepth' },
      { lines: [12, 13], color: 'emerald', note: 'Snapshot — StateDB의 현재 상태를 저장, 에러 시 여기로 되돌림' },
      { lines: [19, 21], color: 'amber', note: '프리컴파일 — 0x01~0x11 주소는 네이티브 Go 코드로 실행' },
      { lines: [26, 29], color: 'violet', note: 'Contract 생성 → Run() — 인터프리터 루프 진입' },
      { lines: [33, 35], color: 'rose', note: '롤백 — RevertToSnapshot으로 상태 복원, ErrExecutionReverted만 가스 보존' },
    ],
  },
};
