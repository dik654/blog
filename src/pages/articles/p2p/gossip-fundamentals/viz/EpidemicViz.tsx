import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '라운드 0: 감염 시작', body: '팬아웃 f=2로 이웃에게 전달 시작' },
  { label: '라운드 1: 첫 번째 전파', body: '감염 노드가 각각 f=2개 이웃에게 전달' },
  { label: '라운드 2: 기하급수적 확산', body: 'O(log N) 라운드에 전체 전파' },
  { label: '라운드 3: 전체 전파 완료', body: '중복 수신은 무시(deduplicate)' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { x: 200, y: 20 },
  { x: 100, y: 60 }, { x: 300, y: 60 },
  { x: 50, y: 110 }, { x: 150, y: 110 }, { x: 250, y: 110 }, { x: 350, y: 110 },
];

const INFECTED = [
  [0],
  [0, 1, 2],
  [0, 1, 2, 3, 4, 5, 6],
  [0, 1, 2, 3, 4, 5, 6],
];

const EDGES = [
  [[0, 1], [0, 2]],
  [[1, 3], [1, 4], [2, 5], [2, 6]],
  [],
  [],
];

export default function EpidemicViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Edges from previous rounds */}
          {EDGES.slice(0, step + 1).flat().map(([from, to], i) => {
            const f = NODES[from], t = NODES[to];
            return (
              <motion.line key={i} x1={f.x} y1={f.y + 10} x2={t.x} y2={t.y}
                stroke="#6366f1" strokeWidth={1} strokeOpacity={0.4}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }} />
            );
          })}
          {/* Nodes */}
          {NODES.map((n, i) => {
            const infected = INFECTED[step].includes(i);
            return (
              <motion.g key={i}
                animate={{ scale: infected ? 1 : 0.8, opacity: infected ? 1 : 0.3 }}
                style={{ transformOrigin: `${n.x}px ${n.y + 10}px` }}
                transition={sp}>
                <circle cx={n.x} cy={n.y + 10} r={14}
                  fill={infected ? '#6366f120' : '#64748b08'}
                  stroke={infected ? '#6366f1' : '#64748b'} strokeWidth={1.3} />
                {infected && (
                  <motion.circle cx={n.x} cy={n.y + 10} r={5} fill="#6366f1"
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.3 }} />
                )}
              </motion.g>
            );
          })}
          {/* Round label */}
          <text x={410} y={25} textAnchor="end" fontSize={10} fill="var(--foreground)" opacity={0.5}>
            감염: {INFECTED[step].length}/{NODES.length}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
