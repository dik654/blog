export const EXECUTOR_STRUCT_CODE = `pub struct Executor<'a> {
    pub program: Arc<Program>,             // ELF → 명령어 배열
    pub state: ExecutionState,             // PC, 레지스터(x0-x31), 메모리
    pub report: ExecutionReport,           // 명령어 카운트, 사이클, 이벤트 통계
    pub executor_mode: ExecutorMode,       // Simple | Checkpoint | Trace | ShapeCollection
    pub memory_accesses: MemoryAccessRecord,// 현재 사이클 메모리 접근
    pub syscall_map: HashMap<SyscallCode, Arc<dyn Syscall>>,
    pub record: Box<ExecutionRecord>,      // 증명용 이벤트 로그
    pub max_cycles: Option<u64>,           // 최대 실행 사이클 제한
    pub unconstrained: bool,               // 제약 없는 실행 모드
}`;

export const EXEC_MODES_DETAIL = [
  { name: 'Simple', color: '#10b981',
    fields: '추적 기록 안 함, 메모리 접근 기록 안 함',
    useCase: 'client.execute() — 빠른 결과 확인, 디버깅' },
  { name: 'Checkpoint', color: '#6366f1',
    fields: '메모리 체크포인트 저장, 샤드 경계에서 상태 스냅샷',
    useCase: 'prove_core Phase1 — 샤드 분할 지점 결정' },
  { name: 'Trace', color: '#f59e0b',
    fields: '모든 이벤트(CPU, 메모리, ALU, 시스콜) 기록',
    useCase: 'prove_core Phase2 — 증명 생성용 전체 추적' },
  { name: 'ShapeCollection', color: '#8b5cf6',
    fields: '칩별 행 수만 수집, 실제 데이터 기록 안 함',
    useCase: 'setup() — 회로 크기 결정, 사전 할당 최적화' },
];

export const CYCLE_CODE = `fn execute_cycle(&mut self) -> Result<bool> {
    // 1. 명령어 페치: PC → instruction
    let instruction = self.program.fetch(self.state.pc);

    // 2. 명령어 실행 (ALU, 메모리, 분기, 시스콜)
    self.execute_instruction(&instruction)?;

    // 3. 클럭 증가 + 샤드 체크
    self.state.global_clk += 1;
    if self.state.global_clk % SHARD_SIZE == 0 {
        self.bump_shard();  // 샤드 경계 → 새 ExecutionRecord
    }

    // 4. 종료 조건 확인
    Ok(self.state.pc == 0 || self.halted)
}`;

export const executorStructAnnotations = [
  { lines: [1, 10] as [number, number], color: 'sky' as const, note: 'Executor — 핵심 필드 10개' },
];

export const cycleAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: '1단계: 명령어 페치 (PC 주소)' },
  { lines: [5, 6] as [number, number], color: 'emerald' as const, note: '2단계: 명령어 실행' },
  { lines: [8, 11] as [number, number], color: 'amber' as const, note: '3단계: 클럭 증가 + 샤드 분할' },
  { lines: [13, 14] as [number, number], color: 'violet' as const, note: '4단계: 종료 조건 확인' },
];
