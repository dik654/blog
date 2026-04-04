import type { CodeRef } from '@/components/code/types';

export const interpreterCodeRef: Record<string, CodeRef> = {
  'scope-context': {
    path: 'core/vm/interpreter.go — ScopeContext',
    lang: 'go',
    highlight: [1, 12],
    desc: '각 호출(call frame)마다 생성되는 실행 컨텍스트.\nMemory, Stack, Contract 세 가지를 보유.',
    code: `// ScopeContext contains the things that are per-call,
// such as stack and memory, but not transients like pc and gas
type ScopeContext struct {
    Memory   *Memory    // 바이트 배열, 동적 확장 (가스 이차 증가)
    Stack    *Stack     // []uint256.Int, 최대 1024
    Contract *Contract  // 코드, 가스, caller, address, value
}

// Stack — sync.Pool로 재사용, 초기 용량 16
type Stack struct { data []uint256.Int }

// Memory — []byte, 32바이트 워드 단위 확장
type Memory struct { store []byte; lastGasCost uint64 }`,
    annotations: [
      { lines: [4, 4], color: 'sky', note: 'Memory — 동적 []byte, 확장 시 가스 = 3*words + words²/512' },
      { lines: [5, 5], color: 'emerald', note: 'Stack — 256비트 정수 배열, push/pop/peek/dup/swap 지원' },
      { lines: [6, 6], color: 'amber', note: 'Contract — 실행 중인 코드, 잔여 가스, 호출자 주소 보유' },
      { lines: [9, 10], color: 'violet', note: 'sync.Pool — 호출마다 새로 할당하지 않고 풀에서 재사용 (GC 부담 감소)' },
    ],
  },
  'interp-run': {
    path: 'core/vm/interpreter.go — Run()',
    lang: 'go',
    highlight: [1, 42],
    desc: 'EVM 인터프리터 메인 루프.\n바이트코드를 한 opcode씩 fetch → decode → execute.',
    code: `func (evm *EVM) Run(contract *Contract, input []byte, readOnly bool) (ret []byte, err error) {
    evm.depth++                    // 호출 깊이 증가
    defer func() { evm.depth-- }()
    evm.returnData = nil           // 이전 반환 데이터 초기화
    if len(contract.Code) == 0 { return nil, nil }  // 빈 코드

    var (
        op        OpCode
        jumpTable = evm.table        // 현재 하드포크의 JumpTable[256]
        mem       = NewMemory()      // 메모리 (sync.Pool에서 할당)
        stack     = newstack()       // 스택 (sync.Pool에서 할당)
        callContext = &ScopeContext{Memory: mem, Stack: stack, Contract: contract}
        pc        = uint64(0)        // 프로그램 카운터
    )
    defer func() { returnStack(stack); mem.Free() }()
    contract.Input = input

    // ── 메인 실행 루프 ──
    for {
        op = contract.GetOp(pc)           // ① Fetch: 바이트코드[pc] → opcode
        operation := jumpTable[op]        // ② Decode: 점프 테이블에서 operation 조회

        // ③ 스택 검증 (underflow / overflow)
        if sLen := stack.len(); sLen < operation.minStack {
            return nil, &ErrStackUnderflow{stackLen: sLen, required: operation.minStack}
        } else if sLen > operation.maxStack {
            return nil, &ErrStackOverflow{stackLen: sLen, limit: operation.maxStack}
        }

        // ④ 고정 가스 차감
        if contract.Gas < operation.constantGas {
            return nil, ErrOutOfGas
        }
        contract.Gas -= operation.constantGas

        // ⑤ 동적 가스 (메모리 확장 등)
        if operation.dynamicGas != nil {
            dynamicCost, err = operation.dynamicGas(evm, contract, stack, mem, memorySize)
            contract.Gas -= dynamicCost
        }
        if memorySize > 0 { mem.Resize(memorySize) }  // ⑥ 메모리 확장

        // ⑦ Execute: opcode 실행
        res, err = operation.execute(&pc, evm, callContext)
        if err != nil { break }
        pc++
    }
    if err == errStopToken { err = nil }  // STOP/RETURN은 정상 종료
    return res, err
}`,
    annotations: [
      { lines: [2, 5], color: 'sky', note: '초기화 — depth 증가, 빈 코드 early return' },
      { lines: [7, 16], color: 'emerald', note: 'ScopeContext 생성 — Memory, Stack을 sync.Pool에서 할당 (성능 최적화)' },
      { lines: [20, 21], color: 'amber', note: 'Fetch-Decode — pc 위치의 opcode를 읽고 jumpTable[256]에서 O(1) 조회' },
      { lines: [30, 34], color: 'violet', note: '고정 가스 — 각 opcode의 constantGas를 먼저 차감' },
      { lines: [37, 41], color: 'rose', note: '동적 가스 — 메모리 확장 비용 등 런타임에 계산하여 추가 차감' },
    ],
  },
  'jump-table': {
    path: 'core/vm/jump_table.go — operation struct',
    lang: 'go',
    highlight: [1, 22],
    desc: '각 opcode의 메타데이터를 담는 구조체.\n실행 함수, 가스, 스택 요구사항을 정의.',
    code: `type (
    executionFunc  func(pc *uint64, evm *EVM, scope *ScopeContext) ([]byte, error)
    gasFunc        func(*EVM, *Contract, *Stack, *Memory, uint64) (uint64, error)
    memorySizeFunc func(*Stack) (size uint64, overflow bool)
)

type operation struct {
    execute     executionFunc   // opcode 실행 함수 포인터
    constantGas uint64          // 고정 가스 비용 (예: ADD=3, MUL=5)
    dynamicGas  gasFunc         // 동적 가스 계산 (메모리 확장 등)
    minStack    int             // 필요한 최소 스택 항목 수
    maxStack    int             // 스택 오버플로우 한계
    memorySize  memorySizeFunc  // 필요한 메모리 크기 계산
    undefined   bool            // 미정의 opcode 여부
}

// JumpTable — 256개 opcode 슬롯, 하드포크별 별도 테이블
type JumpTable [256]*operation

// 하드포크 체인:
// Frontier → Homestead(+DELEGATECALL) → Byzantium(+STATICCALL)
// → Constantinople(+CREATE2) → Berlin(EIP-2929) → London(BASEFEE)
// → Shanghai(PUSH0) → Cancun(TLOAD/TSTORE, MCOPY) → Prague`,
    annotations: [
      { lines: [2, 2], color: 'sky', note: 'executionFunc — 모든 opcode가 동일한 시그니처 (pc, evm, scope) → ([]byte, error)' },
      { lines: [8, 9], color: 'emerald', note: 'execute + constantGas — 실행 함수와 고정 비용을 한 쌍으로' },
      { lines: [10, 10], color: 'amber', note: 'dynamicGas — SSTORE, CALL 등은 런타임에 가스가 달라짐' },
      { lines: [18, 18], color: 'violet', note: '[256]*operation — opcode 1바이트 → 배열 인덱스로 O(1) 디스패치' },
    ],
  },
};
