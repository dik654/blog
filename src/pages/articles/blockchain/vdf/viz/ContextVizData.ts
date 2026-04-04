export const C = { vdf: '#6366f1', err: '#ef4444', ok: '#10b981', time: '#f59e0b', app: '#8b5cf6' };

export const STEPS = [
  {
    label: '탈중앙 시스템에서 "시간"을 증명해야 함',
    body: '블록 추첨, 챌린지 생성 등 — 편향 불가능한 랜덤성이 필요',
  },
  {
    label: '해시 체인의 한계',
    body: 'H(H(H(...)))를 T번 반복하면 순차적이긴 함',
  },
  {
    label: '해결: VDF = 순차 계산 + 빠른 검증',
    body: 'x^(2^T) mod N — T번 반복 제곱만이 유일한 경로',
  },
];
