export const C = {
  root: '#6366f1', branch: '#f59e0b', leaf: '#10b981',
};

export const STEPS = [
  {
    label: 'Line 27~28: is_valid_merkle_branch 호출',
    body: 'committee 해시를 leaf로, branch 5개 해시를 경로로 전달.\nstate_root가 Merkle 트리의 루트 역할.',
  },
  {
    label: 'Line 29~31: depth=5, index=22',
    body: 'Beacon State 트리에서 committee의 위치 = 인덱스 22.\n5단계 깊이의 바이너리 Merkle 트리.',
  },
  {
    label: 'Line 34~36: 검증 실패 시 에러',
    body: 'Merkle 증명이 무효하면 즉시 에러 반환.\n위변조된 committee로 서명을 속일 수 없다.',
  },
];
