export const BENCH_STEPS = [
  { label: '벤치마크 개요', body: 'Hello World 예제(4행x2컬럼)부터 대규모(1M행x10컬럼)까지 성능을 측정합니다.' },
  { label: '소규모 데이터', body: '4행x2컬럼: 파싱 ~1ms, Commitment ~10ms, 증명 ~50ms, 검증 ~5ms (총 ~66ms).' },
  { label: 'GPU 가속', body: '1M행x10컬럼 GPU: Commitment ~100ms, 증명 ~500ms, 검증 ~10ms.' },
  { label: 'CPU vs GPU', body: 'CPU 전용 시 Commitment ~2s, 증명 ~5s. GPU 가속으로 10-20배 성능 향상.' },
];

export const COMPLEXITY_TABLE = [
  { op: 'SQL 파싱', time: 'O(n)', space: '-', desc: '쿼리 길이에 선형 비례' },
  { op: 'Commitment 생성', time: 'O(m log m)', space: 'O(1)', desc: '데이터 크기에 준선형' },
  { op: 'Sumcheck 증명', time: 'O(d log m)', space: 'O(log m)', desc: '다항식 차수와 데이터 크기' },
  { op: '증명 검증', time: 'O(log m)', space: 'O(1)', desc: '데이터 크기에 로그 비례' },
];

export const PERF_BARS = [
  { label: '파싱', cpuMs: 1, gpuMs: 1 },
  { label: 'Commit', cpuMs: 2000, gpuMs: 100 },
  { label: '증명', cpuMs: 5000, gpuMs: 500 },
  { label: '검증', cpuMs: 10, gpuMs: 10 },
];
