import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { PERF_STEPS, BARS, PIPPENGER_BOXES, PARALLEL_ROWS, MEM_ROWS, GPU_ROWS } from './PerformanceVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export default function PerformanceViz() {
  return (
    <StepViz steps={PERF_STEPS}>
      {(step) => (
        <svg viewBox="-30 0 400 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={170} y={12} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">Prove 시간 분포 (2^16 제약)</text>
          {BARS.map((b, i) => {
            const x0 = BARS.slice(0, i).reduce((s, p) => s + p.pct * 3, 20);
            const w = b.pct * 3;
            const active = step === 3 || (step === 0 && i === 2);
            return (
              <g key={b.label}>
                <motion.rect x={x0} y={22} width={w} height={24}
                  rx={i === 0 || i === 2 ? 4 : 0}
                  animate={{ fill: active ? `${b.color}40` : `${b.color}18`,
                    stroke: b.color, strokeWidth: active ? 1.5 : 0.5 }}
                  transition={sp} />
                <text x={x0 + w / 2} y={35} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={b.color}>{b.label}</text>
                <text x={x0 + w / 2} y={43} textAnchor="middle" fontSize={9}
                  fill={b.color} opacity={0.6}>{b.pct}%</text>
              </g>
            );
          })}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {PIPPENGER_BOXES.map((t, i) => (
                <g key={t}>
                  <rect x={40 + i * 100} y={58} width={80} height={16} rx={3}
                    fill="#f59e0b10" stroke="#f59e0b" strokeWidth={0.8} />
                  <text x={80 + i * 100} y={69} textAnchor="middle" fontSize={9}
                    fill="#f59e0b">{t}</text>
                  {i < 2 && <line x1={120 + i * 100} y1={66} x2={140 + i * 100} y2={66}
                    stroke="#f59e0b" strokeWidth={0.5} />}
                </g>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {PARALLEL_ROWS.map((r) => (
                <g key={r.l}>
                  <rect x={60} y={r.y} width={100} height={12} rx={3}
                    fill={`${r.c}15`} stroke={r.c} strokeWidth={0.8} />
                  <text x={110} y={r.y + 9} textAnchor="middle" fontSize={9} fill={r.c}>{r.l}</text>
                </g>
              ))}
              <text x={40} y={68} textAnchor="middle" fontSize={9} fill="#8b5cf6">rayon::join</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {MEM_ROWS.map((r) => (
                <g key={r.l}>
                  <rect x={r.x} y={60} width={100} height={16} rx={3}
                    fill={`${r.c}15`} stroke={r.c} strokeWidth={0.8} />
                  <text x={r.x + 50} y={71} textAnchor="middle" fontSize={9} fill={r.c}>{r.l}</text>
                </g>
              ))}
              <text x={170} y={68} textAnchor="middle" fontSize={9} fill="#8b5cf6">{'\u2192'}</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {GPU_ROWS.map((r, i) => (
                <g key={r.l}>
                  <rect x={80} y={58 + i * 18} width={r.w} height={12} rx={3}
                    fill={`${r.c}25`} stroke={r.c} strokeWidth={0.8} />
                  <text x={80 + r.w / 2} y={67 + i * 18} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={r.c}>{r.l}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
