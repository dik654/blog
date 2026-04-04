import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '제네시스 해시', body: 'Mainnet genesis = 0xd4e56740…cb8fa3 (Keccak-256)' },
  { label: '포크 목록 수집', body: 'Homestead(1,150,000), Byzantium(4,370,000), …, Cancun(1,710,338,135)' },
  { label: 'CRC32 체크섬', body: 'CRC32(genesis) ⊕ CRC32(1150000) ⊕ … = 0xfc64ec04' },
  { label: 'Fork ID 비교', body: '로컬 0xfc64ec04/0 vs 피어 fork_hash/fork_next 비교' },
  { label: '연결 판정', body: 'hash 일치 + next 호환 → 연결 허용. 불일치 → 즉시 거부.' },
];

const ANNOT = ['0xd4e567…cb8fa3', 'Homestead → Cancun (14 forks)', '0xfc64ec04 (XOR 체인)', 'local vs remote 비교', '일치 → 허용 / 불일치 → 거부'];
/* 레이아웃: Genesis → Forks → CRC32 → Compare ─┬─ Accept
                                                  └─ Reject */
const NODES = [
  { label: '제네시스 해시', sub: '체인 식별', color: '#6366f1', x: 4, y: 30 },
  { label: '포크 목록', sub: '블록/타임스탬프', color: '#3b82f6', x: 120, y: 30 },
  { label: 'CRC32', sub: 'XOR 체인', color: '#10b981', x: 236, y: 30 },
  { label: 'Fork ID 비교', sub: 'hash+next', color: '#f59e0b', x: 352, y: 30 },
  { label: '연결 허용', sub: '호환 피어', color: '#22c55e', x: 478, y: 6 },
  { label: '연결 거부', sub: '비호환 피어', color: '#ef4444', x: 478, y: 58 },
];

const ARROWS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5]];

const ACTIVE: number[][] = [
  [0], [0, 1], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4, 5],
];

export default function ForkIDValidationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 680 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="fv-arr" viewBox="0 0 6 6" refX={5} refY={3}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M0 0L6 3L0 6z" fill="#888" />
            </marker>
          </defs>
          {ARROWS.map(([a, b], i) => {
            const na = NODES[a], nb = NODES[b];
            const on = ACTIVE[step].includes(a) && ACTIVE[step].includes(b);
            return (
              <motion.line key={i}
                x1={na.x + 100} y1={na.y + 18} x2={nb.x - 2} y2={nb.y + 18}
                stroke="#888" strokeWidth={1.5} markerEnd="url(#fv-arr)"
                animate={{ opacity: on ? 0.8 : 0.1 }} />
            );
          })}
          {NODES.map((n, i) => {
            const on = ACTIVE[step].includes(i);
            return (
              <g key={i}>
                <motion.rect x={n.x} y={n.y} width={98} height={36} rx={7}
                  fill={n.color} animate={{ opacity: on ? 1 : 0.1 }}
                  transition={{ duration: 0.3 }} />
                <text x={n.x + 49} y={n.y + 15} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill="white"
                  style={{ opacity: on ? 1 : 0.2 }}>{n.label}</text>
                <text x={n.x + 49} y={n.y + 28} textAnchor="middle"
                  fontSize={10} fill="white" opacity={0.6}
                  style={{ opacity: on ? 0.8 : 0.15 }}>{n.sub}</text>
              </g>
            );
          })}
                  <motion.text x={585} y={50} fontSize={9} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
