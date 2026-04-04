import { motion } from 'framer-motion';
import { HIDDEN_C, INPUT_C, RNN_C } from './RNNUnrollVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const hVals = [
  { label: 'h₀', vals: [0.00, 0.00], desc: '초기 상태' },
  { label: 'h₁', vals: [0.76, -0.33], desc: '"나는" 반영' },
  { label: 'h₂', vals: [0.41, 0.89], desc: '"학교에" 누적' },
  { label: 'h₃', vals: [-0.22, 0.95], desc: '"간다" 누적' },
];

/** Step 3: actual hidden state values flowing through time */
export function HiddenValueFlow() {
  return (
    <g>
      <text x={240} y={16} textAnchor="middle" fontSize={10}
        fill="#999">h = tanh(W_h · h + W_x · x) — 실제 값 변화</text>

      {hVals.map((h, i) => {
        const cx = 40 + i * 118;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.18 }}>
            {/* h vector box */}
            <rect x={cx} y={36} width={90} height={56} rx={7}
              fill={HIDDEN_C + '12'} stroke={HIDDEN_C}
              strokeWidth={i === 0 ? 1 : 1.5} />
            <text x={cx + 45} y={52} textAnchor="middle" fontSize={10}
              fill={HIDDEN_C} fontWeight={700}>{h.label}</text>
            {/* Actual values */}
            <text x={cx + 45} y={68} textAnchor="middle" fontSize={11}
              fill={HIDDEN_C} fontFamily="monospace">
              [{h.vals[0].toFixed(2)}, {h.vals[1].toFixed(2)}]
            </text>
            <text x={cx + 45} y={82} textAnchor="middle" fontSize={8}
              fill="#999">{h.desc}</text>

            {/* Arrow to next */}
            {i < 3 && (
              <motion.line x1={cx + 90} y1={64} x2={cx + 118} y2={64}
                stroke={HIDDEN_C} strokeWidth={1.5}
                markerEnd="url(#arr-hv)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.18 + 0.15 }} />
            )}
          </motion.g>
        );
      })}

      {/* Input tokens below */}
      {['나는', '학교에', '간다'].map((tok, i) => {
        const cx = 158 + i * 118;
        return (
          <motion.g key={`in-${i}`} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.18 + 0.1 }}>
            <line x1={cx} y1={105} x2={cx} y2={92}
              stroke={INPUT_C} strokeWidth={1} strokeDasharray="3 2" />
            <text x={cx} y={118} textAnchor="middle" fontSize={10}
              fill={INPUT_C} fontWeight={500}>{tok}</text>
          </motion.g>
        );
      })}

      {/* Computation example */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        <rect x={70} y={130} width={340} height={46} rx={6}
          fill={RNN_C + '08'} stroke={RNN_C} strokeWidth={1} />
        <text x={240} y={148} textAnchor="middle" fontSize={9}
          fill={RNN_C} fontWeight={600}>
          h₁ = tanh(W_h·[0, 0] + W_x·embed("나는"))
        </text>
        <text x={240} y={164} textAnchor="middle" fontSize={9}
          fill={RNN_C}>
          = tanh([1.02, -0.34]) = [0.76, -0.33]
        </text>
      </motion.g>

      <defs>
        <marker id="arr-hv" viewBox="0 0 10 10" refX={9} refY={5}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill={HIDDEN_C} />
        </marker>
      </defs>
    </g>
  );
}
