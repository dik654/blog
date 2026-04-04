import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'runtime', label: 'Runtime', color: '#8b5cf6', x: 120, y: 5 },
  { id: 'system', label: 'System', color: '#a855f7', x: 10, y: 60 },
  { id: 'balances', label: 'Balances', color: '#6366f1', x: 85, y: 60 },
  { id: 'staking', label: 'Staking', color: '#10b981', x: 160, y: 60 },
  { id: 'custom', label: 'Custom', color: '#f59e0b', x: 235, y: 60 },
  { id: 'support', label: 'FRAME Support', color: '#6b7280', x: 100, y: 115 },
  { id: 'storage', label: 'Storage', color: '#64748b', x: 20, y: 155 },
  { id: 'dispatch', label: 'Dispatch', color: '#64748b', x: 110, y: 155 },
  { id: 'events', label: 'Events', color: '#64748b', x: 200, y: 155 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 },
  { from: 5, to: 6 }, { from: 5, to: 7 }, { from: 5, to: 8 },
  { from: 1, to: 5 }, { from: 2, to: 5 },
];

const STEPS = [
  { label: 'FRAME 아키텍처', body: 'Runtime이 팔렛들을 조합하고, FRAME Support가 공통 인프라를 제공합니다.' },
  { label: '팔렛 모듈', body: 'System, Balances, Staking 등 기본 팔렛과 커스텀 팔렛을 조합합니다.' },
  { label: 'FRAME Support', body: 'Storage Traits, Dispatch System, Event System 등 공통 기능을 제공합니다.' },
];

const VN: number[][] = [[0,1,2,3,4,5,6,7,8],[0,1,2,3,4],[5,6,7,8]];
const VE: number[][] = [[0,1,2,3,4,5,6,7,8],[0,1,2,3],[4,5,6,7,8]];
const BW = 72, BH = 28;
const mid = (i: number) => ({ x: NODES[i].x+BW/2, y: NODES[i].y+BH/2 });

export default function FramePalletViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 195" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1.2} strokeDasharray="4 3"
                animate={{ opacity: VE[step].includes(i) ? 0.6 : 0.06 }} />
            );
          })}
          {NODES.map((n, i) => (
            <motion.g key={n.id} animate={{ opacity: VN[step].includes(i) ? 1 : 0.1 }}>
              <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
              <text x={n.x+BW/2} y={n.y+BH/2+4} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
