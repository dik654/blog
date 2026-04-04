import type { CodeRef } from './codeRefsTypes';

export const execCodeRefs: Record<string, CodeRef> = {
  'vm-advance': {
    path: 'sp1/crates/core/executor/src/vm.rs',
    lang: 'rust',
    highlight: [1, 22],
    desc: 'advance()는 VM의 한 사이클을 진행합니다.\nPC와 clk를 갱신하고, 프로그램 종료(HALT_PC) 또는\ntrace 세그먼트 경계를 확인합니다.',
    code: `/// Increment the state of the VM by one cycle.
/// Calling this method will update the pc and the clk.
pub fn advance(&mut self) -> CycleResult {
    self.clk = self.next_clk;
    self.pc = self.next_pc;

    // Reset the next_clk and next_pc to the next cycle.
    self.next_clk = self.clk.wrapping_add(CLK_INC);
    self.next_pc = self.pc.wrapping_add(PC_INC);
    self.global_clk = self.global_clk.wrapping_add(1);

    // Check if the program has halted.
    if self.pc == HALT_PC {
        return CycleResult::Done(true);
    }

    // Check if the shard limit has been reached.
    if self.is_trace_end() {
        return CycleResult::TraceEnd;
    }

    CycleResult::Done(false)
}`,
    annotations: [
      { lines: [3, 5], color: 'sky', note: '이전 사이클에서 설정한 next값을 현재 상태로 적용' },
      { lines: [7, 10], color: 'emerald', note: '다음 사이클의 기본값 설정. 분기 명령어가 next_pc를 덮어씀' },
      { lines: [12, 15], color: 'amber', note: 'HALT_PC에 도달하면 프로그램 정상 종료' },
      { lines: [17, 20], color: 'violet', note: '세그먼트 경계 도달 시 TraceEnd 반환. 다음 shard로 분할' },
    ],
  },

  'vm-alu': {
    path: 'sp1/crates/core/executor/src/vm.rs',
    lang: 'rust',
    highlight: [1, 30],
    desc: 'ALU 연산은 ADD, SUB, XOR, MUL 등 산술/논리 연산을 처리합니다.\nimm_c/imm_b 플래그로 레지스터 vs 즉시값을 구분하여\nRISC-V의 R-type/I-type을 통합 처리합니다.',
    code: `/// Execute an ALU instruction.
pub fn execute_alu(&mut self, instruction: &Instruction) -> AluResult {
    let (rd, b, c) = if !instruction.imm_c {
        // R-type: both operands from registers
        let (rd, rs1, rs2) = instruction.r_type();
        let c = self.rr(rs2, MemoryAccessPosition::C);
        let b = self.rr(rs1, MemoryAccessPosition::B);
        (rd, b.value, c.value)
    } else if !instruction.imm_b && instruction.imm_c {
        // I-type: rs1 from register, imm from instruction
        let (rd, rs1, imm) = instruction.i_type();
        let b = self.rr(rs1, MemoryAccessPosition::B);
        (rd, b.value, imm)
    } else { /* both immediate */ };

    let a = match instruction.opcode {
        Opcode::ADD | Opcode::ADDI => (Wrapping(b) + Wrapping(c)).0,
        Opcode::SUB  => (Wrapping(b) - Wrapping(c)).0,
        Opcode::XOR  => b ^ c,
        Opcode::OR   => b | c,
        Opcode::AND  => b & c,
        Opcode::SLL  => b << (c & 0x3f),
        Opcode::SRL  => b >> (c & 0x3f),
        Opcode::SRA  => ((b as i64) >> (c & 0x3f)) as u64,
        Opcode::MUL  => (Wrapping(b as i64) * Wrapping(c as i64)).0 as u64,
        Opcode::MULH => (((b as i64) as i128) * ((c as i64) as i128) >> 64) as u64,
        Opcode::DIV  => if c == 0 { u64::MAX } else { (b as i64).wrapping_div(c as i64) as u64 },
        _ => unreachable!(),
    };
    let rw_record = self.rw(rd, a); // 결과를 목적지 레지스터에 기록
}`,
    annotations: [
      { lines: [3, 8], color: 'sky', note: 'R-type: 두 레지스터에서 피연산자 읽기. rr()이 타임스탬프 기록' },
      { lines: [9, 13], color: 'emerald', note: 'I-type: 레지스터 + 즉시값. SP1은 ADD/ADDI를 동일 opcode로 통합' },
      { lines: [16, 29], color: 'amber', note: 'opcode별 연산 디스패치. Wrapping으로 오버플로우 안전 처리' },
      { lines: [30, 30], color: 'violet', note: '결과를 rd 레지스터에 기록하며 MemoryWriteRecord 생성' },
    ],
  },
};
