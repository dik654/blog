export const V1 = '#6366f1';
export const V2 = '#0ea5e9';
export const V3 = '#f59e0b';
export const COMMITTED = '#10b981';

export const STEPS = [
  { label: 'Round 1: 각 검증자가 vertex 제출', body: '3명의 검증자가 각각 트랜잭션 배치를 포함한' },
  { label: 'Round 2: 이전 라운드 참조 (DAG 엣지)', body: '각 검증자의 Round 2 vertex가' },
  { label: 'Round 2 Anchor 선출: 2f+1 참조', body: 'Round 2에서 V1이 앵커(리더)로 선출' },
  { label: 'Round 3-4: DAG 확장 + 앵커 커밋', body: 'DAG가 확장되고 충분한 참조를 받은' },
];

/* Grid layout: 4 rounds × 3 validators */
export const RX = [60, 150, 240, 330]; // round x positions
export const VY = [45, 110, 175];       // validator y positions
export const R = 18;

export type Vertex = { rx: number; vy: number; color: string; label: string };

export const vertices: Vertex[][] = [
  /* Round 1 */ [
    { rx: RX[0], vy: VY[0], color: V1, label: 'V1' },
    { rx: RX[0], vy: VY[1], color: V2, label: 'V2' },
    { rx: RX[0], vy: VY[2], color: V3, label: 'V3' },
  ],
  /* Round 2 */ [
    { rx: RX[1], vy: VY[0], color: V1, label: 'V1' },
    { rx: RX[1], vy: VY[1], color: V2, label: 'V2' },
    { rx: RX[1], vy: VY[2], color: V3, label: 'V3' },
  ],
  /* Round 3 */ [
    { rx: RX[2], vy: VY[0], color: V1, label: 'V1' },
    { rx: RX[2], vy: VY[1], color: V2, label: 'V2' },
    { rx: RX[2], vy: VY[2], color: V3, label: 'V3' },
  ],
  /* Round 4 */ [
    { rx: RX[3], vy: VY[0], color: V1, label: 'V1' },
    { rx: RX[3], vy: VY[1], color: V2, label: 'V2' },
    { rx: RX[3], vy: VY[2], color: V3, label: 'V3' },
  ],
];

/* Edges: from round r to round r-1 */
export type Edge = { x1: number; y1: number; x2: number; y2: number; color: string };

function makeEdges(fromRound: number): Edge[] {
  const edges: Edge[] = [];
  for (const from of vertices[fromRound]) {
    for (const to of vertices[fromRound - 1]) {
      edges.push({
        x1: to.rx + R, y1: to.vy,
        x2: from.rx - R, y2: from.vy,
        color: from.color,
      });
    }
  }
  return edges;
}

export const edgesR2 = makeEdges(1);
export const edgesR3 = makeEdges(2);
export const edgesR4 = makeEdges(3);
