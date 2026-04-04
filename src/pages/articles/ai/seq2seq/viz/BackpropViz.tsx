import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, FWD_C, LOSS_C, BPTT_C } from './BackpropVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function BackpropViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="bp-fwd" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill={FWD_C} />
            </marker>
            <marker id="bp-back" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill={BPTT_C} />
            </marker>
          </defs>
          {/* Encoder */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp}>
            <rect x={20} y={45} width={100} height={35} rx={6}
              fill={FWD_C + '12'} stroke={FWD_C} strokeWidth={1.5} />
            <text x={70} y={60} textAnchor="middle" fontSize={11}
              fill={FWD_C} fontWeight={600}>Encoder</text>
            <text x={70} y={72} textAnchor="middle" fontSize={11} fill={FWD_C}>
              Thank, you
            </text>
          </motion.g>
          {/* Forward arrow */}
          <motion.line x1={120} y1={62} x2={155} y2={62}
            stroke={FWD_C} strokeWidth={1.5} markerEnd="url(#bp-fwd)"
            animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp} />
          {/* Context */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp}>
            <rect x={155} y={48} width={55} height={28} rx={8}
              fill={BPTT_C + '18'} stroke={BPTT_C} strokeWidth={1.5} />
            <text x={182} y={66} textAnchor="middle" fontSize={11}
              fill={BPTT_C} fontWeight={600}>context</text>
          </motion.g>
          {/* Forward arrow 2 */}
          <motion.line x1={210} y1={62} x2={245} y2={62}
            stroke={FWD_C} strokeWidth={1.5} markerEnd="url(#bp-fwd)"
            animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp} />
          {/* Decoder */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp}>
            <rect x={245} y={45} width={100} height={35} rx={6}
              fill={'#10b981' + '12'} stroke="#10b981" strokeWidth={1.5} />
            <text x={295} y={60} textAnchor="middle" fontSize={11}
              fill="#10b981" fontWeight={600}>Decoder</text>
            <text x={295} y={72} textAnchor="middle" fontSize={11} fill="#10b981">
              → 고마워
            </text>
          </motion.g>
          {/* Softmax + Loss */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={345} y1={62} x2={375} y2={62}
                stroke={LOSS_C} strokeWidth={1.5} markerEnd="url(#bp-fwd)" />
              <rect x={375} y={45} width={90} height={35} rx={6}
                fill={LOSS_C + '10'} stroke={LOSS_C} strokeWidth={1.5} />
              <text x={420} y={59} textAnchor="middle" fontSize={11}
                fill={LOSS_C} fontWeight={600}>Softmax</text>
              <text x={420} y={72} textAnchor="middle" fontSize={11} fill={LOSS_C}>
                Cross-Entropy
              </text>
            </motion.g>
          )}
          {/* Teacher Forcing label */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={245} y={95} width={100} height={22} rx={4}
                fill="#10b981" fillOpacity={0.08} stroke="#10b981"
                strokeWidth={1} strokeDasharray="4 2" />
              <text x={295} y={110} textAnchor="middle" fontSize={11}
                fill="#10b981" fontWeight={600}>정답 "고마워" 주입</text>
              <line x1={295} y1={95} x2={295} y2={80}
                stroke="#10b981" strokeWidth={1} strokeDasharray="3 2" />
            </motion.g>
          )}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={375} y1={38} x2={345} y2={38} stroke={BPTT_C} strokeWidth={1.5} markerEnd="url(#bp-back)" />
              <line x1={245} y1={38} x2={210} y2={38} stroke={BPTT_C} strokeWidth={1.5} markerEnd="url(#bp-back)" />
              <line x1={155} y1={38} x2={120} y2={38} stroke={BPTT_C} strokeWidth={1.5} markerEnd="url(#bp-back)" />
              <text x={250} y={28} textAnchor="middle" fontSize={11}
                fill={BPTT_C} fontWeight={600}>← 역전파 (BPTT)</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
