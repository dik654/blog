export const C = { cpu: '#71717a', gpu: '#6366f1', mem: '#f59e0b', err: '#ef4444', ok: '#10b981' };

export const STEPS = [
  {
    label: 'SM 구조: CUDA 코어 128개 + 공유 메모리 64KB',
    body: 'RTX 4090: 128 SM × 128 FP32 코어 = 16384 코어, 각 SM에 64KB 공유 메모리 + 256KB L1/레지스터',
  },
  {
    label: 'ZK 연산의 GPU 병렬 매핑',
    body: 'MSM: 독립 점 곱셈 → SM별 버킷 분산, NTT: 나비 연산 → 공유 메모리 스테이지, 서명: 완전 병렬',
  },
  {
    label: '메모리 계층: 레지스터(1) → 공유(~5) → L2(~30) → GDDR(~400 cycle)',
    body: '레지스터 파일: SM당 256KB / 공유 메모리: 64KB / L2: 72MB / GDDR6X: 24GB, 1008 GB/s',
  },
  {
    label: '워프 스케줄링: 32 스레드 SIMT + 지연 은닉',
    body: '메모리 대기 워프 → 실행 가능 워프로 0-cycle 전환, SM당 최대 64 워프 → 2048 스레드 동시 상주',
  },
];
