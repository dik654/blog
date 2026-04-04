import { motion } from 'framer-motion';
import { C } from './ValidationVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

/* ── Step 0: 높이 + 타임스탬프 — 통과/거부 예시 ── */
export function StepSync() {
  const cases = [
    { parent: 5, current: 6, drift: 1, pass: true },
    { parent: 5, current: 13, drift: 8, pass: false },
  ];
  return (
    <g>
      <text x={210} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.sync}>
        높이 연속성 + 미래 블록 거부
      </text>
      {cases.map((c, i) => {
        const y = 28 + i * 50;
        const color = c.pass ? '#10b981' : '#ef4444';
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.3 }}>
            <rect x={20} y={y} width={75} height={36} rx={5} fill={`${color}10`} stroke={color} strokeWidth={1} />
            <text x={57} y={y + 15} textAnchor="middle" fontSize={10} fill={color}>부모</text>
            <text x={57} y={y + 30} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>h={c.parent}</text>

            <text x={112} y={y + 22} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">+{c.drift} →</text>

            <rect x={140} y={y} width={75} height={36} rx={5} fill={`${color}10`} stroke={color} strokeWidth={1} />
            <text x={177} y={y + 15} textAnchor="middle" fontSize={10} fill={color}>현재</text>
            <text x={177} y={y + 30} textAnchor="middle" fontSize={12} fontWeight={700} fill={color}>h={c.current}</text>

            <rect x={235} y={y + 4} width={70} height={26} rx={5}
              fill={c.pass ? '#10b98120' : '#ef444420'} stroke={color} strokeWidth={1.5} />
            <text x={270} y={y + 22} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>
              {c.pass ? '✓ 통과' : '✗ 거부'}
            </text>

            {!c.pass && (
              <text x={320} y={y + 22} fontSize={10} fill="#ef4444">drift {c.drift} {'>'} 허용 5</text>
            )}
          </motion.g>
        );
      })}
    </g>
  );
}

/* ── Step 1: 6개 병렬 검증 — Gantt 차트 ── */
export function StepAsync() {
  const checks = [
    { label: 'miner', w: 50, start: 0, color: C.miner },
    { label: 'winner', w: 70, start: 0, color: C.vrf },
    { label: 'sig', w: 30, start: 5, color: C.sig },
    { label: 'beacon', w: 40, start: 5, color: C.beacon },
    { label: 'ticket', w: 35, start: 8, color: C.vrf },
    { label: 'WinPoSt', w: 100, start: 0, color: C.post },
  ];
  const scale = 3.2;
  return (
    <g>
      <text x={220} y={14} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
        6개 goroutine 동시 실행 (30초 제한)
      </text>
      <line x1={70} y1={26} x2={410} y2={26} stroke="var(--muted-foreground)" strokeWidth={0.5} />
      <text x={70} y={24} fontSize={9} fill="var(--muted-foreground)">0s</text>
      <text x={410} y={24} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">30s</text>

      {checks.map((c, i) => {
        const y = 32 + i * 16;
        const x = 70 + c.start * scale;
        const w = c.w * scale;
        return (
          <motion.g key={c.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06, ...sp }}>
            <text x={65} y={y + 10} textAnchor="end" fontSize={10} fill={c.color} fontWeight={500}>{c.label}</text>
            <motion.rect x={x} y={y} width={w} height={12} rx={3}
              fill={`${c.color}35`} stroke={c.color} strokeWidth={0.8}
              initial={{ width: 0 }} animate={{ width: w }}
              transition={{ delay: i * 0.06 + 0.2, duration: 0.3 }} />
          </motion.g>
        );
      })}
      <motion.text x={220} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        WinPoSt가 가장 오래 걸려 전체 병목
      </motion.text>
    </g>
  );
}
