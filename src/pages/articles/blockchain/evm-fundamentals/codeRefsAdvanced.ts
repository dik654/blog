import type { CodeRef } from '@/components/code/types';

export const advancedCodeRef: Record<string, CodeRef> = {
  'evm-create': {
    path: 'core/vm/evm.go — Create()',
    lang: 'go',
    highlight: [1, 24],
    desc: 'CREATE 옵코드의 핵심 함수.\nnonce 기반 주소 생성 → init 코드 실행 → 코드 저장.',
    code: `func (evm *EVM) Create(caller, code, gas, value) {
    // 1. nonce 기반 컨트랙트 주소 생성
    nonce := evm.StateDB.GetNonce(caller)
    contractAddr := crypto.CreateAddress(caller, nonce)
    evm.StateDB.SetNonce(caller, nonce+1, tracing.NonceChangeContractCreator)

    // 2. 스냅샷 + 신규 계정 생성
    snapshot := evm.StateDB.Snapshot()
    evm.StateDB.CreateAccount(contractAddr)
    evm.StateDB.SetNonce(contractAddr, 1, tracing.NonceChangeNewContract)
    evm.Context.Transfer(evm.StateDB, caller, contractAddr, value)

    // 3. init 코드 실행 → 리턴값이 배포될 바이트코드
    contract := NewContract(caller, contractAddr, value, gas)
    contract.SetCallCode(codeHash, code)
    ret, err := evm.Run(contract, nil, false)

    // 4. EIP-170: 코드 크기 제한 (24,576 bytes)
    if len(ret) > params.MaxCodeSize { err = ErrMaxCodeSizeExceeded }

    // 5. 코드 저장 가스: 200 * len(ret)
    if err == nil { evm.StateDB.SetCode(contractAddr, ret) }
    if err != nil { evm.StateDB.RevertToSnapshot(snapshot) }
}`,
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'CreateAddress — keccak256(rlp([sender, nonce]))[12:]로 주소 도출' },
      { lines: [15, 16], color: 'emerald', note: 'init 코드 Run — 리턴값이 배포될 런타임 바이트코드 (생성자 로직)' },
      { lines: [19, 19], color: 'amber', note: 'EIP-170 — 최대 24KB, 이를 초과하면 배포 실패' },
      { lines: [22, 22], color: 'violet', note: '코드 저장 가스 — 200 gas/byte, 배포 비용의 주요 부분' },
    ],
  },
  'evm-create2': {
    path: 'core/vm/evm.go — Create2()',
    lang: 'go',
    highlight: [1, 16],
    desc: 'CREATE2 (EIP-1014).\nsalt 기반 결정론적 주소 — 배포 전에 주소를 예측할 수 있음.',
    code: `func (evm *EVM) Create2(caller, code, gas, endowment, salt) {
    // CREATE2 주소: keccak256(0xff ++ sender ++ salt ++ keccak256(initCode))
    codeHash := crypto.Keccak256Hash(code)
    contractAddr := crypto.CreateAddress2(caller, salt, codeHash.Bytes())

    // 이후 로직은 Create()와 동일:
    // 스냅샷 → 계정 생성 → init 코드 실행 → 코드 저장
    snapshot := evm.StateDB.Snapshot()
    evm.StateDB.CreateAccount(contractAddr)
    evm.StateDB.SetNonce(contractAddr, 1, tracing.NonceChangeNewContract)
    evm.Context.Transfer(evm.StateDB, caller, contractAddr, endowment)

    contract := NewContract(caller, contractAddr, endowment, gas)
    contract.SetCallCode(codeHash, code)
    ret, err := evm.Run(contract, nil, false)
    // ... maxCodeSize 검증 + 코드 저장 (Create와 동일)
}`,
    annotations: [
      { lines: [2, 4], color: 'sky', note: '결정론적 주소 — salt + initCode 해시로 결정, nonce 무관' },
      { lines: [4, 4], color: 'emerald', note: 'CreateAddress2 — 팩토리 패턴에서 배포 전 주소 예측에 활용' },
    ],
  },
  'evm-delegatecall': {
    path: 'core/vm/evm.go — DelegateCall()',
    lang: 'go',
    highlight: [1, 18],
    desc: 'DELEGATECALL — 대상 코드를 호출자 컨텍스트에서 실행.\nmsg.sender, msg.value, storage 모두 호출자 것을 유지.',
    code: `func (evm *EVM) DelegateCall(caller, addr common.Address,
    input []byte, gas uint64,
) (ret []byte, leftOverGas uint64, err error) {
    if evm.depth > int(params.CallCreateDepth) {
        return nil, gas, ErrDepth
    }
    snapshot := evm.StateDB.Snapshot()

    // 핵심: caller와 value가 바뀌지 않음
    contract := NewContract(caller, caller, nil, gas, evm.jumpDests)
    // 대상 주소의 코드만 가져와 실행
    contract.SetCallCode(addr, evm.resolveCodeHash(addr),
        evm.resolveCode(addr))
    contract.AsDelegate()  // DelegateCall 플래그 설정

    ret, err = evm.Run(contract, input, false)
    if err != nil { evm.StateDB.RevertToSnapshot(snapshot) }
    return ret, contract.Gas, err
}`,
    annotations: [
      { lines: [10, 10], color: 'sky', note: 'caller 보존 — 두 번째 인자도 caller, storage 컨텍스트가 호출자에 유지' },
      { lines: [12, 13], color: 'emerald', note: '코드만 차용 — addr의 바이트코드를 가져오되 실행 주체는 caller' },
      { lines: [14, 14], color: 'amber', note: 'AsDelegate — 프록시 패턴의 핵심, SSTORE가 caller 스토리지에 기록' },
    ],
  },
  'evm-staticcall': {
    path: 'core/vm/evm.go — StaticCall()',
    lang: 'go',
    highlight: [1, 18],
    desc: 'STATICCALL — 읽기 전용 호출.\n상태 변경 시도 시 ErrWriteProtection 반환.',
    code: `func (evm *EVM) StaticCall(caller, addr common.Address,
    input []byte, gas uint64,
) (ret []byte, leftOverGas uint64, err error) {
    if evm.depth > int(params.CallCreateDepth) {
        return nil, gas, ErrDepth
    }
    // readOnly 플래그 활성화
    if !evm.interpreter.readOnly {
        evm.interpreter.readOnly = true
        defer func() { evm.interpreter.readOnly = false }()
    }

    snapshot := evm.StateDB.Snapshot()
    contract := NewContract(caller, addr, new(uint256.Int), gas)
    contract.SetCallCode(evm.resolveCodeHash(addr), evm.resolveCode(addr))

    ret, err = evm.Run(contract, input, true)  // readOnly=true
    if err != nil { evm.StateDB.RevertToSnapshot(snapshot) }
}`,
    annotations: [
      { lines: [8, 10], color: 'sky', note: 'readOnly 설정 — 중첩 호출에도 유지, 최외곽에서만 해제 (defer)' },
      { lines: [14, 14], color: 'emerald', note: 'value=0 고정 — StaticCall은 ETH 전송 불가' },
      { lines: [17, 17], color: 'amber', note: 'readOnly=true — SSTORE, CREATE, LOG, SELFDESTRUCT 시 revert' },
    ],
  },
  'op-create': {
    path: 'core/vm/instructions.go — opCreate()',
    lang: 'go',
    highlight: [1, 18],
    desc: 'CREATE/CREATE2 옵코드 핸들러.\n스택에서 파라미터를 꺼내 EVM.Create() 호출.',
    code: `func opCreate(pc *uint64, interpreter *EVMInterpreter,
    scope *ScopeContext,
) ([]byte, error) {
    var (
        value  = scope.Stack.pop()   // 전송할 ETH
        offset = scope.Stack.pop()   // 메모리 오프셋
        size   = scope.Stack.pop()   // init 코드 크기
    )
    // 메모리에서 init 코드 읽기
    input := scope.Memory.GetCopy(offset.Uint64(), size.Uint64())
    gas := scope.Contract.Gas

    // CREATE vs CREATE2 분기
    var addr common.Address
    if interpreter.isCreate2 {
        salt := scope.Stack.pop()
        addr = crypto.CreateAddress2(scope.Contract.Address(), salt, input)
    }
    res, addr, leftGas, err := interpreter.evm.Create(
        scope.Contract.Address(), input, gas, &value)

    // 결과: 성공 시 주소, 실패 시 0을 스택에 push
    scope.Stack.push(new(uint256.Int).SetBytes(addr.Bytes()))
    return nil, nil
}`,
    annotations: [
      { lines: [5, 7], color: 'sky', note: '스택 pop — value(ETH), offset, size 3개를 순서대로 꺼냄' },
      { lines: [10, 10], color: 'emerald', note: 'init 코드 — 메모리에서 복사, 컨트랙트 생성자 바이트코드' },
      { lines: [19, 20], color: 'amber', note: 'evm.Create 호출 — 주소 생성 + init 실행 + 코드 저장' },
      { lines: [23, 23], color: 'violet', note: '결과 push — 성공 시 새 주소, 실패 시 0' },
    ],
  },
  'op-selfdestruct': {
    path: 'core/vm/instructions.go — opSelfdestruct()',
    lang: 'go',
    highlight: [1, 20],
    desc: 'SELFDESTRUCT 옵코드.\nEIP-6780 이후 같은 트랜잭션에서 생성된 경우만 삭제.',
    code: `func opSelfdestruct(pc *uint64, interpreter *EVMInterpreter,
    scope *ScopeContext,
) ([]byte, error) {
    // readOnly 모드에서 금지
    if interpreter.readOnly {
        return nil, ErrWriteProtection
    }

    beneficiary := scope.Stack.pop()  // 잔액 수신 주소
    balance := interpreter.evm.StateDB.GetBalance(
        scope.Contract.Address())

    // EIP-6780: 같은 TX에서 생성된 경우만 실제 삭제
    // 그 외에는 잔액만 이동, 코드/스토리지 유지
    interpreter.evm.StateDB.SelfDestruct6780(
        scope.Contract.Address())

    // 잔액을 beneficiary에게 전송
    interpreter.evm.StateDB.AddBalance(
        common.Address(beneficiary.Bytes20()), balance)

    return nil, errStopToken  // 실행 중단
}`,
    annotations: [
      { lines: [5, 7], color: 'sky', note: 'readOnly 검증 — STATICCALL 내에서 SELFDESTRUCT 불가' },
      { lines: [15, 16], color: 'emerald', note: 'EIP-6780 — Cancun 이후 같은 TX 생성분만 삭제, 나머지는 잔액 이동만' },
      { lines: [19, 20], color: 'amber', note: 'beneficiary — 남은 잔액 전체를 지정 주소로 전송' },
    ],
  },
};
