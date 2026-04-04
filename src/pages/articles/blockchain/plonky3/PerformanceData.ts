export const DFT_COMPARISON = [
  { name: 'Radix-2 DIT', time: 'O(N log N)', memory: 'O(N)', desc: '전통 Cooley-Tukey. 중간 크기에 적합.' },
  { name: 'Bowers FFT', time: 'O(N log N)', memory: 'O(N)', desc: '메모리 접근 패턴 최적화. LDE에 특히 효율적.' },
  { name: 'DIT Parallel', time: 'O(N log N / P)', memory: 'O(2N)', desc: '멀티코어 최적화. 대용량 배치 처리.' },
  { name: 'Circle FFT', time: 'O(N log N)', memory: 'O(N)', desc: 'Mersenne31 전용. 특수 기하 구조 활용.' },
];

export const BENCH_CODE = `// Plonky3 성능 특성 (BabyBear 기준)
//
// 필드 크기: 31비트 → 32비트 레지스터 내 연산
// Montgomery 곱셈: ~3 클럭 사이클/곱셈 (x86-64)
//
// FRI 파라미터 (SP1 기본값):
//   log_blowup = 1 (2배 확장)
//   num_queries = 100 (FRI 쿼리 수)
//   proof_of_work_bits = 16 (PoW 난이도)
//
// 트레이스 커밋 비용 분석:
//   DFT: ~40% (Radix-2 Bowers)
//   Merkle 해시: ~35% (Poseidon2)
//   메모리 할당: ~15%
//   기타: ~10%`;

export const BENCH_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '31비트 필드 → 네이티브 연산' },
  { lines: [6, 9] as [number, number], color: 'emerald' as const, note: 'FRI 보안 파라미터' },
  { lines: [11, 15] as [number, number], color: 'amber' as const, note: '커밋 비용 분포' },
];

export const OPTIMIZATION_CODE = `// 핵심 최적화 기법들
//
// 1. 배치 처리 (RowMajorMatrix)
//    여러 다항식을 하나의 행렬로 묶어 DFT 동시 처리
//
// 2. SIMD 병렬 해싱
//    Poseidon2 해시를 SIMD로 여러 행 동시 처리
//    par_chunks_exact_mut(width)로 rayon 병렬화
//
// 3. 메모리 최적화
//    bit_reverse_rows()로 FRI 접근 패턴에 맞춰 재배열
//    연속 메모리 접근 → 캐시 히트율 극대화
//
// 4. maybe-rayon 조건부 병렬화
//    단일 스레드 환경에서도 동일 API로 순차 실행`;

export const OPTIMIZATION_ANNOTATIONS = [
  { lines: [3, 4] as [number, number], color: 'sky' as const, note: '행렬 단위 배치 DFT' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: 'SIMD + rayon 병렬 해싱' },
  { lines: [10, 12] as [number, number], color: 'amber' as const, note: '캐시 친화적 메모리 접근' },
];
