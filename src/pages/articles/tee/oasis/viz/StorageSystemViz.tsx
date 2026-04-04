import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'runtime', label: '런타임', color: '#6366f1', x: 60, y: 20 },
  { id: 'mkvs', label: 'MKVS Tree', color: '#8b5cf6', x: 200, y: 20 },
  { id: 'cache', label: 'In-Memory Cache', color: '#0ea5e9', x: 200, y: 80 },
  { id: 'nodedb', label: 'Node Database', color: '#10b981', x: 200, y: 140 },
  { id: 'badger', label: 'BadgerDB', color: '#f59e0b', x: 340, y: 140 },
  { id: 'checkpoint', label: '체크포인트', color: '#ef4444', x: 340, y: 20 },
];

const EDGES = [
  { from: 0, to: 1, label: 'Get/Insert' },
  { from: 1, to: 2, label: '캐시 조회' },
  { from: 2, to: 3, label: '캐시 미스' },
  { from: 3, to: 4, label: '디스크 I/O' },
  { from: 1, to: 5, label: '스냅샷 생성' },
  { from: 5, to: 3, label: '상태 복원' },
];

const STEPS = [
  { label: 'MKVS 상태 접근' },
  { label: '캐시 & 디스크 저장' },
  { label: '체크포인트 & 복원' },
  { label: '전체 스토리지 계층' },
];

const ANNOT = ['MKVS 상태 Get/Insert', 'LRU 캐시+디스크 저장', '체크포인트 스냅샷+복원', 'Merkle 검증 가능 스토리지'];
const VN = [[0, 1], [1, 2, 3, 4], [1, 3, 5], [0, 1, 2, 3, 4, 5]];
const VE = [[0], [1, 2, 3], [4, 5], [0, 1, 2, 3, 4, 5]];

export default function StorageSystemViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            const mx = (f.x + t.x) / 2, my = (f.y + 15 + t.y + 15) / 2 + 5;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x} y1={f.y + 30} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1} />
                <rect x={mx - 28} y={my - 8} width={56} height={12} rx={2} fill="var(--card)" />
                <text x={mx} y={my} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x - 55} y={n.y} width={110} height={30} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
                  <motion.text x={405} y={85} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
