import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DB, AD, VT, TW, BITS, BODIES, STEPS } from './MillerRecursionData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export default function MillerRecursionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* NAF bits */}
          {BITS.map((b, i) => {
            const x = 30 + i * 38;
            const isNonZero = b !== 0;
            return (
              <motion.g key={i} animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp}>
                <motion.rect x={x} y={8} width={30} height={18} rx={3}
                  animate={{
                    fill: isNonZero ? `${AD}18` : `${DB}08`,
                    stroke: isNonZero ? AD : DB,
                    strokeWidth: step === 0 ? 1.2 : 0.5,
                  }} transition={sp} />
                <text x={x + 15} y={20} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={isNonZero ? AD : '#6b7280'}>{b === 1 ? '+1' : '0'}</text>
              </motion.g>
            );
          })}
          <text x={340} y={20} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">…</text>
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.12 }} transition={sp}>
            <text x={12} y={46} fontSize={9} fill={DB} fontWeight={600}>Double</text>
            {BITS.map((_, i) => (
              <motion.rect key={`d${i}`} x={34 + i * 38} y={34} width={22} height={14} rx={2}
                animate={{ fill: step === 1 ? `${DB}22` : `${DB}0c`, stroke: DB, strokeWidth: step === 1 ? 1.3 : 0.4 }}
                transition={{ ...sp, delay: i * 0.04 }} />
            ))}
            {BITS.map((_, i) => (
              <text key={`dt${i}`} x={45 + i * 38} y={44} textAnchor="middle" fontSize={9} fill={DB}>f²·l</text>
            ))}
          </motion.g>
          {/* Addition row (only for nonzero bits) */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.12 }} transition={sp}>
            <text x={12} y={64} fontSize={9} fill={AD} fontWeight={600}>Add</text>
            {BITS.map((b, i) => {
              const x = 30 + i * 38;
              if (b === 0) return null;
              return (
                <motion.g key={`a${i}`}>
                  <motion.rect x={x + 4} y={52} width={22} height={14} rx={2}
                    animate={{ fill: `${AD}22`, stroke: AD, strokeWidth: step === 2 ? 1.3 : 0.4 }}
                    transition={{ ...sp, delay: 0.1 }} />
                  <text x={x + 15} y={62} textAnchor="middle" fontSize={9} fill={AD}>f·l</text>
                </motion.g>
              );
            })}
          </motion.g>
          {/* Accumulator arrow */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp}>
              <line x1={30} y1={72} x2={330} y2={72} stroke="var(--border)" strokeWidth={0.6} />
              <rect x={145} y={63} width={70} height={9} rx={2} fill="var(--card)" />
              <text x={180} y={70} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                f 누적 → Fp12 결과
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={30} y={82} width={140} height={16} rx={4} fill={`${TW}12`} stroke={TW} strokeWidth={0.7} />
              <text x={100} y={93} textAnchor="middle" fontSize={9} fill={TW} fontWeight={600}>Sextic Twist: G2→Fp2</text>
              <rect x={190} y={82} width={140} height={16} rx={4} fill={`${VT}12`} stroke={VT} strokeWidth={0.7} />
              <text x={260} y={93} textAnchor="middle" fontSize={9} fill={VT} fontWeight={600}>수직선 → Final Exp 소거</text>
            </motion.g>
          )}
                  <motion.text x={368} y={14} fontSize={9} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>
            {BODIES[step]?.match(/.{1,24}(\s|$)/g)?.map((line, i) => (
              <tspan key={i} x={368} dy={i === 0 ? 0 : 10}>{line.trim()}</tspan>
            ))}
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
