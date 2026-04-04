export const C = {
  g1: '#6366f1', g2: '#10b981', gt: '#f59e0b',
};

export const STEPS = [
  {
    label: 'G1: 공개키 공간 (48바이트)',
    body: 'BLS12-381의 G1 곡선 위의 점.\n각 검증자 공개키가 G1 점이다. 덧셈으로 집계 가능.',
  },
  {
    label: 'G2: 서명 공간 (96바이트)',
    body: '서명은 G2 곡선 위의 점이다.\nH(m)을 G2로 해시 후, 비밀키로 스칼라곱.',
  },
  {
    label: 'GT: 페어링 결과 (비교 공간)',
    body: 'e(G1, G2) → GT — 쌍선형 사상.\ne(agg_pk, H(m)) == e(G, sig) 이면 서명 유효.',
  },
];
