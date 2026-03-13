import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

/* DAG 구축 시각화 — 3 검증자 × 4 라운드 */

const V1 = '#6366f1';
const V2 = '#0ea5e9';
const V3 = '#f59e0b';
const COMMITTED = '#10b981';

const STEPS = [
  { label: 'Round 1: 각 검증자가 vertex 제출', body: '3명의 검증자가 각각 트랜잭션 배치를 포함한 vertex를 브로드캐스트합니다. 아직 참조(엣지)가 없는 초기 라운드입니다.' },
  { label: 'Round 2: 이전 라운드 참조 (DAG 엣지)', body: '각 검증자의 Round 2 vertex가 Round 1의 vertex들을 부모로 참조합니다. 2f+1개 이상의 Certificate를 포함해야 유효합니다.' },
  { label: 'Round 2 Anchor 선출: 2f+1 참조', body: 'Round 2에서 V1이 앵커(리더)로 선출됩니다. Round 3의 vertex 중 2f+1개 이상이 이 앵커를 참조하면 커밋됩니다.' },
  { label: 'Round 3-4: DAG 확장 + 앵커 커밋', body: 'Round 3-4까지 DAG가 확장되고, 충분한 참조를 받은 앵커의 인과적 히스토리가 커밋(초록색)됩니다.' },
];

/* Grid layout: 4 rounds × 3 validators */
const RX = [60, 150, 240, 330]; // round x positions
const VY = [45, 110, 175];       // validator y positions
const R = 18;

type Vertex = { rx: number; vy: number; color: string; label: string };

const vertices: Vertex[][] = [
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

/* Edges: from round r to round r-1 (each vertex references all prev round vertices) */
type Edge = { x1: number; y1: number; x2: number; y2: number; color: string };

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

const edgesR2 = makeEdges(1);
const edgesR3 = makeEdges(2);
const edgesR4 = makeEdges(3);

function VertexCircle({ v, show, glow, anchor, delay = 0 }: {
  v: Vertex; show: boolean; glow?: boolean; anchor?: boolean; delay?: number;
}) {
  const fillColor = glow ? COMMITTED : v.color;
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.3 }}
      animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
      transition={{ duration: 0.35, delay }}
    >
      {/* Glow ring for committed */}
      {glow && (
        <motion.circle
          cx={v.rx} cy={v.vy} r={R + 5}
          fill="none" stroke={COMMITTED} strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <circle cx={v.rx} cy={v.vy} r={R}
        fill={`${fillColor}22`} stroke={fillColor} strokeWidth={2} />
      <text x={v.rx} y={v.vy + 4} textAnchor="middle"
        fontSize={10} fontWeight="700" fill={fillColor}>
        {v.label}
      </text>
      {/* Anchor star */}
      {anchor && (
        <motion.text
          x={v.rx} y={v.vy - R - 6} textAnchor="middle"
          fontSize={14} fill={V1}
          initial={{ opacity: 0, y: v.vy - R }}
          animate={{ opacity: 1, y: v.vy - R - 6 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          ★
        </motion.text>
      )}
    </motion.g>
  );
}

function EdgeLine({ e, show, delay = 0 }: { e: Edge; show: boolean; delay?: number }) {
  return (
    <motion.line
      x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
      stroke={e.color} strokeWidth={1.2} strokeOpacity={0.5}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={show ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.35, delay }}
    />
  );
}

export default function DAGViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 390 220" className="w-full max-w-[500px]" style={{ height: 'auto' }}>
          {/* Round labels */}
          {RX.map((x, i) => (
            <text key={i} x={x} y={14} textAnchor="middle"
              fontSize={9} fontWeight="600" fill="hsl(var(--muted-foreground))">
              Round {i + 1}
            </text>
          ))}

          {/* Validator labels */}
          {['V1', 'V2', 'V3'].map((label, i) => (
            <text key={i} x={14} y={VY[i] + 4} textAnchor="middle"
              fontSize={8} fill="hsl(var(--muted-foreground))">
              {label}
            </text>
          ))}

          {/* ── Edges ── */}
          {/* Round 1→2 edges (step >= 1) */}
          {edgesR2.map((e, i) => (
            <EdgeLine key={`e2-${i}`} e={e} show={step >= 1} delay={i * 0.03} />
          ))}
          {/* Round 2→3 edges (step >= 3) */}
          {edgesR3.map((e, i) => (
            <EdgeLine key={`e3-${i}`} e={e} show={step >= 3} delay={i * 0.03} />
          ))}
          {/* Round 3→4 edges (step >= 3) */}
          {edgesR4.map((e, i) => (
            <EdgeLine key={`e4-${i}`} e={e} show={step >= 3} delay={0.3 + i * 0.03} />
          ))}

          {/* ── Vertices ── */}
          {/* Round 1 (step >= 0) */}
          {vertices[0].map((v, i) => (
            <VertexCircle key={`r1-${i}`} v={v} show={step >= 0}
              glow={step >= 3} delay={i * 0.1} />
          ))}

          {/* Round 2 (step >= 1) */}
          {vertices[1].map((v, i) => (
            <VertexCircle key={`r2-${i}`} v={v} show={step >= 1}
              anchor={step >= 2 && i === 0}
              glow={step >= 3} delay={0.3 + i * 0.1} />
          ))}

          {/* Round 3 (step >= 3) */}
          {vertices[2].map((v, i) => (
            <VertexCircle key={`r3-${i}`} v={v} show={step >= 3} delay={i * 0.1} />
          ))}

          {/* Round 4 (step >= 3) */}
          {vertices[3].map((v, i) => (
            <VertexCircle key={`r4-${i}`} v={v} show={step >= 3} delay={0.3 + i * 0.1} />
          ))}

          {/* Anchor commit label */}
          {step >= 2 && step < 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <rect x={RX[1] - 38} y={VY[0] + R + 8} width={76} height={18} rx={4}
                fill={`${V1}22`} stroke={V1} strokeWidth={1} />
              <text x={RX[1]} y={VY[0] + R + 20} textAnchor="middle"
                fontSize={8} fontWeight="600" fill={V1}>
                Anchor ★
              </text>
            </motion.g>
          )}

          {/* Committed label at step 3 */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <rect x={RX[0] - 20} y={200} width={RX[1] - RX[0] + 40} height={16} rx={4}
                fill={`${COMMITTED}15`} stroke={COMMITTED} strokeWidth={1} />
              <text x={(RX[0] + RX[1]) / 2} y={211} textAnchor="middle"
                fontSize={8} fontWeight="600" fill={COMMITTED}>
                Committed (causal history)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
