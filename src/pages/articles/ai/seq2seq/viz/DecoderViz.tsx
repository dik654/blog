import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, H_VEC_4, PROB_DIST, DEC_C, CTX_C, SOFT_C } from './DecoderVizData';
import { DecoderDefs, AutoregressiveStep } from './DecoderVizParts';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
function fmtV(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(', ')}]`; }
const BAR_W = 50;

export default function DecoderViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <DecoderDefs decC={DEC_C} softC={SOFT_C} />
          {/* Context vector */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp}>
            <rect x={10} y={38} width={68} height={40} rx={8}
              fill={CTX_C + '20'} stroke={CTX_C} strokeWidth={1.5} />
            <text x={44} y={53} textAnchor="middle" fontSize={10}
              fill={CTX_C} fontWeight={600}>context</text>
            <text x={44} y={68} textAnchor="middle" fontSize={9} fill={CTX_C}>[0.5, 0.6]</text>
          </motion.g>
          {/* First LSTM cell */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp}>
            <line x1={78} y1={58} x2={106} y2={58}
              stroke={CTX_C} strokeWidth={1.5} strokeDasharray="4 2" />
            <rect x={106} y={36} width={72} height={44} rx={6}
              fill={DEC_C + '15'} stroke={DEC_C} strokeWidth={1.5} />
            <text x={142} y={52} textAnchor="middle" fontSize={10}
              fill={DEC_C} fontWeight={600}>LSTM</text>
            <text x={142} y={68} textAnchor="middle" fontSize={9} fill={DEC_C}>
              h₄={fmtV(H_VEC_4)}
            </text>
            <text x={142} y={100} textAnchor="middle" fontSize={10} fill={DEC_C}>EOS</text>
            <line x1={142} y1={92} x2={142} y2={80}
              stroke={DEC_C} strokeWidth={1} markerEnd="url(#dec-arr)" />
          </motion.g>
          {/* Softmax with probability bars */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={178} y1={58} x2={204} y2={58}
                stroke={DEC_C} strokeWidth={1.5} markerEnd="url(#dec-arr)" />
              <text x={244} y={28} textAnchor="middle" fontSize={10}
                fill={SOFT_C} fontWeight={600}>Softmax P(w)</text>
              {PROB_DIST.map((d, i) => (
                <g key={`p-${i}`}>
                  <text x={204} y={44 + i * 18} fontSize={9} fill={SOFT_C}>{d.word}</text>
                  <motion.rect x={234} y={35 + i * 18} height={12} rx={2}
                    fill={i === 0 ? SOFT_C + '40' : SOFT_C + '18'}
                    stroke={SOFT_C} strokeWidth={i === 0 ? 1 : 0.5}
                    initial={{ width: 0 }}
                    animate={{ width: d.prob * BAR_W / 0.72 }}
                    transition={{ ...sp, delay: i * 0.08 }} />
                  <text x={238 + d.prob * BAR_W / 0.72 + 2} y={44 + i * 18}
                    fontSize={9} fill={SOFT_C} fontWeight={i === 0 ? 600 : 400}>
                    {d.prob.toFixed(2)}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
          {/* Output "고마워" */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              <line x1={295} y1={58} x2={320} y2={58}
                stroke={SOFT_C} strokeWidth={1.5} markerEnd="url(#dec-arr-p)" />
              <rect x={320} y={42} width={60} height={32} rx={5}
                fill={DEC_C + '18'} stroke={DEC_C} strokeWidth={1.5} />
              <text x={350} y={56} textAnchor="middle" fontSize={10}
                fill={DEC_C} fontWeight={600}>고마워</text>
              <text x={350} y={68} textAnchor="middle" fontSize={9}
                fill={DEC_C} opacity={0.7}>P=0.72</text>
            </motion.g>
          )}
          {step >= 3 && <AutoregressiveStep />}
        </svg>
      )}
    </StepViz>
  );
}
