export const C = {
  deadline: '#6366f1', part: '#10b981', proof: '#f59e0b', fault: '#ef4444',
};

export const STEPS = [
  {
    label: '48개 데드라인 (24시간 = 2880 에폭)',
    body: '각 데드라인 30분 (60 에폭) — 할당된 파티션의 모든 섹터를 증명',
  },
  {
    label: '파티션 단위 증명',
    body: '파티션당 최대 2349 섹터 — 각 섹터에서 챌린지 노드의 머클 증명 생성',
  },
  {
    label: '온체인 제출 & 검증',
    body: 'Groth16 SNARK으로 압축 후 온체인 제출',
  },
];
