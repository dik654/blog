import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, INPUT_WORDS, VOCAB, PROBS } from './LanguageModelVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const RNN_C = '#6366f1';
const PRED_C = '#10b981';
const HI_C = '#f59e0b';

export default function LanguageModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="lm-arr" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill={RNN_C} />
            </marker>
          </defs>
          {/* Input words → RNN cells */}
          {INPUT_WORDS.map((w, i) => {
            const cx = 60 + i * 120;
            return (
              <motion.g key={i} animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp}>
                <rect x={cx - 30} y={70} width={60} height={36} rx={6}
                  fill={RNN_C + '18'} stroke={RNN_C} strokeWidth={1.5} />
                <text x={cx} y={92} textAnchor="middle" fontSize={9} fill={RNN_C} fontWeight={600}>RNN</text>
                <text x={cx} y={125} textAnchor="middle" fontSize={9} fill={HI_C}>{w}</text>
                {/* hidden state arrow */}
                {i < INPUT_WORDS.length - 1 && (
                  <line x1={cx + 30} y1={88} x2={cx + 90} y2={88}
                    stroke={RNN_C} strokeWidth={1.5} markerEnd="url(#lm-arr)" />
                )}
                {step >= 1 && (
                  <motion.text x={cx} y={64} textAnchor="middle" fontSize={9} fill={PRED_C} fontWeight={600}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    h_{i + 1}
                  </motion.text>
                )}
              </motion.g>
            );
          })}
          {/* Prediction bars */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={210} y1={88} x2={270} y2={88}
                stroke={PRED_C} strokeWidth={1.5} strokeDasharray="4 2" />
              <text x={305} y={30} fontSize={9} fill="#666" fontWeight={600}>P(w_t+1)</text>
              {VOCAB.map((w, i) => {
                const y = 38 + i * 22;
                const barW = PROBS[i] * 160;
                const isTop = step >= 3 && i === 0;
                return (
                  <motion.g key={w} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.06 }}>
                    <text x={290} y={y + 10} textAnchor="end" fontSize={9}
                      fill={isTop ? PRED_C : '#666'} fontWeight={isTop ? 700 : 400}>{w}</text>
                    <rect x={295} y={y} width={160} height={14} rx={3}
                      fill="#80808008" stroke="#55555550" strokeWidth={0.5} />
                    <motion.rect x={295} y={y} width={barW} height={14} rx={3}
                      fill={isTop ? PRED_C + '60' : RNN_C + '25'}
                      stroke={isTop ? PRED_C : 'none'} strokeWidth={isTop ? 1.5 : 0}
                      initial={{ width: 0 }} animate={{ width: barW }}
                      transition={{ duration: 0.4, delay: i * 0.06 }} />
                    <text x={300 + barW} y={y + 10} fontSize={9}
                      fill={isTop ? PRED_C : '#999'}>{PROBS[i].toFixed(2)}</text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
