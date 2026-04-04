import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, LAYERS } from './SystemPromptData';

const W = 440, H = 240;
const LW = 300, LH = 32;
const LX = (W - LW) / 2;

export default function SystemPromptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* layer stack */}
          {LAYERS.map((l, i) => {
            const active = step === i;
            const done = step > i;
            const op = active ? 1 : done ? 0.6 : 0.2;
            return (
              <motion.g key={l.label}
                animate={{ opacity: op }}
                transition={{ duration: 0.3 }}>
                {/* background rect */}
                <rect x={LX} y={l.y} width={LW} height={LH} rx={5}
                  fill={active ? `${l.color}20` : `${l.color}08`}
                  stroke={l.color} strokeWidth={active ? 2 : 1} />
                {/* left bar (ActionBox style) */}
                <rect x={LX} y={l.y} width={4} height={LH} rx={2}
                  fill={l.color} opacity={active ? 1 : 0.3} />
                {/* label */}
                <text x={LX + 16} y={l.y + 20} fontSize={10}
                  fontWeight={600} fill={active ? l.color : 'var(--foreground)'}>
                  {l.label}
                </text>
                {/* short desc */}
                {active && (
                  <motion.text x={LX + LW - 10} y={l.y + 20}
                    textAnchor="end" fontSize={9}
                    fill="var(--muted-foreground)"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
                    {['페르소나 설정', 'MUST / NEVER', 'JSON·Markdown', '입출력 쌍 2~3개', '안전 제약'][i]}
                  </motion.text>
                )}
              </motion.g>
            );
          })}

          {/* active indicator dot */}
          <motion.circle r={4}
            animate={{
              cx: LX - 12,
              cy: LAYERS[step].y + LH / 2,
            }}
            transition={{ type: 'spring', bounce: 0.3 }}
            fill={LAYERS[step].color}
            style={{ filter: `drop-shadow(0 0 4px ${LAYERS[step].color}88)` }} />
        </svg>
      )}
    </StepViz>
  );
}
