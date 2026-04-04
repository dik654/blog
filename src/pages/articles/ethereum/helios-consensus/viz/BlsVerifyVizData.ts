export const C = {
  lhs: '#6366f1', rhs: '#10b981', result: '#f59e0b',
};

export const STEPS = [
  {
    label: 'Line 35~36: lhs = pairing(agg_pk, H(m))',
    body: 'hash_to_g2(&root)로 signing_root를 G2 점으로 변환.\n집계 공개키와 페어링 → GT 원소 생성.',
  },
  {
    label: 'Line 37~38: rhs = pairing(G, sig)',
    body: 'G1 생성원과 집계 서명을 페어링.\n서명이 유효하면 lhs와 동일한 GT 원소.',
  },
  {
    label: 'Line 39: lhs == rhs 비교',
    body: '두 GT 원소가 같으면 서명 유효 → true 반환.\n다르면 위변조된 서명 → false.',
  },
];
