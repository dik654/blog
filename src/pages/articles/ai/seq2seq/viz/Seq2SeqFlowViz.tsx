import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, ENC_WORDS, DEC_WORDS, ENC_C, DEC_C, CTX_C } from './Seq2SeqFlowVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function Seq2SeqFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="s2s-arr" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill={ENC_C} />
            </marker>
            <marker id="s2s-arr-d" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill={DEC_C} />
            </marker>
          </defs>
          {/* Input words */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp}>
            <text x={10} y={14} fontSize={11} fill={ENC_C} fontWeight={600}>입력 (영어)</text>
            {ENC_WORDS.map((w, i) => {
              const cx = 20 + i * 70;
              return (
                <g key={`in-${i}`}>
                  <rect x={cx} y={22} width={65} height={28} rx={5}
                    fill={ENC_C + '15'} stroke={ENC_C} strokeWidth={1.5} />
                  <text x={cx + 27} y={38} textAnchor="middle" fontSize={11}
                    fill={ENC_C} fontWeight={500}>{w}</text>
                </g>
              );
            })}
          </motion.g>
          {/* Encoder block */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={20} y={60} width={190} height={30} rx={6}
                fill={ENC_C + '10'} stroke={ENC_C} strokeWidth={1.5} />
              <text x={115} y={79} textAnchor="middle" fontSize={11}
                fill={ENC_C} fontWeight={600}>Encoder (LSTM)</text>
              <line x1={115} y1={46} x2={115} y2={60}
                stroke={ENC_C} strokeWidth={1} markerEnd="url(#s2s-arr)" />
            </motion.g>
          )}
          {/* Context vector */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
              <rect x={222} y={52} width={85} height={42} rx={10}
                fill={CTX_C + '20'} stroke={CTX_C} strokeWidth={2} />
              <text x={264} y={70} textAnchor="middle" fontSize={12}
                fill={CTX_C} fontWeight={700}>context</text>
              <text x={264} y={86} textAnchor="middle" fontSize={10} fill={CTX_C}>고정 벡터</text>
              <line x1={210} y1={75} x2={230} y2={75}
                stroke={CTX_C} strokeWidth={1.5} strokeDasharray="4 2" />
            </motion.g>
          )}
          {/* Decoder block */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
              <rect x={310} y={60} width={130} height={30} rx={6}
                fill={DEC_C + '10'} stroke={DEC_C} strokeWidth={1.5} />
              <text x={375} y={79} textAnchor="middle" fontSize={11}
                fill={DEC_C} fontWeight={600}>Decoder (LSTM)</text>
              <line x1={290} y1={75} x2={310} y2={75}
                stroke={CTX_C} strokeWidth={1.5} strokeDasharray="4 2" />
            </motion.g>
          )}
          {/* Output words */}
          {step >= 2 && DEC_WORDS.map((w, i) => {
            const cx = 330 + i * 70;
            return (
              <motion.g key={`out-${i}`} initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.15 }}>
                <rect x={cx} y={104} width={65} height={28} rx={5}
                  fill={DEC_C + '15'} stroke={DEC_C} strokeWidth={1.5} />
                <text x={cx + 27} y={120} textAnchor="middle" fontSize={11}
                  fill={DEC_C} fontWeight={500}>{w}</text>
              </motion.g>
            );
          })}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={310} y={102} fontSize={11} fill={DEC_C} fontWeight={600}>출력 (한국어)</text>
              <line x1={375} y1={90} x2={375} y2={104}
                stroke={DEC_C} strokeWidth={1} markerEnd="url(#s2s-arr-d)" />
            </motion.g>
          )}
          {step >= 3 && (
            <motion.rect x={15} y={18} width={480} height={118} rx={10} fill="none"
              stroke="#94a3b8" strokeWidth={1} strokeDasharray="6 3"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
