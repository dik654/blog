export const C = { fork: '#8b5cf6', ok: '#10b981', err: '#ef4444', attest: '#f59e0b', head: '#0ea5e9' };

export const STEPS = [
  {
    label: '여러 블록이 동시에 도착',
    body: '네트워크 지연으로 포크가 발생하면 어떤 것이 정식 헤드인지 결정해야 합니다.',
  },
  {
    label: '문제: 공격자가 의도적 포크 생성',
    body: '수십만 검증자의 최신 투표를 빠르게 집계하여 가장 지지받는 분기를 실시간 선택해야 합니다.',
  },
  {
    label: '문제: 노드 조회 성능',
    body: '수천 블록 노드 트리에서 매 슬롯 O(1) 탐색이 필요합니다.',
  },
  {
    label: '해결: LMD-GHOST',
    body: 'justified 노드에서 출발하여 매 분기점에서 가중치가 가장 큰 자식을 선택합니다.',
  },
  {
    label: '해결: doubly-linked-tree',
    body: 'nodeByRoot 맵으로 O(1) 접근하고 Proposer Boost로 현재 슬롯 제안자에 40% 추가 가중치를 부여합니다.',
  },
];
