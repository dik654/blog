import type { CodeRef } from './codeRefsTypes';

export const vmCodeRefs: Record<string, CodeRef> = {
  'vm-struct': {
    path: 'sp1/crates/core/executor/src/vm.rs',
    lang: 'rust',
    highlight: [1, 28],
    desc: 'CoreVM은 SP1의 핵심 RISC-V 가상 머신입니다.\n32개 레지스터, 프로그램 카운터(PC), 클럭(clk)을 관리하며\nMinimalTrace를 통해 메모리 접근을 오라클링합니다.',
    code: `/// A RISC-V VM that uses a MinimalTrace to oracle memory access.
pub struct CoreVM<'a> {
    registers: [MemoryRecord; 32],
    /// The current clock of the VM.
    clk: u64,
    /// The global clock of the VM.
    global_clk: u64,
    /// The current program counter of the VM.
    pc: u64,
    /// The current exit code of the VM.
    exit_code: u32,
    /// The memory reads cursor.
    pub mem_reads: MemReads<'a>,
    /// The next program counter that will be set in advance().
    next_pc: u64,
    /// The next clock that will be set in advance().
    next_clk: u64,
    /// The program that is being executed.
    pub program: Arc<Program>,
    /// The syscalls that stay in the same shard.
    pub(crate) retained_syscall_codes: Vec<SyscallCode>,
    /// The options to configure the VM.
    pub opts: SP1CoreOpts,
    /// The end clk of the trace chunk.
    pub clk_end: u64,
    /// The public value digest.
    pub public_value_digest: [u32; PV_DIGEST_NUM_WORDS],
    /// The nonce associated with the proof.
    pub proof_nonce: [u32; PROOF_NONCE_NUM_WORDS],
}`,
    annotations: [
      { lines: [2, 3], color: 'sky', note: '32개 RISC-V 범용 레지스터 (x0-x31). 각 레지스터는 타임스탬프를 가짐' },
      { lines: [5, 10], color: 'emerald', note: 'VM 상태: clk(사이클 카운터), pc(명령어 포인터), exit_code' },
      { lines: [12, 13], color: 'amber', note: 'MinimalTrace에서 메모리 읽기를 순차적으로 가져오는 커서' },
      { lines: [19, 20], color: 'violet', note: 'RISC-V ELF를 파싱한 Program. Arc로 공유 참조' },
      { lines: [25, 26], color: 'rose', note: 'trace chunk 종료 클럭. 세그먼트 분할 기준점' },
    ],
  },
};
