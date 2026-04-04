import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, TOKENS, RNN_C, HIDDEN_C, INPUT_C } from './RNNUnrollVizData';
import { FoldedCellView } from './RNNFoldedCell';
import { HiddenValueFlow } from './RNNUnrollVizParts';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const OUT_C = '#8b5cf6';

export default function RNNUnrollViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arr-h" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill={HIDDEN_C} />
            </marker>
            <marker id="arr-i" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill={INPUT_C} />
            </marker>
            <marker id="arr-o" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill={OUT_C} />
            </marker>
          </defs>

          {step === 0 && <FoldedCellView />}
          {(step === 1 || step === 2) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {TOKENS.map((tok, i) => {
                const cx = 90 + i * 150;
                return (
                  <motion.g key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.12 }}>
                    <rect x={cx - 35} y={85} width={70} height={44} rx={6}
                      fill={RNN_C + '18'} stroke={RNN_C} strokeWidth={step >= 2 ? 2 : 1.5} />
                    <text x={cx} y={112} textAnchor="middle" fontSize={11} fill={RNN_C} fontWeight={600}>RNN</text>
                    <line x1={cx} y1={160} x2={cx} y2={129} stroke={INPUT_C} strokeWidth={1.5} markerEnd="url(#arr-i)" />
                    <text x={cx} y={174} textAnchor="middle" fontSize={11} fill={INPUT_C} fontWeight={500}>{tok}</text>
                    <text x={cx} y={188} textAnchor="middle" fontSize={10} fill="#999">x_{i + 1}</text>
                    <line x1={cx} y1={85} x2={cx} y2={55} stroke={OUT_C} strokeWidth={1.5} markerEnd="url(#arr-o)" />
                    <text x={cx} y={46} textAnchor="middle" fontSize={11} fill={OUT_C} fontWeight={500}>y_{i + 1}</text>
                    {i < 2 && (
                      <line x1={cx + 35} y1={107} x2={cx + 115} y2={107}
                        stroke={HIDDEN_C} strokeWidth={2} markerEnd="url(#arr-h)" />
                    )}
                    <text x={cx} y={80} textAnchor="middle" fontSize={10} fill={HIDDEN_C} fontWeight={600}>
                      h_{i + 1}
                    </text>
                  </motion.g>
                );
              })}
              <text x={25} y={112} textAnchor="middle" fontSize={10} fill={HIDDEN_C}>h_0</text>
              <line x1={38} y1={107} x2={55} y2={107} stroke={HIDDEN_C} strokeWidth={1.5} markerEnd="url(#arr-h)" />
              {step >= 2 && (
                <motion.text x={240} y={210} textAnchor="middle" fontSize={11} fill={RNN_C} fontWeight={600}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  W_h, W_x — 모든 시간 단계에서 동일 가중치 공유
                </motion.text>
              )}
            </motion.g>
          )}
          {step === 3 && <HiddenValueFlow />}
        </svg>
      )}
    </StepViz>
  );
}
