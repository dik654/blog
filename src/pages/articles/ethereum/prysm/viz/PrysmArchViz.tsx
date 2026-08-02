import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { MODS, ROUTES, STEPS, ANNOT, ACTIVE } from './PrysmArchVizData';

const BW = 110, BH = 44;
const mid = (i: number) => ({ x: MODS[i].x + BW / 2, y: MODS[i].y + BH / 2 });

export default function PrysmArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 750 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {ROUTES.map((r, i) => {
            const f = mid(r.from), t = mid(r.to);
            const show = ACTIVE[step].includes(i);
            const routedAroundDb = i === 7;
            const labelX = routedAroundDb ? 258 : (f.x + t.x) / 2;
            const labelY = routedAroundDb ? 190 : (f.y + t.y) / 2 - 2;
            return (
              <motion.g key={i} animate={{ opacity: show ? 1 : 0.08 }}>
                {routedAroundDb ? (
                  <path d={`M ${f.x} ${f.y} C 185 188, 330 188, ${t.x} ${t.y}`}
                    fill="none" stroke="#666" strokeWidth={1.2} strokeDasharray="4 3" />
                ) : (
                  <line x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                    stroke="#666" strokeWidth={1.2} strokeDasharray="4 3" />
                )}
                <rect x={labelX - 24} y={labelY - 9}
                  width={48} height={14} rx={2} fill="var(--card)" />
                <text x={labelX} y={labelY}
                  textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  {r.label}
                </text>
                {show && (
                  <motion.circle initial={false} r={2.5} fill={MODS[r.from].color}
                    animate={{ cx: [f.x, t.x], cy: [f.y, t.y] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }} />
                )}
              </motion.g>
            );
          })}
          {MODS.map((m) => (
            <g key={m.id}>
              <rect x={m.x} y={m.y} width={BW} height={BH} rx={6} fill="var(--card)" />
              <rect x={m.x} y={m.y} width={BW} height={BH} rx={6}
                fill={`${m.color}12`} stroke={m.color} strokeWidth={1.5} />
              <text x={m.x + BW / 2} y={m.y + BH / 2 - 3}
                textAnchor="middle" fontSize={10} fontWeight="700" fill={m.color}>
                {m.label}
              </text>
              <text x={m.x + BW / 2} y={m.y + BH / 2 + 10}
                textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                {m.desc}
              </text>
            </g>
          ))}
          <motion.text x={650} y={135} fontSize={9} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>
            {ANNOT[step]}
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
