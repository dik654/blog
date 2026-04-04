export const C = { col: '#f59e0b', poseidon: '#10b981', tree: '#8b5cf6', gpu: '#0ea5e9' };

export const STEPS = [
  {
    label: '칼럼 해시: 세로 방향 집계',
    body: '11개 레이어에서 같은 위치(offset)의 노드를',
  },
  {
    label: 'TreeR 생성 + comm_r',
    body: 'TreeC(칼럼 해시) + TreeR(복제 데이터 머클)',
  },
  {
    label: 'GPU 가속: Poseidon 배치 처리',
    body: 'SHA256과 달리 Poseidon은 산술 회로 친화적',
  },
];
