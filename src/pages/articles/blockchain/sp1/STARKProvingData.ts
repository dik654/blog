export const PROVE_CORE_CODE = `// prove_core: 3-Phase 파이프라인
pub fn prove_core<P: MachineProver>(
    prover: &P,
    pk: &ProvingKey,
    program: Program,
    stdin: &SP1Stdin,
    opts: SP1ProverOpts,
) -> Result<SP1CoreProof> {
    // Phase 1: 체크포인트 생성 (ExecutorMode::Checkpoint)
    let checkpoints = runtime.execute_checkpoints()?;
    // → 샤드 경계마다 메모리 스냅샷 저장
    // → 각 체크포인트는 독립 재실행 가능

    // Phase 2: 레코드 생성 (ExecutorMode::Trace)
    let records: Vec<ExecutionRecord> = checkpoints
        .par_iter()
        .map(|cp| executor.resume_from(cp).collect_records())
        .collect();

    // Phase 3: 증명 생성 (병렬)
    let proofs: Vec<ShardProof> = records
        .par_iter()
        .map(|record| prover.prove_shard(pk, record))
        .collect();
    SP1CoreProof { proofs }
}`;

export const SYNC_CODE = `// Phase 간 동기화: TurnBasedSync + Channel
struct ProveCorePipeline {
    // 체크포인트 → 레코드 변환 채널
    checkpoint_tx: Sender<Checkpoint>,
    record_rx: Receiver<ExecutionRecord>,

    // 레코드 → 증명 변환 채널
    record_tx: Sender<ExecutionRecord>,
    proof_rx: Receiver<ShardProof>,
}

// 스트리밍 방식: 체크포인트가 완료되면 즉시 다음 Phase 시작
// → 메모리 사용 최소화 (전체 추적 동시 보관 불필요)
// → Phase 1이 끝나기 전에 Phase 2/3 시작 가능`;

export const proveCoreAnnotations = [
  { lines: [9, 12] as [number, number], color: 'sky' as const, note: 'Phase 1: 체크포인트 생성' },
  { lines: [14, 18] as [number, number], color: 'emerald' as const, note: 'Phase 2: 병렬 레코드 생성' },
  { lines: [20, 24] as [number, number], color: 'amber' as const, note: 'Phase 3: 병렬 증명 생성' },
];

export const syncAnnotations = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: '체크포인트 → 레코드 채널' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: '레코드 → 증명 채널' },
  { lines: [12, 14] as [number, number], color: 'amber' as const, note: '스트리밍 파이프라인 이점' },
];
