import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'PHA Token', color: '#8b5cf6', x: 110, y: 5 },
  { label: 'StakePool', color: '#f59e0b', x: 20, y: 55 },
  { label: 'Worker', color: '#10b981', x: 120, y: 55 },
  { label: 'Delegator', color: '#6366f1', x: 220, y: 55 },
  { label: 'Compute', color: '#ef4444', x: 50, y: 110 },
  { label: 'Reward', color: '#0ea5e9', x: 170, y: 110 },
];

const EDGES = [
  { from: 0, to: 1, label: 'Stake' },
  { from: 3, to: 1, label: 'Delegate' },
  { from: 1, to: 2, label: 'Assign' },
  { from: 2, to: 4, label: 'Execute' },
  { from: 4, to: 5, label: 'Earn' },
  { from: 5, to: 3, label: 'Share' },
];

const STEPS = [
  { label: 'PHA 토크노믹스 순환' },
  { label: '스테이킹 & 위임' },
  { label: '컴퓨팅 & 보상' },
];

const ANNOT = ['Stake->Compute->Reward 순환', 'StakePool 스테이킹+위임', 'TEE 작업 PHA 보상 분배'];
const VN: number[][] = [[0,1,2,3,4,5],[0,1,2,3],[2,4,5,3]];
const VE: number[][] = [[0,1,2,3,4,5],[0,1,2],[3,4,5]];
const BW = 70, BH = 26;
const mid = (i: number) => ({ x: NODES[i].x+BW/2, y: NODES[i].y+BH/2 });

export default function TokenomicsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 410 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            const vis = VE[step].includes(i);
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.8 : 0.06 }}>
                <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                  stroke="#666" strokeWidth={1.2} strokeDasharray="4 3" />
                <rect x={(f.x+t.x)/2+5-18} y={(f.y+t.y)/2-11} width={36} height={12} rx={2} fill="var(--card)" />
                <text x={(f.x+t.x)/2+5} y={(f.y+t.y)/2-4} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
                {vis && (
                  <motion.circle r={3} fill={NODES[e.from].color}
                    animate={{ cx:[f.x,t.x], cy:[f.y,t.y] }}
                    transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 1 }} />
                )}
              </motion.g>
            );
          })}
          {NODES.map((n, i) => (
            <motion.g key={n.label} animate={{ opacity: VN[step].includes(i) ? 1 : 0.1 }}>
              <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
              <text x={n.x+BW/2} y={n.y+BH/2+4} textAnchor="middle"
                fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
            </motion.g>
          ))}
                  <motion.text x={315} y={75} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
