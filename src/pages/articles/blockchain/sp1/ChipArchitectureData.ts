export const RISCV_AIR_CODE = `// RiscvAir: 모든 AIR 칩의 열거형
pub enum RiscvAir<F: PrimeField32> {
    // CPU 중앙 조정자
    Program(ProgramChip),
    Cpu(CpuChip),

    // ALU 칩
    Add(AddSubChip),
    Bitwise(BitwiseChip),
    Mul(MulChip),
    DivRem(DivRemChip),
    ShiftRight(ShiftRightChip),
    ShiftLeft(ShiftLeft),
    Lt(LtChip),

    // 메모리 칩
    MemoryInstructions(MemoryInstructionsChip<F>),
    MemoryGlobal(MemoryGlobalChip),

    // 프리컴파일 칩
    SyscallCore(SyscallChip),
    ShaExtend(ShaExtendChip),
    ShaCompress(ShaCompressChip),
    Keccak256(KeccakPermuteChip),
    Ed25519Add(EdAddAssignChip),
    Secp256k1Add(WeierstrassAddAssignChip),
}`;

export const AIR_BUILDER_CODE = `// SP1CoreAirBuilder: AIR 제약 빌더 확장
pub trait SP1CoreAirBuilder: AirBuilder {
    // 메모리 접근 제약
    fn memory_read(&mut self, addr: Var, value: Var, ts: Var);
    fn memory_write(&mut self, addr: Var, value: Var, ts: Var);

    // 레지스터 접근 제약
    fn register_read(&mut self, reg: Var, value: Var);
    fn register_write(&mut self, reg: Var, value: Var);

    // 프로그램 카운터 제약
    fn pc_transition(&mut self, current: Var, next: Var);
}`;

export const CPU_ROLE = [
  { role: '클럭 관리', desc: '글로벌 클럭을 증가시키고 shard 번호를 추적합니다.' },
  { role: 'PC 관리', desc: '프로그램 카운터의 전이(+4 또는 분기)를 제약합니다.' },
  { role: '명령어 디스패치', desc: 'opcode를 해석해 해당 ALU/메모리/시스콜 칩에 위임합니다.' },
  { role: '레지스터 파일', desc: 'x0–x31 레지스터의 읽기/쓰기를 추적합니다.' },
  { role: '칩 간 통신', desc: 'send_interaction/receive_interaction으로 칩 간 데이터 교환.' },
];

export const riscvAirAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'CPU 코어 칩' },
  { lines: [7, 14] as [number, number], color: 'emerald' as const, note: 'ALU 연산 칩 (7종)' },
  { lines: [16, 18] as [number, number], color: 'amber' as const, note: '메모리 칩' },
  { lines: [20, 26] as [number, number], color: 'violet' as const, note: '프리컴파일 칩 (6종+)' },
];

export const airBuilderAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '메모리 읽기/쓰기 제약' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '레지스터 접근 제약' },
  { lines: [11, 12] as [number, number], color: 'amber' as const, note: 'PC 전이 제약' },
];
