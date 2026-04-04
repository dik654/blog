import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Client', color: '#6b7280', x: 120, y: 5 },
  { label: 'Runtime API', color: '#8b5cf6', x: 30, y: 50 },
  { label: 'WASM Runtime', color: '#6366f1', x: 130, y: 50 },
  { label: 'Native Runtime', color: '#a855f7', x: 230, y: 50 },
  { label: 'Executive', color: '#10b981', x: 130, y: 100 },
  { label: 'System Pallet', color: '#f59e0b', x: 30, y: 150 },
  { label: 'Custom Pallets', color: '#f59e0b', x: 130, y: 150 },
  { label: 'Block Processing', color: '#ef4444', x: 230, y: 150 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 2, to: 4 }, { from: 4, to: 5 }, { from: 4, to: 6 }, { from: 4, to: 7 },
];

const STEPS = [
  { label: '런타임 아키텍처', body: 'Client가 WASM/Native 런타임을 호출하고, Executive가 팔렛을 조율합니다.' },
  { label: 'WASM vs Native', body: 'WASM 런타임은 온체인 업그레이드 가능, Native는 성능 최적화용입니다.' },
  { label: 'Executive & 팔렛', body: 'Executive가 블록 처리를 조율하고, 각 팔렛이 상태를 변경합니다.' },
];

const VN: number[][] = [[0,1,2,3,4,5,6,7],[0,1,2,3],[4,5,6,7]];
const VE: number[][] = [[0,1,2,3,4,5,6],[0,1,2],[3,4,5,6]];
const BW = 85, BH = 28;
const mid = (i: number) => ({ x: NODES[i].x+BW/2, y: NODES[i].y+BH/2 });

export default function RuntimeConfigViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
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
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
