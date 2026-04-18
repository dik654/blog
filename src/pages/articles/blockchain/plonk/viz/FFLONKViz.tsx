import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { homo: '#6366f1', comb: '#10b981', batch: '#f59e0b', cmp: '#8b5cf6' };

const STEPS = [
  { label: 'KZG 가법 동형성 활용', body: 'commit(f)+commit(g)=commit(f+g). PLONK의 9개 G1 점을 동형성으로 합쳐 축소.' },
  { label: 'Combined Polynomial h(x)', body: 'nu로 7개 다항식을 하나의 h(x)로 결합. 기존 커밋 재사용하여 새 커밋 불필요.' },
  { label: 'Batch Opening -- 단일 증명', body: 'PLONK은 2개 opening이 필요하지만 FFLONK은 평가점을 내재화하여 단일 W로 축소.' },
  { label: 'PLONK vs FFLONK 비교', body: 'FFLONK: G1x4 커밋, 1개 opening, ~700B 증명, ~20% gas 절감. Polygon zkEVM에서 채택.' },
];

/* PLONK boxes */
const PLONK_ITEMS = ['[a]', '[b]', '[c]', '[Z]', '[tl]', '[tm]', '[th]', 'Wz', 'Wzw'];

export default function FFLONKViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Show PLONK's 9 G1 points */}
          <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.homo}>
            PLONK: 9 G1 points
          </text>
          {PLONK_ITEMS.map((item, i) => {
            const x = 20 + (i % 5) * 88;
            const y = 24 + Math.floor(i / 5) * 28;
            const merging = step >= 1 && i < 7;
            return (
              <motion.g key={item}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: merging ? 0.3 : step >= 0 ? 0.9 : 0.15,
                  x: merging ? (220 - x) * 0.3 : 0,
                  y: merging ? (50 - y) * 0.2 : 0,
                }}
                transition={sp}>
                <rect x={x} y={y} width={78} height={22} rx={4}
                  fill={step === 0 ? `${C.homo}15` : `${C.homo}06`}
                  stroke={C.homo} strokeWidth={step === 0 ? 1 : 0.4} />
                <text x={x + 39} y={y + 14} textAnchor="middle"
                  fontSize={8.5} fontWeight={500} fill={C.homo}>{item}</text>
              </motion.g>
            );
          })}

          {/* Step 1: Combined h(x) */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }} transition={sp}>
              <motion.rect x={160} y={88} width={160} height={34} rx={6}
                animate={{
                  fill: step === 1 ? `${C.comb}18` : `${C.comb}08`,
                  stroke: C.comb,
                  strokeWidth: step === 1 ? 2 : 0.6,
                }}
                transition={sp} />
              <text x={240} y={103} textAnchor="middle"
                fontSize={10} fontWeight={700} fill={C.comb}>h(x) = f1 + nu*f2 + ...</text>
              <text x={240} y={116} textAnchor="middle"
                fontSize={8} fill={C.comb} opacity={0.6}>7 polys combined</text>
              {/* Arrow from top */}
              <line x1={240} y1={78} x2={240} y2={87} stroke={C.comb} strokeWidth={0.8} />
              <polygon points="237,85 243,85 240,89" fill={C.comb} />
            </motion.g>
          )}

          {/* Step 2: Single opening */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }} transition={sp}>
              {/* PLONK: 2 openings */}
              <rect x={30} y={132} width={110} height={28} rx={5}
                fill={`${C.batch}08`} stroke={C.batch} strokeWidth={0.5}
                strokeDasharray="3 2" />
              <text x={85} y={145} textAnchor="middle"
                fontSize={8} fill={C.batch} opacity={0.5}>PLONK: W_z + W_zw</text>
              <text x={85} y={156} textAnchor="middle"
                fontSize={7.5} fill={C.batch} opacity={0.4}>2 openings</text>

              {/* Arrow */}
              <line x1={145} y1={146} x2={185} y2={146} stroke={C.batch} strokeWidth={0.8} />
              <polygon points="183,143 183,149 187,146" fill={C.batch} />

              {/* FFLONK: 1 opening */}
              <motion.rect x={190} y={132} width={130} height={28} rx={5}
                animate={{
                  fill: step === 2 ? `${C.batch}18` : `${C.batch}08`,
                  stroke: C.batch,
                  strokeWidth: step === 2 ? 1.5 : 0.6,
                }}
                transition={sp} />
              <text x={255} y={145} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={C.batch}>FFLONK: single W</text>
              <text x={255} y={156} textAnchor="middle"
                fontSize={7.5} fill={C.batch} opacity={0.6}>1 opening proof</text>
            </motion.g>
          )}

          {/* Step 3: Comparison table */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ ...sp, delay: 0.1 }}>
              {/* Comparison box */}
              <motion.rect x={340} y={88} width={130} height={80} rx={6}
                animate={{
                  fill: `${C.cmp}08`,
                  stroke: C.cmp,
                  strokeWidth: step === 3 ? 1.5 : 0.5,
                }}
                transition={sp} />
              <text x={405} y={102} textAnchor="middle"
                fontSize={8} fontWeight={700} fill={C.cmp}>PLONK vs FFLONK</text>
              {/* Table rows */}
              {[
                { k: 'Commits', p: 'G1x9', f: 'G1x4' },
                { k: 'Opens', p: '2', f: '1' },
                { k: 'Proof', p: '~900B', f: '~700B' },
                { k: 'Gas', p: 'high', f: '-20%' },
              ].map((row, i) => (
                <g key={row.k}>
                  <text x={355} y={116 + i * 13} fontSize={7} fill={C.cmp} opacity={0.5}>{row.k}</text>
                  <text x={398} y={116 + i * 13} fontSize={7} fill={C.cmp} opacity={0.4}>{row.p}</text>
                  <text x={440} y={116 + i * 13} fontSize={7.5} fontWeight={600} fill={C.cmp}>{row.f}</text>
                </g>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
