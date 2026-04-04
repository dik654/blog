export const SYSCALL_TRAIT_CODE = `// Syscall trait — 프리컴파일 인터페이스
pub trait Syscall: Send + Sync {
    /// 시스콜 실행. 레지스터 a0(arg1), a1(arg2) 전달
    fn execute(
        &self,
        ctx: &mut SyscallContext,
        arg1: u32,
        arg2: u32,
    ) -> Option<u32>;  // 반환값 → a0 레지스터

    /// 추가 사이클 수 (기본 1)
    fn num_extra_cycles(&self) -> u32 { 0 }
}`;

export const ECALL_CODE = `fn handle_ecall(&mut self) -> Result<()> {
    // 1. t0 레지스터에서 syscall_code 추출
    let code = self.register(Register::T0);
    let syscall = SyscallCode::try_from(code)?;

    // 2. 인자 읽기: a0, a1
    let arg1 = self.register(Register::A0);
    let arg2 = self.register(Register::A1);

    // 3. syscall_map에서 구현체 조회
    let handler = self.syscall_map.get(&syscall)
        .ok_or(ExecutionError::UnsupportedSyscall(code))?;

    // 4. 실행 + 결과 저장
    let ctx = SyscallContext::new(self);
    let result = handler.execute(&mut ctx, arg1, arg2);
    if let Some(val) = result {
        self.set_register(Register::A0, val);
    }

    // 5. 이벤트 기록
    self.record.syscall_events.push(SyscallEvent {
        shard: self.state.current_shard,
        clk: self.state.clk,
        syscall_code: syscall, arg1, arg2,
    });
    Ok(())
}`;

export const SYSCALL_CATEGORIES = [
  { category: '시스템', items: ['HALT (0x00)', 'WRITE (0x02)'], color: '#6b7280' },
  { category: '입출력', items: ['COMMIT (0x10)', 'HINT_LEN (0x11)', 'HINT_READ (0x12)'], color: '#6366f1' },
  { category: 'SHA2', items: ['SHA_EXTEND (0x3026)', 'SHA_COMPRESS (0x0105)'], color: '#10b981' },
  { category: 'Keccak', items: ['KECCAK_PERMUTE (0x0109)'], color: '#f59e0b' },
  { category: '타원곡선', items: ['SECP256K1_ADD', 'SECP256K1_DOUBLE', 'ED_ADD', 'ED_DECOMPRESS'], color: '#8b5cf6' },
  { category: '빅넘', items: ['UINT256_MUL (0x0114)'], color: '#ec4899' },
];

export const syscallTraitAnnotations = [
  { lines: [2, 10] as [number, number], color: 'sky' as const, note: 'execute() — 핵심 메서드' },
  { lines: [12, 13] as [number, number], color: 'emerald' as const, note: '추가 사이클 (기본 0)' },
];

export const ecallAnnotations = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: 't0에서 syscall_code 추출' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: 'a0, a1에서 인자 읽기' },
  { lines: [10, 12] as [number, number], color: 'amber' as const, note: '핸들러 조회' },
  { lines: [14, 19] as [number, number], color: 'violet' as const, note: '실행 + 결과 a0에 저장' },
  { lines: [21, 27] as [number, number], color: 'rose' as const, note: '시스콜 이벤트 기록' },
];
