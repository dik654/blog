export const C = { ec: '#6366f1', f3: '#10b981', err: '#ef4444', vote: '#f59e0b', cert: '#8b5cf6' };

export const STEPS = [
  {
    label: 'EC의 확정성 문제',
    body: 'Expected Consensus는 확률적 합의',
  },
  {
    label: '왜 7.5시간인가?',
    body: 'EC는 heaviest chain rule',
  },
  {
    label: '해결: F3 레이어 추가',
    body: '기존 EC를 변경하지 않고 — 별도의 확정성 레이어(F3)를 위에 올림',
  },
  {
    label: 'GossiPBFT: 투표 기반 확정',
    body: '스토리지 프로바이더가 tipset에 투표',
  },
  {
    label: '확정 인증서 발행',
    body: '모든 투표 단계를 통과하면 — FinalityCertificate 발행',
  },
];
