import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { PROTOS, STEPS, BAR_MAX } from './BFTComparisonData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

/* Reusable node */
function N({ x, y, label, color, r = 14 }: { x: number; y: number; label: string; color: string; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="var(--card)" stroke={color} strokeWidth={1.5} />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill={color}>{label}</text>
    </g>
  );
}

/* PBFT: full mesh (4 nodes) */
function PBFTMesh({ active }: { active: boolean }) {
  const nodes = [{ x: 30, y: 30 }, { x: 100, y: 30 }, { x: 30, y: 90 }, { x: 100, y: 90 }];
  const lines: [number, number][] = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) lines.push([i, j]);
  return (
    <motion.g animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
      <text x={65} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">PBFT</text>
      {lines.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#ef4444" strokeWidth={1.2} opacity={0.4} />
      ))}
      {nodes.map((n, i) => <N key={i} x={n.x} y={n.y} label={`R${i}`} color="#ef4444" />)}
      <text x={65} y={116} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">6 edges</text>
    </motion.g>
  );
}

/* HotStuff / Autobahn: star topology */
function StarTopo({ cx, name, color, active }: { cx: number; name: string; color: string; active: boolean }) {
  const leader = { x: cx + 65, y: 35 };
  const reps = [{ x: cx + 15, y: 90 }, { x: cx + 65, y: 90 }, { x: cx + 115, y: 90 }];
  return (
    <motion.g animate={{ opacity: active ? 1 : 0.15 }} transition={sp}>
      <text x={cx + 65} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{name}</text>
      {reps.map((r, i) => (
        <line key={i} x1={leader.x} y1={leader.y + 14} x2={r.x} y2={r.y - 14}
          stroke={color} strokeWidth={1.2} opacity={0.4} />
      ))}
      <N x={leader.x} y={leader.y} label="L" color={color} r={16} />
      {reps.map((r, i) => <N key={i} x={r.x} y={r.y} label={`R${i + 1}`} color="#0ea5e9" />)}
      <text x={cx + 65} y={116} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">3 edges</text>
    </motion.g>
  );
}

export default function BFTComparisonViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <PBFTMesh active={step === 0 || step === 1} />
          <g transform="translate(145, 0)">
            <StarTopo cx={0} name="HotStuff" color="#6366f1" active={step === 0 || step === 2} />
          </g>
          <g transform="translate(290, 0)">
            <StarTopo cx={0} name="Autobahn" color="#10b981" active={step === 0 || step === 3} />
          </g>

          {/* Latency bars */}
          <text x={10} y={140} fontSize={11} fontWeight={600} fill="var(--muted-foreground)">지연 비교</text>
          {PROTOS.map((p, i) => {
            const barW = (p.delays / 7) * BAR_MAX;
            const y = 150 + i * 20;
            const active = step === 0 || step === i + 1;
            return (
              <motion.g key={p.name} animate={{ opacity: active ? 1 : 0.2 }} transition={sp}>
                <text x={10} y={y + 12} fontSize={10} fontWeight={600} fill={p.color}>{p.name}</text>
                <motion.rect x={90} y={y} height={16} rx={4}
                  fill={`${p.color}25`} stroke={p.color} strokeWidth={0.8}
                  animate={{ width: active ? barW : 8 }}
                  transition={{ duration: 0.4 }} />
                <text x={90 + barW + 8} y={y + 12} fontSize={10} fill={p.color}>{p.delays} delays</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
