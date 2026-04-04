export const C = { prefix: '#6366f1', state: '#10b981', hash: '#f59e0b', root: '#8b5cf6', check: '#0ea5e9' };

export const STEPS = [
  {
    label: 'PrefixSet 수신',
    body: 'ExecutionStage가 기록한 변경 키 접두사 목록으로 변경 서브트리만 식별합니다.',
  },
  {
    label: 'StateRoot::overlay_root()',
    body: '기존 트라이 위에 BundleState 변경분을 오버레이하여 전체 재계산 대비 10~100배 빠릅니다.',
  },
  {
    label: '변경 경로만 선택',
    body: 'PrefixSet 매칭 경로만 순회하고 나머지 서브트리는 기존 해시를 재사용합니다.',
  },
  {
    label: 'keccak256(left || right)',
    body: '변경된 리프부터 루트까지 바텀업 keccak256 재해시로 32바이트 state_root를 생성합니다.',
  },
  {
    label: 'computed_root == header.state_root',
    body: '계산한 루트를 헤더의 state_root와 비교하여 일치 시 동기화 성공을 증명합니다.',
  },
];
