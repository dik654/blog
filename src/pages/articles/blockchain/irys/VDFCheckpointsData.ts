export const CHECKPOINT_CODE = `// VDF 체크포인트 검증 (irys-vdf/src/verify.rs)
pub fn verify_vdf_checkpoints(
    seed: H256,
    checkpoints: &[H256],
    num_iterations_per_checkpoint: u64,
) -> bool {
    let mut current = seed;
    let mut salt = U256::zero();

    for checkpoint in checkpoints {
        // 각 체크포인트까지 순차 해시 재계산
        for _ in 0..num_iterations_per_checkpoint {
            current = sha256(salt, current);
        }
        if current != *checkpoint { return false; }
        salt += 1;
    }
    true
}`;

export const CHECKPOINT_ANNOTATIONS = [
  { lines: [10, 13] as [number, number], color: 'sky' as const, note: '체크포인트 간 순차 해시 재계산' },
  { lines: [14, 14] as [number, number], color: 'emerald' as const, note: '체크포인트 일치 확인' },
];

export const PARALLEL_VERIFY_CODE = `// 병렬 체크포인트 검증 (검증자 최적화)
pub fn verify_checkpoints_parallel(
    checkpoints: &[H256],
    iterations_per_cp: u64,
    thread_limit: usize,
) -> bool {
    // 전체 체크포인트를 thread_limit개 그룹으로 분할
    let chunk_size = checkpoints.len() / thread_limit;

    checkpoints.par_chunks(chunk_size)
        .enumerate()
        .all(|(group_idx, group)| {
            // 각 그룹 시작점에서 독립적으로 검증 가능
            let start_salt = group_idx * chunk_size;
            verify_group(group, start_salt, iterations_per_cp)
        })
}`;

export const PARALLEL_ANNOTATIONS = [
  { lines: [8, 8] as [number, number], color: 'sky' as const, note: '체크포인트 그룹 분할' },
  { lines: [10, 15] as [number, number], color: 'emerald' as const, note: 'Rayon 병렬 검증' },
];

export const RESET_CODE = `// VDF 리셋 메커니즘 (reset_frequency 주기)
// 글로벌 스텝이 reset_frequency 도달 시 VDF 시드를 리셋
if global_step % config.reset_frequency == 0 {
    // 리셋: 현재 블록 해시를 새 시드로 사용
    vdf_seed = current_block.hash();
    vdf_salt = U256::zero();
    info!("VDF reset at step {}", global_step);
}`;

export const RESET_ANNOTATIONS = [
  { lines: [3, 7] as [number, number], color: 'amber' as const, note: 'VDF 시드 리셋 로직' },
];
