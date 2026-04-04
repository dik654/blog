import type { CodeRef } from '@/components/code/types';

export const callBranchesCodeRef: Record<string, CodeRef> = {
  'precompile-run': {
    path: 'core/vm/contracts.go — RunPrecompiledContract()',
    lang: 'go',
    highlight: [1, 18],
    desc: '프리컴파일 컨트랙트 실행.\n입력 검증 → 가스 계산 → 네이티브 Go 함수 호출.',
    code: `func RunPrecompiledContract(
    stateDB StateDB, p PrecompiledContract, callerAddr common.Address,
    input []byte, suppliedGas uint64, logger *tracing.Hooks,
) (ret []byte, remainingGas uint64, err error) {
    // 1. 가스 비용 계산 (각 프리컴파일마다 RequiredGas() 구현)
    gasCost := p.RequiredGas(input)
    if suppliedGas < gasCost {
        return nil, 0, ErrOutOfGas
    }
    suppliedGas -= gasCost

    // 2. 네이티브 Go 코드로 실행 (EVM 바이트코드 아님)
    output, err := p.Run(input)
    if err != nil {
        return nil, 0, err
    }
    return output, suppliedGas, nil
}`,
    annotations: [
      { lines: [6, 9], color: 'sky', note: 'RequiredGas — 프리컴파일별 고정/입력 비례 가스 (ecRecover: 3000, SHA256: 기본60+워드12)' },
      { lines: [12, 13], color: 'emerald', note: 'Run — 순수 Go 코드, EVM 인터프리터를 거치지 않음 (10~100배 빠름)' },
    ],
  },
  'new-contract': {
    path: 'core/vm/contract.go — NewContract()',
    lang: 'go',
    highlight: [1, 22],
    desc: '호출 프레임에 대응하는 Contract 객체 생성.\ncaller, 주소, 가스, 코드를 묶어 인터프리터에 전달.',
    code: `type Contract struct {
    CallerAddress common.Address  // msg.sender
    self          common.Address  // 실행 주소 (DELEGATECALL 시 caller와 다름)
    Code          []byte          // 실행할 바이트코드
    CodeHash      common.Hash     // 코드 해시 (JUMPDEST 캐시 키)
    Input         []byte          // calldata
    Gas           uint64          // 잔여 가스 (실행 중 차감)
    value         *uint256.Int    // msg.value
    jumpDests     JumpDestCache   // JUMPDEST 위치 비트맵
}

func NewContract(caller, self common.Address,
    value *uint256.Int, gas uint64, jumpDests JumpDestCache,
) *Contract {
    return &Contract{
        CallerAddress: caller,
        self:          self,
        Gas:           gas,
        value:         value,
        jumpDests:     jumpDests,
    }
}`,
    annotations: [
      { lines: [2, 3], color: 'sky', note: 'CallerAddress vs self — DELEGATECALL이면 self가 호출자 주소를 유지' },
      { lines: [4, 5], color: 'emerald', note: 'Code + CodeHash — SetCallCode()로 별도 설정, JUMPDEST 캐시에 해시를 키로 사용' },
      { lines: [7, 7], color: 'amber', note: 'Gas — 인터프리터 루프에서 매 opcode마다 직접 차감' },
    ],
  },
  'snapshot-revert': {
    path: 'core/state/journal.go — Snapshot / RevertToSnapshot',
    lang: 'go',
    highlight: [1, 22],
    desc: 'StateDB의 저널 기반 스냅샷.\n호출 실패 시 상태를 되돌리는 핵심 메커니즘.',
    code: `type journal struct {
    entries []journalEntry   // 상태 변경 기록 (append-only)
    dirties map[common.Address]int  // 변경된 계정 카운터
}

// Snapshot — 현재 저널 길이를 스냅샷 ID로 반환
func (j *journal) Snapshot() int {
    return len(j.entries)
}

// RevertToSnapshot — 스냅샷 이후 변경을 역순으로 undo
func (j *journal) RevertToSnapshot(snapshot int, s *StateDB) {
    for i := len(j.entries) - 1; i >= snapshot; i-- {
        j.entries[i].revert(s)   // 각 entry가 revert 로직 보유
    }
    j.entries = j.entries[:snapshot]  // 저널 잘라냄
}

// journalEntry 예시: balanceChange, storageChange, nonceChange,
// codeChange, suicideChange, touchChange ...
// 각각 revert() 메서드로 이전 값 복원`,
    annotations: [
      { lines: [2, 2], color: 'sky', note: 'entries — append-only 리스트, 각 항목이 하나의 상태 변경을 기록' },
      { lines: [7, 9], color: 'emerald', note: 'Snapshot — 저널 길이 = 스냅샷 ID (정수 하나로 표현, 매우 가벼움)' },
      { lines: [13, 15], color: 'amber', note: '역순 revert — 최신 변경부터 되돌려 원래 상태 복원' },
    ],
  },
};
