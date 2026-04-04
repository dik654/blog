export const DETAIL_STEPS = [
  {
    label: 'Star Topology — 리더 경유 통신',
    body: 'PBFT: 모든 노드 → 모든 노드 O(n²)',
  },
  {
    label: 'Threshold Signature → QC',
    body: '리더가 n개 투표를 수신 — Threshold Signature로 합쳐 QC(Quorum Certificate) 1개로 집계',
  },
  {
    label: '3-chain Commit Rule',
    body: 'b, b1, b2가 연속 3개 view에서 QC 체인을 형성',
  },
  {
    label: 'View Change 비교',
    body: 'PBFT: O(n³) — 모든 노드가 prepared 증거 교환',
  },
];
