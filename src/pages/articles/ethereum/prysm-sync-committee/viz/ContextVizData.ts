export const C = { sync: '#8b5cf6', ok: '#10b981', err: '#ef4444', light: '#f59e0b', sign: '#0ea5e9' };

export const STEPS = [
  {
    label: '라이트 클라이언트가 체인을 따라가야 함',
    body: '모바일 지갑이나 브릿지가 풀 노드 없이 체인 상태를 검증하려면 경량 증명이 필요합니다.',
  },
  {
    label: '문제: 전체 state transition은 무겁다',
    body: '모든 validator vote와 state를 다운로드·실행하면 light client의 목적을 잃습니다.',
  },
  {
    label: '문제: 소수 대표의 신뢰성',
    body: '소수 서명자가 공모하면 거짓 증명이 가능하여 정기적 교체와 충분한 수가 필요합니다.',
  },
  {
    label: '해결: period별 sync committee',
    body: 'Mainnet preset은 512 positions과 256 epochs를 쓰며, light client는 trusted state에 commitment된 committee를 추적합니다.',
  },
  {
    label: '해결: 보상/패널티로 참여 유도',
    body: '참여 보상과 불참 패널티로 높은 참여율을 유지하여 경량 증명의 신뢰성을 확보합니다.',
  },
];
