export interface BisectionStep {
  depth: number;
  indexAtDepth: number;
  traceRange: string;
  action: string;
  actor: string;
}

export const BISECTION_TREE: BisectionStep[] = [
  { depth: 0, indexAtDepth: 0, traceRange: '0 ~ 100K', action: 'Root Claim', actor: '방어자' },
  { depth: 1, indexAtDepth: 0, traceRange: '0 ~ 50K', action: 'Attack (왼쪽 절반)', actor: '도전자' },
  { depth: 2, indexAtDepth: 1, traceRange: '25K ~ 50K', action: 'Defend (오른쪽 절반)', actor: '방어자' },
  { depth: 3, indexAtDepth: 2, traceRange: '25K ~ 37.5K', action: 'Attack', actor: '도전자' },
];

export const POSITION_ENCODING = {
  formula: 'TraceIndex = (indexAtDepth << (maxDepth - depth)) | ((1 << (maxDepth - depth)) - 1)',
  explanation: 'Position은 depth(깊이)와 indexAtDepth(해당 깊이의 인덱스)로 이진 트리 좌표를 표현한다. TraceIndex()는 이 위치가 가리키는 실행 트레이스의 인덱스를 계산한다.',
  attackDefend: 'Attack = 왼쪽 자식(분쟁 범위의 앞 절반). Defend = 부모의 오른쪽 형제의 왼쪽 자식(뒤 절반을 인정하고 그 앞부분에 이의).',
  depthRule: '짝수 깊이 = 방어자 차례, 홀수 깊이 = 도전자 차례. 체스처럼 번갈아 둔다.',
};

export const TREE_NODES = [
  { depth: 0, idx: 0, x: 240, y: 25, label: 'Root', range: '0~100K', actor: 'D', color: '#10b981' },
  { depth: 1, idx: 0, x: 120, y: 75, label: 'Attack', range: '0~50K', actor: 'C', color: '#ef4444' },
  { depth: 1, idx: 1, x: 360, y: 75, label: 'Defend', range: '50K~100K', actor: 'C', color: '#6366f1' },
  { depth: 2, idx: 0, x: 60, y: 125, label: 'Atk', range: '0~25K', actor: 'D', color: '#10b981' },
  { depth: 2, idx: 1, x: 180, y: 125, label: 'Def', range: '25K~50K', actor: 'D', color: '#10b981' },
  { depth: 2, idx: 2, x: 300, y: 125, label: 'Atk', range: '50K~75K', actor: 'D', color: '#10b981' },
  { depth: 2, idx: 3, x: 420, y: 125, label: 'Def', range: '75K~100K', actor: 'D', color: '#10b981' },
];

export const TREE_EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 1, to: 4 },
  { from: 2, to: 5 }, { from: 2, to: 6 },
];
