import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { WORDS, FREQS, PROBS, STEPS, BODY, NEG_WORDS, POS_C, NEG_C, CTR_C } from './NegSamplingData';

export default function NegSamplingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* center word */}
          <rect x={160} y={10} width={80} height={28} rx={6} fill={CTR_C + '18'} stroke={CTR_C} strokeWidth={1.5} />
          <text x={200} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={CTR_C}>king</text>
          {/* positive pair */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <rect x={300} y={10} width={80} height={28} rx={6} fill={POS_C + '18'} stroke={POS_C} strokeWidth={1.5} />
            <text x={340} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={POS_C}>queen</text>
            <text x={340} y={50} textAnchor="middle" fontSize={9} fill={POS_C}>+1 positive</text>
            <motion.line key={`pos-${step}`} x1={240} y1={24} x2={300} y2={24}
              stroke={POS_C} strokeWidth={1.5} strokeOpacity={0.6}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
          </motion.g>
          {/* frequency bars with actual probability values */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {WORDS.map((w, i) => {
                const bx = 12 + i * 51, h = PROBS[i] * 130;
                return (
                  <g key={w}>
                    <motion.rect x={bx} y={80 - h} width={42} height={h} rx={3}
                      fill="#f59e0b" fillOpacity={0.3} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                      style={{ transformOrigin: `${bx + 21}px 80px` }} transition={{ delay: i * 0.05 }} />
                    <text x={bx + 21} y={80 - h - 3} textAnchor="middle" fontSize={7}
                      fill="#f59e0b" fontWeight={600}>{PROBS[i].toFixed(3)}</text>
                    <text x={bx + 21} y={92} textAnchor="middle" fontSize={8} fill="currentColor" fillOpacity={0.4}>{w}</text>
                    <text x={bx + 21} y={101} textAnchor="middle" fontSize={7} fill="currentColor" fillOpacity={0.3}>f={FREQS[i]}</text>
                  </g>
                );
              })}
              <text x={210} y={112} textAnchor="middle" fontSize={9} fill="#f59e0b">P(w) = f(w)^0.75 / Σf^0.75</text>
            </motion.g>
          )}
          {/* negative samples */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              {NEG_WORDS.map((w, i) => (
                <motion.g key={w} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}>
                  <rect x={20 + i * 95} y={120} width={82} height={24} rx={5}
                    fill={NEG_C + '12'} stroke={NEG_C} strokeWidth={1} />
                  <text x={61 + i * 95} y={136} textAnchor="middle" fontSize={9} fill={NEG_C} fontWeight={600}>{w}</text>
                </motion.g>
              ))}
              <text x={200} y={158} textAnchor="middle" fontSize={9} fill={NEG_C}>-1 negative x 4</text>
            </motion.g>
          )}
          {/* update arrows with loss computation */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2, 3].map(i => (
                <motion.line key={i} x1={61 + i * 95} y1={120} x2={200} y2={40}
                  stroke={NEG_C} strokeWidth={1} strokeOpacity={0.3} strokeDasharray="4 3"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.08 }} />
              ))}
              <rect x={125} y={46} width={150} height={38} rx={4} fill="#80808008" stroke="#555" strokeWidth={0.5} />
              <text x={200} y={60} textAnchor="middle" fontSize={8} fill={POS_C} fontWeight={600}>
                +: σ(v_queen·v_king) = 0.82
              </text>
              <text x={200} y={72} textAnchor="middle" fontSize={8} fill={NEG_C} fontWeight={600}>
                -: σ(-v_man·v_king) = 0.71
              </text>
              <text x={200} y={82} textAnchor="middle" fontSize={7} fill="currentColor" fillOpacity={0.4}>
                L = -log(0.82) - Σlog(0.71) = 1.57
              </text>
            </motion.g>
          )}
          {/* inline body */}
          <motion.text x={410} y={85} fontSize={9} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
