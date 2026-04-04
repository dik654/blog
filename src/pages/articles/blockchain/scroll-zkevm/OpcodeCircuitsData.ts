export const OPCODE_DISPATCH_CODE = `// bus-mapping: OpcodeId → 처리 함수 디스패칭
fn fn_gen_associated_ops(opcode_id: &OpcodeId) -> FnGenAssociatedOps {
    if opcode_id.is_push_with_data() { return PushN::gen_associated_ops; }
    match opcode_id {
        OpcodeId::ADD => ArithmeticOpcode::<{ OpcodeId::ADD }, 2>::gen_associated_ops,
        OpcodeId::SLOAD => Sload::gen_associated_ops,
        OpcodeId::SSTORE => Sstore::gen_associated_ops,
        OpcodeId::CALL | OpcodeId::CALLCODE => CallOpcode::<7>::gen_associated_ops,
        OpcodeId::CREATE => Create::<false>::gen_associated_ops,
        // ... 140+ 오퍼코드
    }
}`;

export const dispatchAnnotations = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: 'PUSH 계열 — 별도 처리' },
  { lines: [4, 5] as [number, number], color: 'emerald' as const, note: '스택 연산 — StackPopOnlyOpcode' },
  { lines: [6, 7] as [number, number], color: 'amber' as const, note: '스토리지 연산 — StateDB 접근' },
  { lines: [8, 10] as [number, number], color: 'violet' as const, note: 'CALL/CREATE — 컨텍스트 전환' },
];

export const STACK_OP_CODE = `// StackPopOnlyOpcode — 가장 단순한 패턴
// 예: ADD, MUL, SUB, POP, JUMP
impl<const N_POP: usize, const IS_ERR: bool> Opcode
    for StackPopOnlyOpcode<N_POP, IS_ERR> {
    fn gen_associated_ops(state, geth_steps) -> Result<Vec<ExecStep>> {
        let mut exec_step = state.new_step(geth_step)?;
        let _stack_inputs = state.stack_pops(&mut exec_step, N_POP)?;
        if IS_ERR { /* 에러 처리 */ }
        Ok(vec![exec_step])
    }
}
// 처리: ExecStep 생성 → N개 스택 팝 → (에러 체크) → 반환`;

export const stackOpAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'N_POP/IS_ERR 제네릭 파라미터' },
  { lines: [5, 8] as [number, number], color: 'emerald' as const, note: 'new_step → stack_pops → 반환' },
];

export const STORAGE_OP_CODE = `// SLOAD — 스토리지 읽기
impl Opcode for Sload {
    fn gen_associated_ops(state, geth_steps) -> Result<Vec<ExecStep>> {
        // 1. CallContext 읽기 (TxId, RwCounterEndOfReversion)
        state.call_context_read(&mut exec_step, call_id, CallContextField::TxId, ...)?;
        // 2. 스택에서 storage key 팝
        let key = state.stack_pop(&mut exec_step)?;
        // 3. StateDB에서 값 조회
        let value = *state.sdb.get_storage(&contract_addr, &key).1;
        // 4. StorageOp 생성 (READ) → RwTable 기록
        state.push_op(&mut exec_step, RW::READ,
            StorageOp::new(contract_addr, key, value, value, ...))?;
        // 5. 스택에 값 푸시 + Access list 업데이트
        state.stack_push(&mut exec_step, value)?;
    }
}`;

export const storageAnnotations = [
  { lines: [4, 4] as [number, number], color: 'sky' as const, note: 'CallContext — TxId 읽기' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: '스택 팝 → StateDB 조회' },
  { lines: [10, 12] as [number, number], color: 'amber' as const, note: 'StorageOp(READ) → RwTable' },
  { lines: [14, 14] as [number, number], color: 'violet' as const, note: '결과 푸시 + 워밍 상태' },
];
