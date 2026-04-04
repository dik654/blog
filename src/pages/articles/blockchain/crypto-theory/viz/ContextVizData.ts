export const C = { sym: '#6366f1', asym: '#10b981', sig: '#f59e0b', err: '#ef4444' };

export const STEPS = [
  {
    label: '왜 암호학이 필요한가',
    body: '블록체인은 중앙 기관 없이 신뢰를 구축',
  },
  {
    label: '대칭 암호: 같은 키',
    body: '암호화와 복호화에 동일한 키 K 사용',
  },
  {
    label: '비대칭 암호: 공개키 + 비밀키',
    body: '공개키(pk)로 암호화 → 비밀키(sk)로 복호화',
  },
  {
    label: '핵심 응용: 서명 · 키교환 · 비밀분산',
    body: '디지털 서명 — ECDSA, EdDSA, BLS (합의 투표)',
  },
];
