export const VDF_PROPERTIES = [
  { name: '순차성', desc: '병렬화로 가속 불가. 고성능 GPU/ASIC이 유리하지 않음.' },
  { name: '검증 가능성', desc: '체크포인트로 빠른 검증. 전체 재계산 없이 정확성 확인.' },
  { name: '유일성', desc: '주어진 입력에 대해 항상 동일한 출력. 결정론적.' },
];

export const VDF_SHA_CODE = `// irys-vdf/src/lib.rs
pub fn vdf_sha(
    hasher: &mut Sha256,
    salt: &mut U256,
    seed: &mut H256,
    num_checkpoints: usize,
    num_iterations_per_checkpoint: u64,
    checkpoints: &mut [H256],
) {
    let mut local_salt: [u8; 32] = [0; 32];

    for checkpoint_idx in 0..num_checkpoints {
        // 솔트를 리틀엔디언으로 직렬화
        salt.to_little_endian(&mut local_salt);

        // 각 체크포인트마다 지정된 횟수만큼 순차 해시
        for _ in 0..num_iterations_per_checkpoint {
            hasher.update(local_salt);
            hasher.update(seed.as_bytes());
            *seed = H256(hasher.finalize_reset().into());
            // → 이 루프는 병렬화 불가 (이전 결과가 다음 입력)
        }

        // 체크포인트 저장 (검증자가 샘플링 가능)
        checkpoints[checkpoint_idx] = *seed;

        // 다음 체크포인트를 위해 솔트 증가
        *salt = *salt + 1;
    }
}`;

export const VDF_CONFIG_CODE = `pub struct VdfConfig {
    pub num_checkpoints_in_vdf_step: usize,   // 스텝당 체크포인트 수 (기본값: 25)
    pub sha_1s_difficulty: u64,               // 1초당 목표 SHA256 연산 횟수
    pub reset_frequency: usize,               // VDF 리셋 주기 (글로벌 스텝 단위)
    pub parallel_verification_thread_limit: usize, // 병렬 검증 스레드 수 제한
}

// 체크포인트당 반복 횟수 계산
// num_iterations_per_checkpoint = sha_1s_difficulty / num_checkpoints_in_vdf_step
//
// 예시: sha_1s_difficulty = 1,000,000, num_checkpoints_in_vdf_step = 25
// → 체크포인트당 40,000번 SHA256 × 25 = 1,000,000번 ≈ 1초`;

export const BLOCK_FLOW_CODE = `// VDF 기반 블록 생성
loop {
    // 1. 이전 블록 해시를 VDF 시드로 사용
    let seed = previous_block.hash();

    // 2. VDF 계산 (순차적, 병렬화 불가)
    let (output, checkpoints) = vdf_sha(seed, difficulty, num_checkpoints);

    // 3. 체크포인트를 다음 블록에 포함
    let block = Block {
        vdf_output: output,
        vdf_checkpoints: checkpoints,
        transactions: mempool.take(),
        ..
    };

    // 4. 네트워크에 전파
    gossip.broadcast(block);

    // 검증자: 체크포인트 샘플링으로 VDF 정당성 확인
    // (전체 재계산 없이 체크포인트 간만 검증)
}`;
