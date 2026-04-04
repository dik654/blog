import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Cluster', color: '#8b5cf6', x: 110, y: 5 },
  { label: 'Worker 1', color: '#10b981', x: 10, y: 60 },
  { label: 'Worker 2', color: '#10b981', x: 100, y: 60 },
  { label: 'Worker 3', color: '#10b981', x: 190, y: 60 },
  { label: 'Offchain\nRollup', color: '#f59e0b', x: 10, y: 115 },
  { label: 'SideVM', color: '#ef4444', x: 100, y: 115 },
  { label: 'On-chain', color: '#0ea5e9', x: 190, y: 115 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 1, to: 4 }, { from: 2, to: 5 }, { from: 4, to: 6 },
];

const STEPS = [
  { label: '분산 실행 구조' },
  { label: '클러스터 & 워커' },
  { label: 'Rollup & SideVM' },
];

const ANNOT = ['클러스터 워커 관리 분산', 'TEE 워커 클러스터 고가용성', 'Offchain Rollup 온체인 기록'];
const VN: number[][] = [[0,1,2,3,4,5,6],[0,1,2,3],[4,5,6]];
const VE: number[][] = [[0,1,2,3,4,5],[0,1,2],[3,4,5]];
const BW = 72, BH = 28;
const mid = (i: number) => ({ x: NODES[i].x+BW/2, y: NODES[i].y+BH/2 });

export default function DistributedViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1.2} strokeDasharray="4 3"
                animate={{ opacity: VE[step].includes(i) ? 0.7 : 0.06 }} />
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
                  <motion.text x={285} y={78} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
