import type { CodeRef } from '@/components/code/types';

export const execDetailCodeRef: Record<string, CodeRef> = {
  transfer: {
    path: 'core/vm/evm.go — Transfer()',
    lang: 'go',
    highlight: [1, 16],
    desc: 'ETH 값 전송 함수.\nCall() 내부에서 caller→addr로 잔액 이동.',
    code: `// Transfer — 호출 시 value 전송 (Call/CallCode 공통)
func Transfer(db vm.StateDB, sender, recipient common.Address,
    amount *uint256.Int, rules *params.Rules,
) {
    // SubBalance — 보내는 쪽 잔액 차감
    db.SubBalance(sender, amount, tracing.BalanceChangeTransfer)

    // AddBalance — 받는 쪽 잔액 증가
    db.AddBalance(recipient, amount, tracing.BalanceChangeTransfer)
}

// CanTransfer — Call() 진입 전 잔액 충분 여부 확인
func CanTransfer(db vm.StateDB, addr common.Address,
    amount *uint256.Int,
) bool {
    return db.GetBalance(addr).Cmp(amount) >= 0
}`,
    annotations: [
      { lines: [5, 6], color: 'sky', note: 'SubBalance — 원자적 차감, 저널에 balanceChange 기록 (revert 가능)' },
      { lines: [8, 9], color: 'emerald', note: 'AddBalance — 계정이 없으면 자동 생성 (빈 계정 문제 → EIP-161)' },
      { lines: [12, 16], color: 'amber', note: 'CanTransfer — Call() 최상단에서 사전 검증, 실패 시 가스 소모 없이 반환' },
    ],
  },
  'dynamic-gas': {
    path: 'core/vm/gas_table.go — memoryGasCost()',
    lang: 'go',
    highlight: [1, 20],
    desc: '메모리 확장 가스 계산.\n이차 함수로 증가 — 대량 메모리 사용을 억제.',
    code: `// memoryGasCost — 메모리 가스 = 3*words + words²/512
func memoryGasCost(mem *Memory, newMemSize uint64) (uint64, error) {
    if newMemSize == 0 { return 0, nil }

    // 32바이트 워드 단위로 올림
    newMemSizeWords := toWordSize(newMemSize)  // (size + 31) / 32
    newMemSize = newMemSizeWords * 32

    if newMemSize > maxMemorySize {
        return 0, ErrGasUintOverflow
    }
    // 이차 공식: cost = 3*words + words²/512
    newTotalFee := newMemSizeWords*GasMemory +
        (newMemSizeWords*newMemSizeWords)/quadCoeff  // quadCoeff = 512

    // 증분만 과금 (이전에 이미 낸 비용 제외)
    fee := newTotalFee - mem.lastGasCost
    mem.lastGasCost = newTotalFee
    return fee, nil
}`,
    annotations: [
      { lines: [6, 6], color: 'sky', note: 'toWordSize — 32바이트 워드 올림, EVM 메모리는 워드 단위로 확장' },
      { lines: [12, 14], color: 'emerald', note: '이차 공식 — 선형(3*w) + 이차(w²/512), 724워드(~22KB) 이후 이차항이 지배' },
      { lines: [16, 18], color: 'amber', note: '증분 과금 — 이전 비용을 빼서 새로 확장한 부분만 청구' },
    ],
  },
  'op-return': {
    path: 'core/vm/instructions.go — opReturn / opRevert',
    lang: 'go',
    highlight: [1, 20],
    desc: '실행 종료 opcode들.\nRETURN은 정상 종료, REVERT는 상태 롤백, STOP은 빈 반환.',
    code: `func opReturn(pc *uint64, evm *EVM, scope *ScopeContext) ([]byte, error) {
    offset, size := scope.Stack.pop(), scope.Stack.pop()
    // 메모리에서 반환 데이터 복사
    ret := scope.Memory.GetCopy(offset.Uint64(), size.Uint64())
    return ret, errStopToken   // errStopToken → 인터프리터 루프 정상 탈출
}

func opRevert(pc *uint64, evm *EVM, scope *ScopeContext) ([]byte, error) {
    offset, size := scope.Stack.pop(), scope.Stack.pop()
    ret := scope.Memory.GetCopy(offset.Uint64(), size.Uint64())
    return ret, ErrExecutionReverted  // 상태 롤백 + 잔여 가스 보존
}

func opStop(pc *uint64, evm *EVM, scope *ScopeContext) ([]byte, error) {
    return nil, errStopToken   // 반환 데이터 없이 정상 종료
}

// 인터프리터 루프에서:
// if err == errStopToken { err = nil }  → 정상 종료
// ErrExecutionReverted → Call()에서 RevertToSnapshot + 가스 환불`,
    annotations: [
      { lines: [2, 5], color: 'sky', note: 'RETURN — 메모리에서 데이터 복사 후 errStopToken으로 루프 탈출' },
      { lines: [8, 11], color: 'emerald', note: 'REVERT — 동일하게 데이터 반환하지만 ErrExecutionReverted → 상태 롤백' },
      { lines: [14, 15], color: 'amber', note: 'STOP — 반환 데이터 없이 종료, RETURN(offset=0,size=0)과 동일 효과' },
    ],
  },
};
