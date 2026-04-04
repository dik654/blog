export const WITNESS_PIPELINE_CODE = `// Witness 생성 파이프라인 (4단계)
// 1. Geth 트레이스 수집
struct GethExecTrace { gas, failed, return_value, struct_logs: Vec<GethExecStep> }

// 2. Bus-Mapping 변환 → CircuitInputBuilder
struct CircuitInputBuilder {
    pub sdb: StateDB,      // 상태 데이터베이스
    pub code_db: CodeDB,   // 코드 데이터베이스
    pub block: Blocks,     // 블록 데이터
}

// 3. Block 변환 → block_convert()
//    RW 연산 맵 → 트랜잭션 변환 → 실행 단계 → MPT 업데이트 → Bytecode 수집

// 4. 각 회로별 Witness 생성
//    EVM Circuit → State Circuit → Bytecode Circuit → 기타`;

export const pipelineAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: '1단계: Geth에서 EVM 트레이스 수집' },
  { lines: [5, 10] as [number, number], color: 'emerald' as const, note: '2단계: CircuitInputBuilder로 변환' },
  { lines: [12, 13] as [number, number], color: 'amber' as const, note: '3단계: Block 구조체 생성' },
  { lines: [15, 16] as [number, number], color: 'violet' as const, note: '4단계: 회로별 Witness 할당' },
];

export const BLOCK_WITNESS_CODE = `// Block — 모든 회로가 공유하는 통합 Witness 구조
pub struct Block {
    pub txs: Vec<Transaction>,          // 트랜잭션 데이터
    pub sigs: Vec<Signature>,           // 서명 데이터
    pub padding_step: ExecStep,         // 패딩 실행 단계
    pub end_block_step: ExecStep,       // 블록 종료 단계
    pub rws: RwMap,                     // RW 연산 맵
    pub bytecodes: BTreeMap<Word, Bytecode>,
    pub context: BlockContexts,         // 블록 컨텍스트
    pub copy_events: Vec<CopyEvent>,    // 복사 이벤트
    pub exp_events: Vec<ExpEvent>,      // EXP 이벤트
    pub sha3_inputs: Vec<Vec<u8>>,      // Keccak 입력
    pub mpt_updates: MptUpdates,        // MPT 업데이트
    pub circuits_params: CircuitsParams, // 회로 파라미터
}`;

export const blockAnnotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'TX/서명/실행 단계 데이터' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'RW 연산 + 바이트코드 + 컨텍스트' },
  { lines: [10, 14] as [number, number], color: 'amber' as const, note: '이벤트 + MPT + 회로 파라미터' },
];

export const EXEC_STEP_CODE = `// ExecStep — EVM 실행의 각 단계를 나타내는 Witness
pub struct ExecStep {
    pub call_index: usize,                    // 호출 인덱스
    pub rw_indices: Vec<(RwTableTag, usize)>, // RW 연산 인덱스
    pub execution_state: ExecutionState,      // 실행 상태
    pub rw_counter: usize,                    // RW 카운터
    pub program_counter: u64,                 // 프로그램 카운터
    pub stack_pointer: usize,                 // 스택 포인터
    pub gas_left: u64,                        // 남은 가스
    pub gas_cost: u64,                        // 가스 비용
    pub memory_size: u64,                     // 메모리 크기
    pub opcode: Option<OpcodeId>,             // Opcode
}`;

export const execStepAnnotations = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: 'call_index + rw_indices' },
  { lines: [5, 8] as [number, number], color: 'emerald' as const, note: '실행 상태: state/rw/pc/sp' },
  { lines: [9, 12] as [number, number], color: 'amber' as const, note: '가스/메모리/오퍼코드' },
];
