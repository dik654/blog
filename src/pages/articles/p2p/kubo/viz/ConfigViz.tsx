import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CONFIG_STEPS, CONFIG_SECTIONS } from '../ConfigData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const CW = 120, CH = 28, COLS = 2;

export default function ConfigViz() {
  return (
    <StepViz steps={CONFIG_STEPS}>
      {(step) => (
        <svg viewBox="-45 0 400 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Central config node */}
          <rect x={110} y={3} width={90} height={24} rx={5}
            fill="#6b728012" stroke="#6b7280" strokeWidth={1.5} />
          <text x={155} y={19} textAnchor="middle"
            fontSize={10} fontWeight={600} fill="#6b7280">config.json</text>
          {CONFIG_SECTIONS.map((s, i) => {
            const col = i % COLS, row = Math.floor(i / COLS);
            const x = col === 0 ? 10 : 180;
            const y = 40 + row * (CH + 6);
            const highlight = step === 0 ||
              (step === 1 && (s.key === 'Addresses' || s.key === 'Bootstrap' || s.key === 'Swarm')) ||
              (step === 2 && s.key === 'Datastore') ||
              (step === 3);
            return (
              <motion.g key={s.key} animate={{ opacity: highlight ? 1 : 0.15 }} transition={sp}>
                <rect x={x} y={y} width={CW} height={CH} rx={5}
                  fill={`${s.color}12`} stroke={s.color} strokeWidth={1.2} />
                <text x={x + CW / 2} y={y + 12} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={s.color}>{s.key}</text>
                <text x={x + CW / 2} y={y + 23} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{s.desc}</text>
                <line x1={155} y1={27} x2={x + CW / 2} y2={y}
                  stroke={s.color} strokeWidth={0.6} strokeDasharray="3 2" opacity={0.4} />
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
