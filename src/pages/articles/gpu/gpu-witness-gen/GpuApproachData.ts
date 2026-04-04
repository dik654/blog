export const levelParallelCode = `// Level-Parallel Witness Solver (GPU)
// 1단계: 의존성 분석 → 레벨 배정 (CPU에서 전처리)
// 2단계: 레벨별 GPU 커널 실행
fn solve_witness_gpu(constraints: &[R1CSConstraint], public: &[Fr]) -> Vec<Fr> {
    let levels = assign_levels(constraints);  // 의존성 DAG → 레벨 배정
    let mut w_device = gpu_alloc(num_wires);
    gpu_copy_to_device(&public, &mut w_device);  // public input → GPU

    for level in &levels {
        // 같은 레벨의 모든 제약은 서로 독립 → GPU 스레드 1개 = 제약 1개
        let num_threads = level.constraints.len();
        launch_kernel!(solve_level_kernel,
            grid  = (num_threads + 255) / 256,
            block = 256,
            args  = (level.constraints_device, w_device, level.sparse_A, level.sparse_B, level.sparse_C)
        );
        gpu_sync();  // 다음 레벨은 현재 레벨 결과에 의존
    }
    gpu_copy_to_host(&w_device)
}`;

export const csrCode = `// GPU에서 희소 행렬을 CSR(Compressed Sparse Row)로 저장
// R1CS의 A, B, C 행렬은 99%+ 이상이 0이므로 밀집 저장은 낭비
struct SparseMatrixCSR {
    row_ptr: Vec<u32>,   // 행 i의 시작 인덱스: row_ptr[i]..row_ptr[i+1]
    col_idx: Vec<u32>,   // 비영 원소의 열 인덱스
    values:  Vec<Fr>,    // 비영 원소 값
};
// 예: 2^20 제약, 평균 3개 비영 원소/행
// 밀집: 2^20 * 2^20 * 32B = 32TB (불가능)
// CSR:  2^20 * 3 * (4B + 32B) = ~108MB (GPU VRAM에 적재 가능)
//
// Plonkish 구조는 더 유리하다:
// - 게이트 와이어가 고정 패턴 → 행렬이 아닌 배열 인덱싱으로 충분
// - R1CS 대비 메모리 사용량 3-5배 절감`;

export const comparisonData = [
  ['R1CS (Groth16)', '제약당 3개 희소 행/벡터 내적', 'CSR 행렬', '레벨 병렬화'],
  ['Plonkish (Halo2)', '고정 너비 게이트 (fan-in 2-3)', '배열 인덱싱', '행 단위 병렬'],
  ['AIR (STARK)', '전이 제약: 행 t와 t+1 관계', '밀집 상태 행렬', '행 단위 SIMD'],
];
