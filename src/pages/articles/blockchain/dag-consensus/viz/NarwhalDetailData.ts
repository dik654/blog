export const VERTEX_STEPS = [
  {
    label: 'Vertex — DAG의 기본 단위',
    body: 'author: 검증자 ID — round: 라운드 번호',
  },
  {
    label: 'Certificate — 데이터 가용성 증명',
    body: 'vertex: 원본 Vertex — votes: 2f+1 검증자 서명',
  },
  {
    label: '라운드 진행: Vertex → 투표 → Certificate',
    body: '1. 검증자가 Vertex를 브로드캐스트',
  },
];

export const WORKER_STEPS = [
  {
    label: 'Primary — DAG 관리 (메타데이터)',
    body: 'Certificate 생성 & 검증 — DAG 구축 — vertex는 batch의 digest만 참조',
  },
  {
    label: 'Worker — 데이터 전파 (대역폭)',
    body: 'Worker 1, 2, 3 ... 병렬로 batch 수집',
  },
  {
    label: '이더리움 비교: 단일 제안자 병목',
    body: '이더리움: 단일 proposer가 전체 블록 바디를 전파 — 병목',
  },
];
