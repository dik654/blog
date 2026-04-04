import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Relay Chain', color: '#e11d48', x: 105, y: 5 },
  { label: 'Validator 1', color: '#8b5cf6', x: 5, y: 55 },
  { label: 'Validator 2', color: '#8b5cf6', x: 105, y: 55 },
  { label: 'Validator 3', color: '#8b5cf6', x: 205, y: 55 },
  { label: 'Para A', color: '#10b981', x: 5, y: 110 },
  { label: 'Para B', color: '#f59e0b', x: 105, y: 110 },
  { label: 'Para C', color: '#0ea5e9', x: 205, y: 110 },
  { label: 'Collator', color: '#6b7280', x: 55, y: 155 },
  { label: 'Collator', color: '#6b7280', x: 155, y: 155 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 1, to: 4 }, { from: 2, to: 5 }, { from: 3, to: 6 },
  { from: 4, to: 7 }, { from: 5, to: 8 },
];

const STEPS = [
  { label: '릴레이 체인 구조', body: '릴레이 체인이 검증자를 관리하고, 각 검증자가 파라체인을 검증합니다.' },
  { label: '검증자 배정', body: '검증자가 랜덤으로 파라체인에 배정되어 PoV 블록을 검증합니다.' },
  { label: '콜레이터 → 파라체인', body: '콜레이터가 트랜잭션을 수집하여 PoV 블록을 생성하고 릴레이 체인에 제출합니다.' },
];

const VN: number[][] = [[0,1,2,3,4,5,6,7,8],[0,1,2,3],[4,5,6,7,8]];
const VE: number[][] = [[0,1,2,3,4,5,6,7],[0,1,2,3,4,5],[6,7]];
const BW = 72, BH = 28;
const mid = (i: number) => ({ x: NODES[i].x+BW/2, y: NODES[i].y+BH/2 });

export default function RelayChainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 430 195" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1.2} strokeDasharray="4 3"
                animate={{ opacity: VE[step].includes(i) ? 0.7 : 0.06 }} />
            );
          })}
          {NODES.map((n, i) => (
            <motion.g key={n.label + i} animate={{ opacity: VN[step].includes(i) ? 1 : 0.1 }}>
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
