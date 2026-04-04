import { motion } from 'framer-motion';
import { RNN_C, HIDDEN_C, INPUT_C } from './RNNUnrollVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const OUT_C = '#8b5cf6';

/** Step 0: folded RNN cell diagram */
export function FoldedCellView() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={175} y={80} width={100} height={55} rx={8}
        fill={RNN_C + '18'} stroke={RNN_C} strokeWidth={2} />
      <text x={225} y={103} textAnchor="middle" fontSize={13} fill={RNN_C} fontWeight={700}>
        tanh
      </text>
      <text x={225} y={118} textAnchor="middle" fontSize={10} fill={RNN_C}>
        h = tanh(Wh·h + Wx·x)
      </text>

      <line x1={225} y1={165} x2={225} y2={135} stroke={INPUT_C} strokeWidth={2}
        markerEnd="url(#arr-i)" />
      <rect x={195} y={168} width={60} height={26} rx={5}
        fill={INPUT_C + '15'} stroke={INPUT_C} strokeWidth={1} />
      <text x={225} y={185} textAnchor="middle" fontSize={12} fill={INPUT_C}
        fontWeight={600}>x_t</text>

      <line x1={225} y1={80} x2={225} y2={50} stroke={OUT_C} strokeWidth={2}
        markerEnd="url(#arr-o)" />
      <rect x={195} y={20} width={60} height={26} rx={5}
        fill={OUT_C + '15'} stroke={OUT_C} strokeWidth={1} />
      <text x={225} y={37} textAnchor="middle" fontSize={12} fill={OUT_C}
        fontWeight={600}>y_t</text>

      <line x1={100} y1={107} x2={175} y2={107} stroke={HIDDEN_C} strokeWidth={2}
        markerEnd="url(#arr-h)" />
      <text x={90} y={112} textAnchor="end" fontSize={11} fill={HIDDEN_C}
        fontWeight={600}>h_{'{t-1}'}</text>

      <line x1={275} y1={107} x2={350} y2={107} stroke={HIDDEN_C} strokeWidth={2}
        markerEnd="url(#arr-h)" />
      <text x={360} y={112} fontSize={11} fill={HIDDEN_C} fontWeight={600}>h_t</text>

      <path d="M350,107 Q380,107 380,80 Q380,55 340,55 Q300,55 300,72"
        fill="none" stroke={HIDDEN_C} strokeWidth={1.5} strokeDasharray="4 2"
        markerEnd="url(#arr-h)" />
      <text x={385} y={78} fontSize={10} fill={HIDDEN_C}>순환</text>

      <text x={225} y={210} textAnchor="middle" fontSize={10}
        fill="var(--muted-foreground)">
        h가 다음 시간 단계의 자기 자신에게 전달
      </text>
    </motion.g>
  );
}
