export const C = {
  http: '#6366f1', parse: '#10b981', merkle: '#f59e0b',
  store: '#8b5cf6', sync: '#06b6d4', error: '#ef4444',
};

export const STEPS = [
  { label: 'HTTP 요청: Beacon API에 Bootstrap 데이터 요청',
    body: 'GET /eth/v1/beacon/light_client/bootstrap/{checkpoint}\n체크포인트 해시를 경로에 포함하여 Beacon 노드에 요청한다.' },
  { label: 'Bootstrap 응답 구조: header + committee + branch',
    body: 'JSON 응답이 3가지 핵심 필드를 포함한다.\nheader(블록 헤더), current_sync_committee(512 공개키), committee_branch(5개 형제 해시).' },
  { label: 'committee_branch Merkle 검증',
    body: 'committee_root에 branch[0..4]를 순차적으로 해싱하여\ncomputed_root를 구한 뒤, header.state_root와 일치하는지 확인한다.' },
  { label: 'LightClientStore 초기화',
    body: '검증 통과 후 6개 필드를 설정한다.\nfinalized_header, current_sync_committee 등 — 이후 sync loop의 기반.' },
  { label: '첫 sync loop 시작',
    body: 'Store 초기화 직후 Beacon API에 updates 요청.\nBLS 서명 검증 통과 시 finalized_header를 갱신한다.' },
  { label: '에러 케이스: 부트스트랩 실패 원인 3가지',
    body: 'CheckpointTooOld — weak subjectivity 초과 (2주+)\nInvalidCommitteeBranch — Merkle 검증 실패\nNetworkMismatch — genesis_validators_root 불일치' },
];
