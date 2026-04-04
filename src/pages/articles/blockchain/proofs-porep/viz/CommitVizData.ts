export const C = {
  seed: '#6366f1', merkle: '#10b981', groth: '#ec4899', gpu: '#0ea5e9',
};

export const STEPS = [
  {
    label: 'C1: InteractiveSeed → 챌린지 선택',
    body: '150 에폭 대기 후 체인에서 랜덤 seed 수신',
  },
  {
    label: 'C1: Merkle 경로 추출',
    body: '챌린지 노드의 TreeR, TreeC 머클 경로 수집',
  },
  {
    label: 'C2: Groth16 증명 생성',
    body: '회로: 레이블 체인 + 인코딩 + 머클 일관성 검증',
  },
];
