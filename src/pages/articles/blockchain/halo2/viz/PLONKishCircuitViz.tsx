import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { COLS, MID, BOTTOM, STEP_ACTIVE, BODIES, STEPS } from './PLONKishCircuitData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export default function PLONKishCircuitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const actSet = new Set(STEP_ACTIVE[step] ?? []);
        const isActive = (l: string) => actSet.has(l);
        const all = [...COLS.map(c => ({ ...c, y: 26 })), ...MID, ...BOTTOM];
        return (
          <svg viewBox="0 0 460 144" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {COLS.map(c => (
              <motion.line key={`e-${c.label}`}
                x1={c.x} y1={41} x2={170} y2={55}
                stroke="var(--muted-foreground)" strokeWidth={1}
                animate={{ opacity: isActive(c.label) && isActive('Gate') ? 0.4 : 0.08 }}
                transition={sp} />
            ))}
            {['Gate', '복사 제약', 'Plookup'].map((l, i) => {
              const src = all.find(n => n.label === l)!;
              return (
                <motion.line key={`h-${i}`}
                  x1={src.x + 28} y1={src.y} x2={290 - 36} y2={94}
                  stroke="var(--muted-foreground)" strokeWidth={1}
                  animate={{ opacity: isActive(l) && isActive('h(X)') ? 0.4 : 0.08 }}
                  transition={sp} />
              );
            })}
            {all.map(n => {
              const a = isActive(n.label);
              return (
                <g key={n.label}>
                  <motion.rect x={n.x - 36} y={n.y - 15} width={72} height={30} rx={4}
                    animate={{
                      fill: a ? `${n.color}12` : `${n.color}04`,
                      stroke: n.color, strokeWidth: a ? 1.5 : 1,
                      opacity: a ? 1 : 0.18,
                    }} transition={sp} />
                  <motion.text x={n.x} y={n.y - 3} textAnchor="middle" fontSize={9.5}
                    fontWeight={500}
                    animate={{ fill: n.color, opacity: a ? 1 : 0.18 }} transition={sp}>
                    {n.label}
                  </motion.text>
                  <motion.text x={n.x} y={n.y + 10} textAnchor="middle" fontSize={8.5}
                    animate={{ fill: n.color, opacity: a ? 0.5 : 0.1 }} transition={sp}>
                    {n.sub}
                  </motion.text>
                </g>
              );
            })}
                    <motion.text x={344} y={20} fontSize={9.5} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>
            {BODIES[step]?.match(/.{1,24}(\s|$)/g)?.map((line, i) => (
              <tspan key={i} x={344} dy={i === 0 ? 0 : 12}>{line.trim()}</tspan>
            ))}
          </motion.text>
        </svg>
        );
      }}
    </StepViz>
  );
}
