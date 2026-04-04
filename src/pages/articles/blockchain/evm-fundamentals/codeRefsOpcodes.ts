import type { CodeRef } from '@/components/code/types';

export const opcodeCodeRef: Record<string, CodeRef> = {
  'op-add': {
    path: 'core/vm/instructions.go — opAdd()',
    lang: 'go',
    highlight: [1, 16],
    desc: '산술 연산 opcode 구현 예시.\npop/peek 패턴으로 메모리 할당 없이 in-place 연산.',
    code: `func opAdd(pc *uint64, evm *EVM, scope *ScopeContext) ([]byte, error) {
    x, y := scope.Stack.pop(), scope.Stack.peek()
    y.Add(&x, y)   // y = x + y (in-place, 할당 없음)
    return nil, nil
}

func opMul(pc *uint64, evm *EVM, scope *ScopeContext) ([]byte, error) {
    x, y := scope.Stack.pop(), scope.Stack.peek()
    y.Mul(&x, y)
    return nil, nil
}

// pop() — 값을 꺼내서 복사본 반환 (스택 축소)
// peek() — 최상단 포인터 반환 (스택 유지, in-place 수정용)
// → 두 값 연산 시 pop+peek 조합으로 할당 0회
// 모든 산술: ADD(3), SUB(3), MUL(5), DIV(5), MOD(5), EXP(10+)`,
    annotations: [
      { lines: [2, 3], color: 'sky', note: 'pop+peek — x는 복사본, y는 포인터 → y에 결과를 직접 쓰면 push 불필요' },
      { lines: [13, 15], color: 'emerald', note: '최적화 포인트 — 매 opcode마다 새 uint256 할당을 피하는 패턴' },
    ],
  },
  'op-sload': {
    path: 'core/vm/instructions.go — opSload() / opSstore()',
    lang: 'go',
    highlight: [1, 18],
    desc: '스토리지 읽기/쓰기 오피코드.\n가장 비싼 연산 — cold SLOAD 2100gas, SSTORE 최대 20000gas.',
    code: `func opSload(pc *uint64, evm *EVM, scope *ScopeContext) ([]byte, error) {
    loc := scope.Stack.peek()
    hash := common.Hash(loc.Bytes32())
    val := evm.StateDB.GetState(scope.Contract.Address(), hash)
    loc.SetBytes(val.Bytes())
    return nil, nil
}

func opSstore(pc *uint64, evm *EVM, scope *ScopeContext) ([]byte, error) {
    if evm.readOnly {
        return nil, ErrWriteProtection  // STATICCALL 내에서 쓰기 금지
    }
    loc := scope.Stack.pop()
    val := scope.Stack.pop()
    evm.StateDB.SetState(scope.Contract.Address(),
        loc.Bytes32(), val.Bytes32())
    return nil, nil
}`,
    annotations: [
      { lines: [2, 5], color: 'sky', note: 'SLOAD — peek()로 슬롯 주소 읽고, StateDB에서 값을 가져와 같은 위치에 덮어씀' },
      { lines: [10, 11], color: 'amber', note: 'readOnly 체크 — STATICCALL 중이면 상태 변경 즉시 revert' },
      { lines: [13, 16], color: 'emerald', note: 'SSTORE — 두 값을 pop하여 StateDB에 기록 (0→non-zero: 20000gas)' },
    ],
  },
  'op-call': {
    path: 'core/vm/instructions.go — opCall()',
    lang: 'go',
    highlight: [1, 20],
    desc: 'CALL opcode — 외부 컨트랙트 호출.\n스택에서 7개 인자를 꺼내 EVM.Call()로 위임.',
    code: `func opCall(pc *uint64, evm *EVM, scope *ScopeContext) ([]byte, error) {
    stack := scope.Stack
    temp := stack.pop()        // gas (실제로는 evm.callGasTemp 사용)
    gas := evm.callGasTemp     // 63/64 규칙으로 계산된 가스

    // 스택에서 호출 파라미터 pop
    addr, value := stack.pop(), stack.pop()
    inOffset, inSize := stack.pop(), stack.pop()
    retOffset, retSize := stack.pop(), stack.pop()
    toAddr := common.Address(addr.Bytes20())

    // 메모리에서 입력 데이터 읽기
    args := scope.Memory.GetPtr(inOffset.Uint64(), inSize.Uint64())

    // EVM.Call() 호출 — 새로운 실행 프레임 생성
    ret, returnGas, err := evm.Call(scope.Contract.Address(),
        toAddr, args, gas, &value)

    // 결과를 메모리에 복사 + 성공/실패 플래그 push
    scope.Memory.Set(retOffset.Uint64(), retSize.Uint64(), ret)
    if err != nil { stack.push(&temp.SetOne()) }   // 0 = 실패
    else          { stack.push(new(uint256.Int)) }  // 1 = 성공
}`,
    annotations: [
      { lines: [4, 4], color: 'sky', note: '63/64 규칙 — 가용 가스의 1/64를 현재 프레임에 유보 (EIP-150)' },
      { lines: [7, 10], color: 'emerald', note: '7개 파라미터 — gas, addr, value, inOffset, inSize, retOffset, retSize' },
      { lines: [16, 17], color: 'amber', note: 'evm.Call() — 새 ScopeContext와 인터프리터 루프를 재귀적으로 생성' },
      { lines: [20, 22], color: 'violet', note: '반환 처리 — 결과를 메모리에 쓰고 성공 여부(0/1)를 스택에 push' },
    ],
  },
  'stack': {
    path: 'core/vm/stack.go — Stack',
    lang: 'go',
    highlight: [1, 24],
    desc: 'EVM 스택 구현.\nsync.Pool로 재사용, 최대 1024 깊이.',
    code: `var stackPool = sync.Pool{
    New: func() interface{} {
        return &Stack{data: make([]uint256.Int, 0, 16)}  // 초기 용량 16
    },
}

type Stack struct {
    data []uint256.Int   // 256비트 정수 슬라이스
}

func newstack() *Stack { return stackPool.Get().(*Stack) }

func returnStack(s *Stack) {
    s.data = s.data[:0]  // 길이만 0으로 (용량 유지 → 재할당 방지)
    stackPool.Put(s)
}

func (st *Stack) push(d *uint256.Int) {
    st.data = append(st.data, *d)   // 1024 제한은 인터프리터에서 검증
}

func (st *Stack) pop() (ret uint256.Int) {
    ret = st.data[len(st.data)-1]
    st.data = st.data[:len(st.data)-1]
    return
}`,
    annotations: [
      { lines: [1, 4], color: 'sky', note: 'sync.Pool — 호출마다 스택을 새로 할당하지 않음 (GC 부담 감소)' },
      { lines: [8, 8], color: 'emerald', note: '256비트 정수 — 이더리움 워드 크기, holiman/uint256 라이브러리' },
      { lines: [13, 15], color: 'amber', note: 'returnStack — 길이만 0으로 리셋하여 용량 유지 후 풀에 반환' },
      { lines: [18, 20], color: 'violet', note: 'push — append로 추가, 1024 제한은 인터프리터 루프에서 maxStack으로 체크' },
    ],
  },
  'memory': {
    path: 'core/vm/memory.go — Memory',
    lang: 'go',
    highlight: [1, 22],
    desc: 'EVM 메모리 구현.\n바이트 배열로 동적 확장, 가스 비용 이차 증가.',
    code: `type Memory struct {
    store       []byte    // 실제 메모리 데이터
    lastGasCost uint64    // 증분 가스 계산용 (이전 비용 기록)
}

// Resize — 필요한 크기로 메모리 확장
func (m *Memory) Resize(size uint64) {
    if uint64(len(m.store)) < size {
        if uint64(cap(m.store)) >= size {
            m.store = m.store[:size]      // 용량 내 → 슬라이스만 확장
        } else {
            m.store = append(m.store, make([]byte, size-uint64(len(m.store)))...)
        }
    }
}

// Free — 16KB 이하만 풀에 반환 (대용량 메모리 누적 방지)
func (m *Memory) Free() {
    const maxBufferSize = 16 << 10  // 16KB
    if cap(m.store) <= maxBufferSize {
        m.store = m.store[:0]
        memoryPool.Put(m)
    }
}`,
    annotations: [
      { lines: [2, 3], color: 'sky', note: 'lastGasCost — 메모리 가스는 증분만 과금 (이전까지의 비용을 기록)' },
      { lines: [9, 10], color: 'emerald', note: '용량 내 확장 — cap이 충분하면 슬라이스 길이만 늘림 (재할당 없음)' },
      { lines: [19, 20], color: 'amber', note: '16KB 제한 — 대형 메모리는 풀에 반환하지 않아 메모리 누적 방지' },
    ],
  },
};
