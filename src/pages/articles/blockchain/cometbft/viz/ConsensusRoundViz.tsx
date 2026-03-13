import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

/* Tendermint BFT Consensus Round Flow 시각화 */

const C = { Proposer: '#6366f1', Validator: '#0ea5e9', Committed: '#10b981' };

const STEPS = [
  {
    label: 'Propose: 리더가 블록 제안',
    body: 'Proposer(라운드 로빈으로 선출)가 새 블록을 생성하여 모든 검증자에게 브로드캐스트합니다.',
  },
  {
    label: 'Prevote: 검증자 투표',
    body: '각 검증자가 제안된 블록을 검증한 후 Prevote(block_hash) 또는 Prevote(nil)을 전파합니다.',
  },
  {
    label: 'Polka 달성: +2/3 Prevote 수집',
    body: '전체 투표권의 2/3 이상 Prevote가 동일 블록에 모이면 "Polka"가 달성됩니다.',
  },
  {
    label: 'Precommit: 최종 커밋 투표',
    body: 'Polka를 확인한 검증자들이 Precommit(block_hash)을 전송하고 해당 블록에 Lock을 겁니다.',
  },
  {
    label: 'Commit: +2/3 Precommit → 즉시 최종성',
    body: '+2/3 Precommit이 수집되면 블록이 커밋됩니다. 포크 없이 즉시 최종성이 보장됩니다.',
  },
];

const NODES = [
  { x: 170, y: 35, label: 'P', sub: 'Proposer', color: C.Proposer },
  { x: 65, y: 120, label: 'V1', sub: 'Validator', color: C.Validator },
  { x: 170, y: 200, label: 'V2', sub: 'Validator', color: C.Validator },
  { x: 275, y: 120, label: 'V3', sub: 'Validator', color: C.Validator },
];

function Node({
  x, y, label, sub, color, highlight,
}: {
  x: number; y: number; label: string; sub: string; color: string; highlight?: boolean;
}) {
  const fill = highlight ? color : `${color}22`;
  const textFill = highlight ? '#fff' : color;
  return (
    <g>
      <motion.circle
        cx={x} cy={y} r={20}
        fill={fill} stroke={color} strokeWidth={1.5}
        animate={{ fill, scale: highlight ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: `${x}px ${y}px` }}
      />
      <text x={x} y={y + 1} textAnchor="middle" fontSize={11} fontWeight="700" fill={textFill}>
        {label}
      </text>
      <text x={x} y={y + 34} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">
        {sub}
      </text>
    </g>
  );
}

function Arrow({
  x1, y1, x2, y2, color, show, delay = 0,
}: {
  x1: number; y1: number; x2: number; y2: number; color: string; show: boolean; delay?: number;
}) {
  /* shorten line to avoid overlapping nodes */
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = x1 + ux * 22;
  const sy = y1 + uy * 22;
  const ex = x2 - ux * 22;
  const ey = y2 - uy * 22;

  return (
    <motion.line
      x1={sx} y1={sy} x2={ex} y2={ey}
      stroke={color} strokeWidth={1.5}
      markerEnd="url(#arrowhead)"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={show ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.4, delay }}
    />
  );
}

function VoteCount({ show, count, x, y }: { show: boolean; count: string; x: number; y: number }) {
  if (!show) return null;
  return (
    <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <rect x={x - 30} y={y - 10} width={60} height={20} rx={4} fill={`${C.Committed}22`} stroke={C.Committed} strokeWidth={1} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={9} fontWeight="700" fill={C.Committed}>
        {count}
      </text>
    </motion.g>
  );
}

export default function ConsensusRoundViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 340 260" className="w-full max-w-[400px]" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="hsl(var(--muted-foreground))" opacity={0.6} />
            </marker>
          </defs>

          {/* Phase label */}
          {step <= 4 && (
            <motion.text
              key={step}
              x={170} y={255}
              textAnchor="middle" fontSize={9} fontWeight="600"
              fill={step === 4 ? C.Committed : step === 0 ? C.Proposer : C.Validator}
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
            >
              {['Propose', 'Prevote', '+2/3 Polka', 'Precommit', 'Commit'][step]}
            </motion.text>
          )}

          {/* Step 0: Proposer → All Validators */}
          {step >= 0 && [1, 2, 3].map((vi, i) => (
            <Arrow
              key={`propose-${vi}`}
              x1={NODES[0].x} y1={NODES[0].y}
              x2={NODES[vi].x} y2={NODES[vi].y}
              color={C.Proposer} show={step === 0} delay={i * 0.1}
            />
          ))}

          {/* Step 1: Validators send Prevotes (all-to-all) */}
          {step >= 1 && step <= 2 && [0, 1, 2, 3].map((from, fi) =>
            [0, 1, 2, 3].filter(t => t !== from).map((to, ti) => (
              <Arrow
                key={`pv-${from}-${to}`}
                x1={NODES[from].x} y1={NODES[from].y}
                x2={NODES[to].x} y2={NODES[to].y}
                color={C.Validator} show={step >= 1 && step <= 2} delay={fi * 0.08 + ti * 0.04}
              />
            ))
          )}

          {/* Step 2: Polka badge */}
          <VoteCount show={step === 2} count="+2/3 Prevote" x={170} y={120} />

          {/* Step 3: Precommit messages */}
          {step === 3 && [0, 1, 2, 3].map((from, fi) =>
            [0, 1, 2, 3].filter(t => t !== from).map((to, ti) => (
              <Arrow
                key={`pc-${from}-${to}`}
                x1={NODES[from].x} y1={NODES[from].y}
                x2={NODES[to].x} y2={NODES[to].y}
                color={C.Committed} show={step === 3} delay={fi * 0.08 + ti * 0.04}
              />
            ))
          )}

          {/* Step 4: Committed — highlight all nodes */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <rect x={110} y={100} width={120} height={30} rx={6}
                fill={`${C.Committed}22`} stroke={C.Committed} strokeWidth={1.5} />
              <text x={170} y={120} textAnchor="middle" fontSize={10} fontWeight="700" fill={C.Committed}>
                Block Committed!
              </text>
            </motion.g>
          )}

          {/* Nodes — always rendered on top */}
          {NODES.map((n, i) => (
            <Node
              key={i} {...n}
              highlight={
                (step === 0 && i === 0) ||
                (step === 4)
              }
              color={step === 4 ? C.Committed : n.color}
            />
          ))}
        </svg>
      )}
    </StepViz>
  );
}
