import { motion } from 'framer-motion';
import StepViz from './StepViz';
import { STEPS, ANNOT, STATES, RAIL_Y, DOT_POS } from './ValidatorLifecycleData';

export default function ValidatorLifecycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const dot = DOT_POS[step];
        return (
          <svg viewBox="0 0 600 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <line x1={50} y1={RAIL_Y} x2={400} y2={RAIL_Y} stroke="var(--border)" strokeWidth={1.5} />
            {STATES.slice(0, 5).map((s) => (
              <line key={s.label} x1={s.cx} y1={RAIL_Y + 8} x2={s.cx} y2={s.cy - 22} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 2" />
            ))}
            <line x1={230} y1={122} x2={230} y2={163} stroke="var(--border)" strokeWidth={1.5} strokeDasharray="5 3" />
            <rect x={237} y={137} width={36} height={11} rx={2} fill="var(--card)" />
            <text x={243} y={145} fontSize={9} fill="var(--muted-foreground)">slashed</text>
            <line x1={72} y1={100} x2={118} y2={100} stroke="var(--border)" strokeWidth={1.5} />
            <line x1={162} y1={100} x2={208} y2={100} stroke="var(--border)" strokeWidth={1.5} />
            <line x1={252} y1={100} x2={298} y2={100} stroke="var(--border)" strokeWidth={1.5} />
            <line x1={342} y1={100} x2={378} y2={100} stroke="var(--border)" strokeWidth={1.5} />
            {STATES.map((s, i) => {
              const active = step === i;
              const passed = step > i && i < 5;
              return (
                <g key={s.label}>
                  <motion.circle cx={s.cx} cy={s.cy} r={20}
                    animate={{
                      fill: active ? `${s.color}30` : passed ? `${s.color}15` : 'color-mix(in oklch, var(--muted) 40%, transparent)',
                      stroke: active || passed ? s.color : 'var(--border)',
                      strokeWidth: active ? 2.5 : 1.5
                    }}
                    transition={{ duration: 0.3 }} />
                  <text x={s.cx} y={s.cy - 5} textAnchor="middle" fontSize={9} fontWeight="700"
                    style={{ fill: active ? s.color : 'var(--foreground)' }}>
                    {s.label}
                  </text>
                  <text x={s.cx} y={s.cy + 7} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
                </g>
              );
            })}
            <motion.g
              animate={{ x: dot.x - DOT_POS[0].x, y: dot.y - DOT_POS[0].y }}
              transition={{ duration: 0.55, type: 'spring', bounce: 0.25 }}>
              <circle cx={DOT_POS[0].x} cy={DOT_POS[0].y} r={13}
                fill={STATES[step].color}
                style={{ filter: `drop-shadow(0 0 5px ${STATES[step].color}99)` }} />
              <text x={DOT_POS[0].x} y={DOT_POS[0].y + 4} textAnchor="middle" fontSize={9} fontWeight="800" fill="white">V</text>
            </motion.g>
            {(step === 1 || step === 4) && (
              <motion.text
                x={dot.x} y={dot.y + 28}
                textAnchor="middle" fontSize={9} fontWeight="600"
                fill={STATES[step].color}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {step === 1 ? '⏳ 6.8h' : '⏳ 27h'}
              </motion.text>
            )}
            <motion.text x={455} y={115} fontSize={9} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
