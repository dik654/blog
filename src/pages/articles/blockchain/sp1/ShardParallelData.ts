export const RECORD_CODE = `// ExecutionRecord: 샤드 1개의 실행 기록
pub struct ExecutionRecord {
    pub shard: u32,                          // 샤드 번호
    pub cpu_events: Vec<CpuEvent>,           // CPU 이벤트
    pub add_events: Vec<AluEvent>,           // 덧셈 이벤트
    pub mul_events: Vec<AluEvent>,           // 곱셈 이벤트
    pub memory_initialize_events: Vec<MemoryInitializeFinalizeEvent>,
    pub memory_finalize_events: Vec<MemoryInitializeFinalizeEvent>,
    pub syscall_events: Vec<SyscallEvent>,   // 시스콜 이벤트
    pub byte_lookups: TreeMap<ByteLookupEvent, usize>, // 바이트 룩업
}`;

export const SHARD_CODE = `// 샤드 분할: SHARD_SIZE 사이클마다 분할
const SHARD_SIZE: u64 = 1 << 22;  // 약 400만 사이클

fn bump_shard(&mut self) {
    // 1. 현재 ExecutionRecord 완료
    let completed = std::mem::take(&mut self.record);

    // 2. 메모리 체크포인트 저장 (Checkpoint 모드)
    if self.executor_mode == ExecutorMode::Checkpoint {
        self.checkpoints.push(self.state.memory.checkpoint());
    }

    // 3. 새 ExecutionRecord 시작
    self.record = Box::new(ExecutionRecord {
        shard: self.state.current_shard + 1,
        ..Default::default()
    });

    // 4. 샤드 번호 증가
    self.state.current_shard += 1;
}`;

export const PARALLEL_CODE = `// rayon 기반 병렬 증명 생성
let proofs: Vec<ShardProof> = records
    .par_iter()                    // rayon 병렬 이터레이터
    .map(|record| {
        // 각 워커 스레드가 독립적으로 증명
        let trace = machine.generate_trace(record);   // AIR 트레이스
        let commit = pcs.commit(trace);               // Merkle 커밋
        let proof = machine.prove(pk, commit, record); // FRI 증명
        proof
    })
    .collect();

// 일반적인 병렬 처리 수준:
// - 8코어 CPU: 8개 샤드 동시 증명
// - 64코어 서버: 수십 개 동시 처리
// - GPU (CUDA): 수백 개 NTT/MSM 병렬`;

export const recordAnnotations = [
  { lines: [2, 10] as [number, number], color: 'sky' as const, note: 'ExecutionRecord — 칩별 이벤트 수집' },
];

export const shardAnnotations = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: '~400만 사이클마다 분할' },
  { lines: [5, 6] as [number, number], color: 'emerald' as const, note: '현재 레코드 완료' },
  { lines: [8, 10] as [number, number], color: 'amber' as const, note: '메모리 체크포인트 저장' },
  { lines: [12, 16] as [number, number], color: 'violet' as const, note: '새 레코드 초기화' },
];

export const parallelAnnotations = [
  { lines: [2, 3] as [number, number], color: 'sky' as const, note: 'rayon par_iter — 자동 스레드 분배' },
  { lines: [5, 9] as [number, number], color: 'emerald' as const, note: '워커: trace → commit → prove' },
  { lines: [13, 16] as [number, number], color: 'amber' as const, note: '하드웨어별 병렬 수준' },
];
