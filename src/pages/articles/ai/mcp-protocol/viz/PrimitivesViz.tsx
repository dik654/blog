import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, PRIMITIVES, PRIM_EXAMPLES } from './PrimitivesData';

const W = 460, H = 260;
const BW = 280, BH = 40;
const BX = (W - BW) / 2;

export default function PrimitivesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PRIMITIVES.map((p, i) => {
            const active = step === i + 1;
            const op = active ? 1 : step === 0 ? 0.7 : step > i + 1 ? 0.5 : 0.15;
            return (
              <motion.g key={p.label} animate={{ opacity: op }}
                transition={{ duration: 0.3 }}>
                <rect x={BX} y={p.y} width={BW} height={BH} rx={6}
                  fill={active ? `${p.color}20` : `${p.color}08`}
                  stroke={p.color} strokeWidth={active ? 2 : 1} />
                <rect x={BX} y={p.y} width={4} height={BH} rx={2}
                  fill={p.color} opacity={active ? 1 : 0.3} />
                <text x={BX + 18} y={p.y + 17} fontSize={11}
                  fontWeight={700} fill={p.color}>{p.label}</text>
                <text x={BX + 18} y={p.y + 32} fontSize={9}
                  fill="var(--muted-foreground)">{p.desc}</text>
                {active && (
                  <motion.text x={BX + BW - 12} y={p.y + 24}
                    textAnchor="end" fontSize={9} fill={p.color}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>
                    {['name + schema + handler', 'URI + MIME type', '템플릿 삽입'][i]}
                  </motion.text>
                )}
              </motion.g>
            );
          })}

          {/* Concrete JSON example panel when active */}
          {step >= 1 && step <= 3 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={BX} y={195} width={BW} height={54} rx={5}
                fill="var(--card)" stroke={PRIMITIVES[step - 1].color}
                strokeWidth={1} />
              <rect x={BX} y={195} width={4} height={54} rx={2}
                fill={PRIMITIVES[step - 1].color} />
              {PRIM_EXAMPLES[step]?.map((line, j) => (
                <text key={j} x={BX + 14} y={210 + j * 14}
                  fontSize={8} fontFamily="monospace"
                  fill="var(--muted-foreground)">{line}</text>
              ))}
            </motion.g>
          )}

          {/* active indicator dot */}
          {step >= 1 && step <= 3 && (
            <motion.circle r={4}
              animate={{
                cx: BX - 12,
                cy: PRIMITIVES[step - 1].y + BH / 2,
              }}
              transition={{ type: 'spring', bounce: 0.3 }}
              fill={PRIMITIVES[step - 1].color}
              style={{ filter: `drop-shadow(0 0 4px ${PRIMITIVES[step - 1].color}88)` }} />
          )}

          {step === 0 && (
            <motion.text x={W / 2} y={210} textAnchor="middle"
              fontSize={9} fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              Server가 노출하는 3종류의 기능 단위
            </motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
