// succinctlabs/sp1 저장소 · crates/core/executor/src/program.rs (v6.4.0,
// commit f66b4bf, 2026년 8월 기준 이 글이 인용하는 SHA). 전체 247줄 중
// Program struct 정의만 발췌했습니다. new()의 나머지 필드 초기화와
// ELF-loading 관련 나머지 함수는 생략했습니다.
// 본문 대응: program-artifact section의 "Executor가 parse한 ELF의
// instructions/memory image" — A_P=H(d_src‖d_tool‖H(ELF)‖H(VK)‖d_schema‖v)
// 식에서 H(ELF) 대상이 되는 실제 parsed artifact.

/// The maximum number of instructions in a program.
pub const MAX_PROGRAM_SIZE: usize = 1 << 22;

/// A program that can be executed by the SP1 zkVM.
///
/// Contains a series of instructions along with the initial memory image. It also contains the
/// start address and base address of the program.
#[derive(Debug, Clone, Default, Serialize, Deserialize, deepsize2::DeepSizeOf)]
pub struct Program {
    // article의 "Executor가 parse한 ELF의 instructions" — ELF를 실행
    // 가능한 형태로 바꾼 명령어 목록
    /// The instructions of the program.
    pub instructions: Vec<Instruction>,
    /// The encoded instructions of the program. Only used if program is untrusted
    pub instructions_encoded: Option<Vec<u32>>,
    // article의 program artifact identity 중 "실행 시작점" — ELF header가
    // 정한 절대 시작 주소
    /// The start address of the program. It is absolute, meaning not relative to `pc_base`.
    pub pc_start_abs: u64,
    /// The base address of the program.
    pub pc_base: u64,
    /// The trap context address of the program.
    pub trap_context: Option<u64>,
    /// The initial page protection image, mapping page indices to protection flags.
    pub page_prot_image: HashMap<u64, u8>,
    // article의 "memory image" — ELF가 지정한 전역 상수 등 초기 메모리
    /// The initial memory image, useful for global constants
    pub memory_image: Arc<HashMap<u64, u64>>,
    /// The shape for the preprocessed tables.
    pub preprocessed_shape: Option<Shape<RiscvAirId>>,
    /// Flag indicating if untrusted programs are allowed.
    pub enable_untrusted_programs: bool,
    /// Function symbols for profiling & debugging. In the form of (name, start address, size)
    pub function_symbols: Vec<(String, u64, u64)>,
    /// The memory region where untrusted program could live in. It is also the
    /// memory region mprotect works on.
    pub untrusted_memory: Option<(u64, u64)>,
    /// The profiler stack from a dump-elf/bootloader session.
    pub dump_elf_stack: Vec<u64>,
}
