import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

/* Queue positions */
const Q = [
  { label: 'waiting', color: '#f59e0b', x: 10, y: 20, w: 90 },
  { label: 'running', color: '#10b981', x: 130, y: 20, w: 90 },
  { label: 'swapped', color: '#8b5cf6', x: 130, y: 90, w: 90 },
];
/* Request dots: {qIdx, slot} per step — shows which queue each request is in */
const REQS = [
  [{ q: 0, s: 0 }, { q: 0, s: 1 }, { q: 0, s: 2 }], // step0: all waiting
  [{ q: 1, s: 0 }, { q: 1, s: 1 }, { q: 0, s: 0 }], // step1: 2 promoted to running
  [{ q: 1, s: 0 }, { q: 2, s: 0 }, { q: 1, s: 1 }], // step2: 1 swapped out
  [{ q: 1, s: 0 }, { q: 1, s: 1 }, { q: 1, s: 2 }], // step3: all running
  [{ q: -1, s: 0 }, { q: 1, s: 0 }, { q: 1, s: 1 }], // step4: 1 completed
];
const RC = ['#3b82f6', '#ef4444', '#6366f1'];
const reqPos = (q: number, s: number) => {
  if (q < 0) return { x: 300, y: 40 }; // completed (offscreen right)
  const qd = Q[q];
  return { x: qd.x + 15 + s * 26, y: qd.y + 30 };
};

const STEPS = [
  { label: '요청 도착 → waiting 큐' },
  { label: 'Budget 확인 → running 승격' },
  { label: '메모리 부족 → swapped' },
  { label: 'GPU 여유 → running 복귀' },
  { label: '요청 완료 → 큐 제거' },
];
const BODY = [
  '새 요청 3개 FIFO 대기',
  'token_budget 여유분 → running 이동',
  'KV Cache 부족 시 CPU 스왑',
  'swapped → running 복귀',
  '완료 요청 제거 → 응답 반환',
];

export default function SchedulerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Queue boxes */}
          {Q.map((q, i) => (
            <g key={q.label}>
              <rect x={q.x} y={q.y} width={q.w} height={50} rx={6}
                fill={`${q.color}0a`} stroke={q.color} strokeWidth={1.2} />
              <text x={q.x + q.w / 2} y={q.y + 12} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={q.color}>{q.label}</text>
              {/* Arrow labels */}
              {i === 0 && <text x={118} y={50} fontSize={10} fill="var(--muted-foreground)">→</text>}
            </g>
          ))}
          {/* Swap arrows */}
          <text x={225} y={82} fontSize={9} fill="var(--muted-foreground)">↕ swap</text>
          {/* Completed label */}
          {step === 4 && (
            <motion.text x={280} y={44} fontSize={9} fontWeight={600} fill="#10b981"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>완료 ✓</motion.text>
          )}
          {/* Request dots */}
          {REQS[step].map((r, i) => {
            const p = reqPos(r.q, r.s);
            return (
              <motion.circle key={i} r={8}
                animate={{ cx: p.x, cy: p.y, opacity: r.q < 0 ? 0.3 : 1 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                fill={`${RC[i]}30`} stroke={RC[i]} strokeWidth={1.5} />
            );
          })}
          {REQS[step].map((r, i) => {
            const p = reqPos(r.q, r.s);
            return (
              <motion.text key={`l${i}`} animate={{ x: p.x, y: p.y + 3 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                textAnchor="middle" fontSize={9} fontWeight={600} fill={RC[i]}>
                R{i + 1}
              </motion.text>
            );
          })}
          {/* inline body */}
          <motion.text x={330} y={70} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
