export const C = { pdp: '#0ea5e9', porep: '#6366f1', sha: '#f59e0b', chain: '#10b981', hot: '#ef4444' };

export const STEPS = [
  {
    label: 'PDP vs PoRep: 왜 다른 증명이 필요한가',
    body: 'PoRep: 데이터를 봉인(seal)해야 함 → 원본 즉시 읽기 불가',
  },
  {
    label: 'SHA2 챌린지: 160바이트 읽기',
    body: '랜덤 오프셋에서 160바이트를 읽고 SHA256 해시',
  },
  {
    label: '온체인 검증 & 스케줄링',
    body: 'PDP Actor가 DRAND 비콘으로 챌린지 시점 결정',
  },
];
