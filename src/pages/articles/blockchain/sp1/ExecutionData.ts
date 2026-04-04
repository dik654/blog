export const EXECUTOR_CODE = `// crates/core/executor/src/executor.rs
pub struct Executor<'a> {
    pub program: Arc<Program>,           // RISC-V ELF
    pub state: ExecutionState,           // 레지스터 + 메모리 + PC
    pub report: ExecutionReport,         // 실행 통계
    pub executor_mode: ExecutorMode,     // 실행 모드
    pub memory_accesses: MemoryAccessRecord, // 메모리 접근 기록
    pub syscall_map: HashMap<SyscallCode, Arc<dyn Syscall>>, // 시스템 콜
    pub record: Box<ExecutionRecord>,    // 증명용 실행 추적
}`;

export const EXEC_MODES = [
  { name: 'Simple', desc: '추적 없는 빠른 실행. 오버헤드 최소. 결과 확인용.' },
  { name: 'Checkpoint', desc: '메모리 체크포인트 포함. 중간 상태 저장 가능.' },
  { name: 'Trace', desc: '완전한 이벤트 추적. 증명 생성용. 가장 느림.' },
  { name: 'ShapeCollection', desc: '회로 최적화용 크기 정보 수집. setup() 전 사용.' },
];

export const INSTRUCTION_CODE = `// RISC-V RV32IM 명령어 실행
pub struct Instruction {
    pub opcode: Opcode,  // 연산 코드
    pub op_a: u8,        // 목적지 레지스터
    pub op_b: u32,       // 소스 1 (레지스터 또는 즉시값)
    pub op_c: u32,       // 소스 2 (레지스터 또는 즉시값)
    pub imm_b: bool,     // op_b가 즉시값이면 true
    pub imm_c: bool,     // op_c가 즉시값이면 true
}

fn execute_instruction(&mut self, instruction: &Instruction) -> Result<()> {
    // 1. 피연산자 읽기
    let op_b_val = if instruction.imm_b {
        instruction.op_b
    } else {
        self.register(Register::from(instruction.op_b as u8))
    };
    let op_c_val = if instruction.imm_c {
        instruction.op_c
    } else {
        self.register(Register::from(instruction.op_c as u8))
    };

    // 2. 연산 수행
    let result = match instruction.opcode {
        Opcode::ADD  => op_b_val.wrapping_add(op_c_val),
        Opcode::SUB  => op_b_val.wrapping_sub(op_c_val),
        // ... 40개 이상의 명령어
    };

    // 3. 결과 저장 + PC 증가
    self.set_register(Register::from(instruction.op_a), result);
    self.state.pc += DEFAULT_PC_INC;
    Ok(())
}`;

export const SYSCALL_CODE = `// 지원하는 프리컴파일 (SyscallCode)
HALT             = 0x00_00_00_00  // 프로그램 종료
WRITE            = 0x00_00_00_02  // 출력 (stdout)
COMMIT           = 0x00_00_00_10  // 공개 출력 커밋
SHA_EXTEND       = 0x00_00_30_26  // SHA256 메시지 스케줄 확장
SHA_COMPRESS     = 0x00_00_01_05  // SHA256 압축 연산
SECP256K1_ADD    = 0x00_01_01_14  // 타원곡선 점 덧셈
SECP256K1_DOUBLE = 0x00_01_01_15  // 타원곡선 점 2배
ED_ADD           = 0x00_01_01_28  // Ed25519 점 덧셈
ED_DECOMPRESS    = 0x00_01_01_29  // Ed25519 점 압축 해제

// Guest 코드에서는 그냥 일반 함수처럼 사용
use sha2::{Sha256, Digest};
let hash = Sha256::digest(data); // SP1이 자동으로 프리컴파일로 처리`;
