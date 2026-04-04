export const C = { ghost: '#8b5cf6', store: '#10b981', node: '#6366f1', attest: '#f59e0b', head: '#ef4444', boost: '#3b82f6' };

export const STEPS = [
  { label: '왜 LMD-GHOST가 필요한가', body: '포크 시 "가장 최근 투표가 가장 많은" 포크를 선택' },
  { label: '① ForkChoiceStore 구조', body: 'nodeByRoot 맵 O(1) 탐색, justifiedCheckpoint에서 시작' },
  { label: '② Node 구조체', body: 'slot, root, weight + parent/children 양방향 링크 트리' },
  { label: '③ InsertNode', body: '부모 루트로 기존 노드 탐색 → 새 Node를 children에 추가' },
  { label: '④ ProcessAttestation', body: '검증자 투표를 votes[index]에 기록, 에폭 전환 시 weight 재계산' },
  { label: '⑤ computeHead + Boost', body: 'justified에서 출발, 최대 weight 자식 선택 + Proposer Boost 40%' },
];

export const NODES = [
  { id: 'genesis', label: 'Slot 4800', x: 230, y: 10 },
  { id: 'a1', label: 'Slot 4801 w=90', x: 100, y: 80 },
  { id: 'b1', label: 'Slot 4801 w=210', x: 370, y: 80 },
  { id: 'a2', label: 'Slot 4802 w=40', x: 20, y: 155 },
  { id: 'a3', label: 'Slot 4802 w=50', x: 210, y: 155 },
  { id: 'b2', label: 'Slot 4802 w=210', x: 370, y: 155 },
  { id: 'head', label: 'HEAD', x: 370, y: 230 },
];

export const EDGES = [
  { from: 0, to: 1, label: 'fork A' },
  { from: 0, to: 2, label: 'fork B' },
  { from: 1, to: 3, label: '분기' },
  { from: 1, to: 4, label: '분기' },
  { from: 2, to: 5, label: '연장' },
  { from: 5, to: 6, label: '최대 w' },
];
