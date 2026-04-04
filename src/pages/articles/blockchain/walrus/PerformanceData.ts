export const COST_MODEL = [
  { metric: '저장 확장 비율', value: '~4.5x', desc: 'n=3f+1, 각 노드 1/n 저장 + RS 중복. 전통 복제(3x) 대비 경쟁력.' },
  { metric: '복구 임계값', value: 'n - f', desc: '전체 노드의 2/3만 있으면 데이터 복구 가능.' },
  { metric: '쓰기 인증 임계값', value: '2f + 1', desc: '2/3 이상 노드 확인으로 영구 저장 보장.' },
  { metric: 'RS 인코딩', value: 'reed_solomon_simd', desc: 'SIMD 최적화 RS. O(n log n) 인코딩/디코딩.' },
];

export const BENCH_CODE = `// 성능 특성 분석
//
// 인코딩 비용:
//   reed_solomon_simd 사용 → SIMD 병렬 GF(2^8) 연산
//   10MB 블롭, n=100 노드: ~50ms 인코딩
//
// 네트워크 비용:
//   각 노드에 슬라이버 2개 전송 (Primary + Secondary)
//   슬라이버 크기 = blob_size / (n - 2f) + overhead
//   총 전송량 ≈ 4.5 * blob_size (RS 확장 비율)
//
// 복구 비용:
//   f+1개 노드에서 슬라이버 수집
//   RS 디코딩: O(n log^2 n) (Berlekamp-Welch)
//   복구 심볼 생성: 자신의 슬라이버만으로 다른 노드 지원`;

export const BENCH_ANNOTATIONS = [
  { lines: [3, 5] as [number, number], color: 'sky' as const, note: 'SIMD RS: 10MB ~50ms' },
  { lines: [7, 10] as [number, number], color: 'emerald' as const, note: '네트워크 전송 비용' },
  { lines: [12, 15] as [number, number], color: 'amber' as const, note: 'RS 디코딩 복구 비용' },
];
