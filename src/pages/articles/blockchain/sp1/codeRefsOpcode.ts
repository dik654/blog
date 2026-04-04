import type { CodeRef } from './codeRefsTypes';

export const opcodeCodeRefs: Record<string, CodeRef> = {
  'opcode-enum': {
    path: 'sp1/crates/core/executor/src/opcode.rs',
    lang: 'rust',
    highlight: [1, 42],
    desc: 'SP1은 RISC-V ISA의 opcode를 자체 인코딩으로 재정의합니다.\nADD/ADDI를 같은 opcode로 통합하고, imm_b/imm_c 플래그로\n레지스터 vs 즉시값을 구분하는 것이 핵심 차이점입니다.',
    code: `/// An opcode specifies the operation to be performed.
///
/// While the SP1 zkVM targets the RISC-V ISA, it uses a custom
/// instruction encoding. The main difference is that SP1 encodes
/// register and immediate operations as the same opcode.
/// For example, ADD and ADDI both become ADD inside SP1.
#[repr(u8)]
pub enum Opcode {
    /// rd <- rs1 + rs2, pc <- pc + 4
    ADD = 0,
    /// rd <- rs1 + imm, pc <- pc + 4
    ADDI = 1,
    /// rd <- rs1 - rs2, pc <- pc + 4
    SUB = 2,
    XOR = 3,  OR = 4,  AND = 5,
    SLL = 6,  SRL = 7, SRA = 8,
    SLT = 9,  SLTU = 10,
    // M-extension (곱셈/나눗셈)
    MUL = 11,  MULH = 12,  MULHU = 13, MULHSU = 14,
    DIV = 15,  DIVU = 16,  REM = 17,   REMU = 18,
    // Load/Store
    LB = 19, LH = 20, LW = 21, LBU = 22, LHU = 23,
    SB = 24, SH = 25, SW = 26,
    // Branch
    BEQ = 27, BNE = 28, BLT = 29, BGE = 30,
    BLTU = 31, BGEU = 32,
    // Jump
    JAL = 33, JALR = 34,
    // Upper immediate
    AUIPC = 35, LUI = 36,
    // System
    ECALL = 37,   // 시스템 콜 (프리컴파일 진입점)
    EBREAK = 38,
    // RISCV-64 확장
    ADDW = 39, SUBW = 40, SLLW = 41, SRLW = 42,
    SRAW = 43, LWU = 44,  LD = 45,   SD = 46,
    MULW = 47, DIVW = 48, DIVUW = 49,
    REMW = 50, REMUW = 51,
    UNIMP = 52,
}

/// Byte Opcode — 바이트 단위 연산 (조회 테이블 사용)
pub enum ByteOpcode {
    AND = 0, OR = 1, XOR = 2, U8Range = 3,
    LTU = 4, MSB = 5, Range = 6,
}`,
    annotations: [
      { lines: [1, 7], color: 'sky', note: 'SP1 고유 인코딩: R-type과 I-type을 하나의 opcode로 통합' },
      { lines: [10, 20], color: 'emerald', note: 'RV64IM 산술 연산. 각 opcode는 u8로 인코딩되어 AIR 칩에 매핑' },
      { lines: [22, 23], color: 'amber', note: 'Load/Store: 메모리 접근. LB(byte), LH(half), LW(word)' },
      { lines: [31, 32], color: 'violet', note: 'ECALL: 프리컴파일 진입점. SHA256, keccak 등 가속 연산 호출' },
      { lines: [34, 38], color: 'rose', note: 'RISC-V 64비트 확장. SP1은 RV32+RV64를 모두 지원' },
    ],
  },
};
