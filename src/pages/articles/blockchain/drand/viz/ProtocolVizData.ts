export const C = { bls: '#6366f1', ok: '#10b981', node: '#f59e0b', hash: '#8b5cf6' };

export const STEPS = [
  {
    label: 'DKG: 분산 키 생성 (초기 1회)',
    body: 'N개 노드가 Distributed Key Generation 수행',
  },
  {
    label: '부분 서명 → 집계',
    body: '라운드 r이 시작되면 각 노드가 부분 서명 생성:',
  },
  {
    label: '랜덤 출력 = Hash(Sigma)',
    body: '집계 서명 Sigma를 해시하면 랜덤 바이트열',
  },
];
