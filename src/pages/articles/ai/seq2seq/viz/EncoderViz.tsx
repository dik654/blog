import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, WORDS, EMB_VECS, H_VECS, CELL_C, EMB_C, CTX_C } from './EncoderVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function fmtVec(v: number[]) { return `[${v.map(n => n.toFixed(1)).join(', ')}]`; }

export default function EncoderViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="enc-arr" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill={CELL_C} />
            </marker>
          </defs>
          {WORDS.map((w, i) => {
            const cx = 60 + i * 150;
            const active = step >= i;
            const isFinal = i === 2 && step >= 2;
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : 0.2 }} transition={sp}>
                {/* Word label */}
                <text x={cx + 30} y={188} textAnchor="middle" fontSize={11}
                  fill={EMB_C} fontWeight={500}>"{w}"</text>
                {/* Embedding vector value */}
                <text x={cx + 30} y={170} textAnchor="middle" fontSize={9}
                  fill={EMB_C} opacity={active ? 0.7 : 0.2}>{fmtVec(EMB_VECS[i])}</text>
                {/* Embedding arrow */}
                <line x1={cx + 30} y1={160} x2={cx + 30} y2={142}
                  stroke={EMB_C} strokeWidth={1} opacity={active ? 0.6 : 0.2} />
                {/* Word2Vec box */}
                <rect x={cx} y={116} width={70} height={26} rx={4}
                  fill={EMB_C + '12'} stroke={EMB_C} strokeWidth={1} />
                <text x={cx + 30} y={132} textAnchor="middle" fontSize={11}
                  fill={EMB_C} fontWeight={500}>Word2Vec</text>
                {/* Arrow to LSTM */}
                <line x1={cx + 30} y1={116} x2={cx + 30} y2={96}
                  stroke={CELL_C} strokeWidth={1} markerEnd="url(#enc-arr)" />
                {/* LSTM cell */}
                <rect x={cx - 5} y={55} width={82} height={42} rx={6}
                  fill={isFinal ? CTX_C + '18' : CELL_C + '15'}
                  stroke={isFinal ? CTX_C : CELL_C} strokeWidth={1.5} />
                <text x={cx + 30} y={70} textAnchor="middle" fontSize={11}
                  fill={isFinal ? CTX_C : CELL_C} fontWeight={600}>LSTM</text>
                {/* Hidden state vector value */}
                <text x={cx + 30} y={86} textAnchor="middle" fontSize={9}
                  fill={isFinal ? CTX_C : CELL_C} fontWeight={500}>
                  h{i + 1}={fmtVec(H_VECS[i])}
                </text>
                {/* Hidden state arrow to next */}
                {i < 2 && (
                  <line x1={cx + 62} y1={76} x2={cx + 145} y2={76}
                    stroke={CELL_C} strokeWidth={1.5} markerEnd="url(#enc-arr)" />
                )}
              </motion.g>
            );
          })}
          {/* Context vector highlight */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }} transition={sp}>
              <rect x={345} y={12} width={120} height={34} rx={8}
                fill={CTX_C + '20'} stroke={CTX_C} strokeWidth={1.5} />
              <text x={405} y={26} textAnchor="middle" fontSize={10}
                fill={CTX_C} fontWeight={600}>컨텍스트 벡터</text>
              <text x={405} y={40} textAnchor="middle" fontSize={10}
                fill={CTX_C}>{fmtVec(H_VECS[2])}</text>
              <line x1={375} y1={46} x2={375} y2={55}
                stroke={CTX_C} strokeWidth={1} strokeDasharray="3 2" />
            </motion.g>
          )}
          {/* 2-layer hint — step 3 only */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={8} y={25} width={44} height={70} rx={4}
                fill="var(--card)" stroke={CELL_C} strokeWidth={1} strokeDasharray="4 2" />
              <text x={30} y={18} textAnchor="middle" fontSize={10} fill="#999">2층</text>
              <text x={30} y={52} textAnchor="middle" fontSize={10} fill={CELL_C}>L1</text>
              <text x={30} y={74} textAnchor="middle" fontSize={10} fill={CELL_C}>L2</text>
            </motion.g>
          )}
          {/* h_0 — step 3 아닐 때만 표시 */}
          {step < 3 && (
            <text x={35} y={80} textAnchor="middle" fontSize={10} fill={CELL_C}>
              h₀=[0, 0]
            </text>
          )}
          <line x1={48} y1={76} x2={55} y2={76}
            stroke={CELL_C} strokeWidth={1} markerEnd="url(#enc-arr)" />
        </svg>
      )}
    </StepViz>
  );
}
