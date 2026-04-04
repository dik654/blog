export const GADGET_TRAIT_CODE = `// zkevm-circuits/src/evm_circuit/execution.rs

pub(crate) trait ExecutionGadget<F: Field> {
    const NAME: &'static str;
    const EXECUTION_STATE: ExecutionState;

    // 제약 정의 (keygen 시 호출): 회로 열 쿼리 + 논리 제약 등록
    fn configure(cb: &mut EVMConstraintBuilder<F>) -> Self;

    // 실행 트레이스 할당 (prove 시 호출): 셀에 실제 값 기입
    fn assign_exec_step(
        &self,
        region: &mut CachedRegion<'_, '_, F>,
        offset: usize,
        block: &Block,       // 블록 메타데이터
        transaction: &Transaction,
        call: &Call,
        step: &ExecStep,     // bus-mapping이 제공한 실행 트레이스
    ) -> Result<(), Error>;
}`;

export const ADD_SUB_CODE = `// zkevm-circuits/src/evm_circuit/execution/add_sub.rs

pub(crate) struct AddSubGadget<F> {
    same_context: SameContextGadget<F>,  // 공통 오퍼코드 상태 전환
    add_words: AddWordsGadget<F, 2, false>,  // a + b = c (mod 2^256)
    is_sub: PairSelectGadget<F>,         // SUB이면 a↔c 교환
}

impl<F: Field> ExecutionGadget<F> for AddSubGadget<F> {
    const EXECUTION_STATE: ExecutionState = ExecutionState::ADD_SUB;

    fn configure(cb: &mut EVMConstraintBuilder<F>) -> Self {
        let (a, b, c) = (cb.query_word_rlc(), cb.query_word_rlc(), cb.query_word_rlc());
        let add_words = AddWordsGadget::construct(cb, [a.clone(), b.clone()], c.clone());

        // SUB면 a↔c 교환: is_sub = (opcode == SUB)
        let is_sub = PairSelectGadget::construct(cb, opcode, OpcodeId::SUB, OpcodeId::ADD);

        // 스택 팝/푸시 제약 (RwTable 룩업)
        cb.stack_pop(select::expr(is_sub.expr().0, c.expr(), a.expr()));
        cb.stack_pop(b.expr());
        cb.stack_push(select::expr(is_sub.expr().0, a.expr(), c.expr()));

        // 상태 전환: pc+1, stack_ptr+1, gas-3
        let step_state = StepStateTransition {
            rw_counter: Delta(3.expr()),
            program_counter: Delta(1.expr()),
            stack_pointer: Delta(1.expr()),
            gas_left: Delta(-OpcodeId::ADD.constant_gas_cost().expr()),
            ..Default::default()
        };
        let same_context = SameContextGadget::construct(cb, opcode, step_state);
        Self { same_context, add_words, is_sub }
    }
}`;

export const BUS_MAPPING_CODE = `// bus-mapping 크레이트: EVM 실행 트레이스 → 회로 입력 변환
// ExecStep: {opcode, stack_reads, stack_writes, memory_reads, ...}
//
// assign_exec_step에서:
//   let a = block.get_rws(step, 0).stack_value();  // 스택 팝
//   let b = block.get_rws(step, 1).stack_value();
//   let c = a.overflowing_add(b).0;               // ADD 결과
//   self.add_words.assign(region, offset, [a, b], c)?;
//   self.is_sub.assign(region, offset, ..., opcode)?;
//   self.same_context.assign_exec_step(region, offset, block, step)?;

// 전체 회로 증명 파이프라인:
// 1. bus-mapping으로 EVM 트레이스 재실행 → Block 구조체 생성
// 2. EvmCircuit::synthesize(&block) → Halo2 어드바이스 열 할당
// 3. create_proof() → KZG 커밋 + SHPLONK 개구 증명
// 4. 모든 서브회로 증명을 집계(aggregation)하여 온체인 검증`;
