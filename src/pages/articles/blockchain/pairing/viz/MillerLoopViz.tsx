import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { NAF, DB, AD, CR, BODIES, STEPS } from './MillerLoopData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export default function MillerLoopViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 105" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* NAF bit cells */}
          <text x={8} y={18} fontSize={9} fill="var(--muted-foreground)">NAF</text>
          {NAF.map((b, i) => {
            const x = 30 + i * 26;
            const c = b === 1 ? AD : b === -1 ? '#ef4444' : '#6b7280';
            return (
              <motion.g key={i}>
                <motion.rect x={x} y={8} width={22} height={16} rx={2}
                  animate={{
                    fill: b !== 0 ? `${c}15` : `${c}06`,
                    stroke: c, strokeWidth: step === 0 ? 1.2 : 0.5,
                  }} transition={{ ...sp, delay: step === 0 ? i * 0.03 : 0 }} />
                <text x={x + 11} y={19} textAnchor="middle" fontSize={9} fontWeight={b !== 0 ? 600 : 400}
                  fill={c}>{b === 1 ? '+1' : b === -1 ? '-1' : '0'}</text>
              </motion.g>
            );
          })}
          <text x={345} y={18} fontSize={9} fill="var(--muted-foreground)">…</text>
          {/* Doubling arrows — every bit */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.1 }} transition={sp}>
            <text x={8} y={42} fontSize={9} fill={DB} fontWeight={600}>dbl</text>
            {NAF.map((_, i) => {
              const x = 30 + i * 26;
              return (
                <motion.g key={`d${i}`}>
                  <rect x={x + 2} y={32} width={18} height={12} rx={2}
                    fill={step === 1 ? `${DB}20` : `${DB}0a`} stroke={DB} strokeWidth={0.5} />
                  <text x={x + 11} y={41} textAnchor="middle" fontSize={9} fill={DB}>f²·l</text>
                </motion.g>
              );
            })}
          </motion.g>
          {/* Addition arrows — only nonzero bits */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.1 }} transition={sp}>
            <text x={8} y={60} fontSize={9} fill={AD} fontWeight={600}>add</text>
            {NAF.map((b, i) => {
              if (b === 0) return null;
              const x = 30 + i * 26;
              const c = b === 1 ? AD : '#ef4444';
              return (
                <motion.g key={`a${i}`}>
                  <rect x={x + 2} y={50} width={18} height={12} rx={2}
                    fill={`${c}20`} stroke={c} strokeWidth={0.5} />
                  <text x={x + 11} y={59} textAnchor="middle" fontSize={9} fill={c}>
                    {b === 1 ? '+Q' : '-Q'}
                  </text>
                </motion.g>
              );
            })}
          </motion.g>
          <motion.g animate={{ opacity: step >= 1 ? 0.7 : 0 }} transition={sp}>
            <text x={30} y={74} fontSize={9} fill={DB}>Doublings: {NAF.length}+… (매 비트)</text>
            <text x={200} y={74} fontSize={9} fill={AD}>Additions: {NAF.filter(b => b !== 0).length}/12 (비영)</text>
          </motion.g>
          {/* BN correction */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={60} y={82} width={240} height={20} rx={4} fill={`${CR}12`} stroke={CR} strokeWidth={0.7} />
              <text x={180} y={95} textAnchor="middle" fontSize={9} fill={CR} fontWeight={600}>
                + π(Q) addition + π²(Q) addition → Optimal Ate 보정
              </text>
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
