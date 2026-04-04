export const C = { sq: '#6366f1', pf: '#10b981', vf: '#f59e0b', err: '#ef4444' };

export const STEPS = [
  {
    label: '반복 제곱: x → x^(2^T) mod N',
    body: 'RSA 그룹 Z*_N (N = p*q, p,q 비공개)',
  },
  {
    label: 'Wesolowski 증명',
    body: '검증자가 랜덤 소수 l을 선택 — 증명자: pi = x^(2^T / l) mod N (몫 지수)',
  },
  {
    label: 'Pietrzak 증명 (재귀 반분할)',
    body: 'T 스텝을 재귀 반분할 → 증명 크기 O(log T)',
  },
];
