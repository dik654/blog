export const C = {
  hdr: '#6366f1', body: '#0ea5e9', send: '#8b5cf6',
  exec: '#f59e0b', merkle: '#10b981', done: '#10b981',
};

export const STEPS = [
  {
    label: 'Pipeline::run() — 전체 루프',
    body: '6개 Stage를 순서대로 실행하며 모든 Stage가 done=true를 반환할 때까지 루프 반복합니다.',
  },
  {
    label: 'HeadersStage — 피어에서 헤더 다운로드',
    body: 'devp2p로 GetBlockHeaders 요청 후 검증하여 MDBX Headers 테이블에 저장합니다.',
  },
  {
    label: 'BodiesStage — 바디(TX 목록) 수집',
    body: '헤더 기반으로 GetBlockBodies 요청 후 tx_root 대조 검증하여 저장합니다.',
  },
  {
    label: 'SendersStage — ecrecover로 발신자 복구',
    body: 'TX 서명(v,r,s)에서 rayon 병렬 ecrecover로 sender 주소를 복구합니다.',
  },
  {
    label: 'ExecutionStage — revm으로 TX 실행',
    body: '헤더+바디+sender를 조합해 revm으로 실행하고 BundleState에 상태 변경을 누적합니다.',
  },
  {
    label: 'MerkleStage — 변경분만 상태 루트 재계산',
    body: 'PrefixSet으로 변경 서브트리만 재해시하여 헤더의 state_root와 비교합니다.',
  },
];
