import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '실전 회로 패턴', body: 'Poseidon 해시, Merkle 증명, 범위 검사 등 프로덕션 ZK 회로 빌딩 블록' },
  { label: 'Poseidon 해시', body: 'ZK 친화적 해시 함수. Full → Partial → Full 라운드 구조로 제약 수를 최소화합니다.' },
  { label: 'Merkle Proof', body: 'Poseidon을 반복 적용하여 리프에서 루트까지 경로를 검증합니다.' },
];

const BOXES = [
  { label: 'Poseidon', color: '#8b5cf6', x: 20, y: 30 },
  { label: 'MerkleProof', color: '#10b981', x: 120, y: 10 },
  { label: 'Semaphore', color: '#f59e0b', x: 120, y: 55 },
  { label: 'Tornado', color: '#ef4444', x: 220, y: 30 },
];

const EDGES = [[0,1],[0,2],[1,3],[2,3]];
const BW = 80, BH = 28;
const mid = (i: number) => ({ x: BOXES[i].x+BW/2, y: BOXES[i].y+BH/2 });
const VN: number[][] = [[0,1,2,3],[0],[0,1]];

export default function CircuitExampleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map(([f,t], i) => {
            const a = mid(f), b = mid(t);
            const vis = VN[step].includes(f) && VN[step].includes(t);
            return (
              <motion.line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke="#666" strokeWidth={1.2} strokeDasharray="4 3"
                animate={{ opacity: vis ? 0.6 : 0.06 }} />
            );
          })}
          {BOXES.map((b, i) => (
            <motion.g key={b.label} animate={{ opacity: VN[step].includes(i) ? 1 : 0.12 }}>
              <rect x={b.x} y={b.y} width={BW} height={BH} rx={6}
                fill={`${b.color}12`} stroke={b.color} strokeWidth={1.5} />
              <text x={b.x+BW/2} y={b.y+BH/2+4} textAnchor="middle"
                fontSize={8} fontWeight={600} fill={b.color}>{b.label}</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
