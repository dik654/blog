import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Fork ID 없음: 비호환 피어로 슬롯 낭비' },
  { label: 'Fork ID 적용: 슬롯 100% 호환' },
  { label: 'Homestead/Merge: 블록 번호 기반' },
  { label: 'Shanghai/Cancun: 타임스탬프 기반' },
];
const ANNOT = ['50개 슬롯 중 15개 비호환 (30% 낭비)', 'ENR 필터링 → 50/50 호환 (100% 효율)', 'block 기반: 1,150,000 → 17,034,870', 'timestamp 기반: 1,681,338,455 → 1,710,338,135'];
const OK_C = '#10b981', BAD_C = '#ef4444', EMPTY_C = '#6b7280';

export default function PeerSlotViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {(step === 0 || step === 1) && (() => {
            const ok = step === 0 ? 30 : 40;
            const bad = step === 0 ? 15 : 0;
            const empty = 50 - ok - bad;
            const cols = 10, size = 28, gap = 4, ox = 55;
            return (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {Array.from({ length: 50 }).map((_, i) => {
                  const c = i < ok ? OK_C : i < ok + bad ? BAD_C : EMPTY_C;
                  const col = i % cols, row = Math.floor(i / cols);
                  return (
                    <motion.rect key={i}
                      x={ox + col * (size + gap)} y={10 + row * (size + gap)}
                      width={size} height={size} rx={4}
                      fill={c + '20'} stroke={c} strokeWidth={1} strokeOpacity={0.5}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: i * 0.008 }} />
                  );
                })}
                <g transform="translate(0, 135)">
                  {[{ l: `호환 ${ok}`, c: OK_C }, { l: `비호환 ${bad}`, c: BAD_C }, { l: `빈 ${empty}`, c: EMPTY_C }].map((s, i) => (
                    <g key={s.l}>
                      <rect x={80 + i * 100} y={0} width={8} height={8} rx={2} fill={s.c} fillOpacity={0.5} />
                      <text x={92 + i * 100} y={8} fontSize={9} fill={s.c}>{s.l}</text>
                    </g>
                  ))}
                </g>
              </motion.g>
            );
          })()}
          {(step === 2 || step === 3) && (() => {
            const forks = step === 2
              ? [{ n: 'Homestead', v: '1,150,000', c: '#6366f1' }, { n: 'The Merge', v: '17,034,870', c: '#f59e0b' }]
              : [{ n: 'Shanghai', v: '1,681,338,455', c: '#10b981' }, { n: 'Cancun', v: '1,710,338,135', c: '#8b5cf6' }];
            const ty = step === 2 ? 'block' : 'timestamp';
            return (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={200} y={20} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.35}>
                  포크 시점 방식: {ty}
                </text>
                {forks.map((f, i) => (
                  <motion.g key={f.n} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15 }}>
                    <rect x={50 + i * 170} y={40} width={140} height={60} rx={8}
                      fill={f.c + '12'} stroke={f.c} strokeWidth={1.5} />
                    <text x={120 + i * 170} y={62} textAnchor="middle" fontSize={11} fontWeight={600} fill={f.c}>{f.n}</text>
                    <text x={120 + i * 170} y={82} textAnchor="middle" fontSize={9} fill={f.c} fillOpacity={0.6}>{f.v}</text>
                  </motion.g>
                ))}
                <motion.line x1={190} y1={70} x2={220} y2={70}
                  stroke="currentColor" strokeOpacity={0.15} strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              </motion.g>
            );
          })()}
                  <motion.text x={405} y={75} fontSize={9} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
