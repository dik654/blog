export const C = {
  api: '#6366f1', hard: '#10b981', user: '#f59e0b',
};

export const STEPS = [
  {
    label: '소스 1: Beacon API (기본값)',
    body: 'checkpoint_sync_url에 GET 요청.\n/eth/v1/beacon/light_client/bootstrap/{root}',
  },
  {
    label: '소스 2: 하드코딩 (fallback)',
    body: '네트워크별 체크포인트가 바이너리에 내장.\nmainnet/sepolia/holesky 각각 다른 값.',
  },
  {
    label: '소스 3: 사용자 지정',
    body: 'CLI 또는 config에서 직접 체크포인트 해시 전달.\n감사된 루트를 사용하면 가장 안전.',
  },
];
