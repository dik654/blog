import { motion } from 'framer-motion';
import StepViz from '../../../../../components/ui/step-viz';

/* PBFT 3-phase 메시지 흐름 애니메이션 */

const C = { P: '#6366f1', S: '#0ea5e9', A: '#f59e0b', G: '#10b981' };

const STEPS = [
  { label: 'Client → Primary: Request 전송', body: 'Client가 Primary(Replica 0)에게 요청을 보냅니다. Primary만이 Pre-Prepare를 시작할 수 있습니다.' },
  { label: 'Phase 1: Pre-Prepare (Primary → All)', body: 'Primary가 시퀀스 번호를 부여하고 모든 Replica에게 Pre-Prepare 메시지를 브로드캐스트합니다.' },
  { label: 'Phase 2: Prepare (All ↔ All)', body: '각 Replica가 다른 모든 Replica에게 Prepare 메시지를 전송합니다. O(n²) 메시지. 2f+1 Prepare를 수집하면 "prepared" 상태.' },
  { label: 'Phase 3: Commit (All ↔ All)', body: '2f+1 Commit 메시지를 수집하면 "committed" 상태. 이 시점에서 Safety가 보장됩니다.' },
  { label: 'Reply: 모든 Replica → Client', body: 'Client는 f+1개의 동일한 Reply를 받으면 결과를 수용합니다. 총 5 message delays.' },
];

const NODES = [
  { x: 65,  y: 30, label: 'C', sub: 'Client', color: C.A },
  { x: 190, y: 30, label: 'R0', sub: 'Primary', color: C.P },
  { x: 190, y: 100, label: 'R1', sub: 'Backup', color: C.S },
  { x: 190, y: 170, label: 'R2', sub: 'Backup', color: C.S },
  { x: 190, y: 240, label: 'R3', sub: 'Backup', color: C.S },
];

function Node({ x, y, label, sub, color, dim }: { x: number; y: number; label: string; sub: string; color: string; dim?: boolean }) {
  return (
    <g opacity={dim ? 0.3 : 1}>
      <circle cx={x} cy={y} r={18} fill={`${color}22`} stroke={color} strokeWidth={1.5} />
      <text x={x} y={y + 1} textAnchor="middle" fontSize={10} fontWeight="700" fill={color}>{label}</text>
      <text x={x} y={y + 30} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">{sub}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color, show, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; show: boolean; delay?: number;
}) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.5}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={show ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
      transition={{ duration: 0.4, delay }}
    />
  );
}

function Broadcast({ fromIdx, toIndices, color, show, step }: {
  fromIdx: number; toIndices: number[]; color: string; show: boolean; step: number;
}) {
  const from = NODES[fromIdx];
  return (
    <>
      {toIndices.map((ti, i) => {
        const to = NODES[ti];
        return (
          <Arrow key={`${step}-${fromIdx}-${ti}`}
            x1={from.x + 18} y1={from.y} x2={to.x - 18} y2={to.y}
            color={color} show={show} delay={i * 0.08} />
        );
      })}
    </>
  );
}

export default function PBFTFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 340 270" className="w-full max-w-[380px]" style={{ height: 'auto' }}>
          {/* Phase labels */}
          {step >= 1 && step <= 3 && (
            <motion.text x={290} y={135} textAnchor="middle" fontSize={9} fontWeight="600"
              fill={step === 1 ? C.P : step === 2 ? C.S : C.G}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {step === 1 ? 'Pre-Prepare' : step === 2 ? 'Prepare' : 'Commit'}
            </motion.text>
          )}

          {/* Complexity badge */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <rect x={260} y={148} width={65} height={20} rx={4} fill="#ef444422" stroke="#ef4444" strokeWidth={1} />
              <text x={292} y={162} textAnchor="middle" fontSize={8} fontWeight="700" fill="#ef4444">O(n²)</text>
            </motion.g>
          )}

          {/* Nodes */}
          {NODES.map((n, i) => <Node key={i} {...n} />)}

          {/* Step 0: Client → Primary */}
          <Arrow x1={83} y1={30} x2={172} y2={30} color={C.A} show={step >= 0} />

          {/* Step 1: Pre-Prepare (Primary → Backups) */}
          {step >= 1 && (
            <Broadcast fromIdx={1} toIndices={[2, 3, 4]} color={C.P} show={step >= 1} step={1} />
          )}

          {/* Step 2: Prepare (All-to-All) */}
          {step >= 2 && [2, 3, 4].map((from, fi) =>
            [1, 2, 3, 4].filter(t => t !== from).map((to, ti) => (
              <Arrow key={`p-${from}-${to}`}
                x1={NODES[from].x + (to < from ? -18 : to === from ? 0 : 18)}
                y1={NODES[from].y}
                x2={NODES[to].x + (from < to ? -18 : from === to ? 0 : 18)}
                y2={NODES[to].y}
                color={C.S} show={step >= 2} delay={fi * 0.1 + ti * 0.05} />
            ))
          )}

          {/* Step 3: Commit — same pattern, green */}
          {step >= 3 && [1, 2, 3, 4].map((from, fi) =>
            [1, 2, 3, 4].filter(t => t !== from).map((to, ti) => (
              <Arrow key={`c-${from}-${to}`}
                x1={NODES[from].x + 20} y1={NODES[from].y}
                x2={NODES[to].x + 20} y2={NODES[to].y}
                color={C.G} show={step >= 3} delay={fi * 0.1 + ti * 0.05} />
            ))
          )}

          {/* Step 4: Reply → Client */}
          {step >= 4 && [1, 2, 3, 4].map((from, i) => (
            <Arrow key={`r-${from}`}
              x1={NODES[from].x - 18} y1={NODES[from].y}
              x2={83} y2={30}
              color={C.G} show delay={i * 0.1} />
          ))}
        </svg>
      )}
    </StepViz>
  );
}
