import { motion } from 'framer-motion';
import { C } from './ForwardFlowVizData';

function MatCell({ x, y, val, color, delay = 0 }: {
  x: number; y: number; val: string; color: string; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>
      <rect x={x} y={y} width={32} height={16} rx={3}
        fill={`${color}15`} stroke={color} strokeWidth={0.8} />
      <text x={x + 16} y={y + 11} textAnchor="middle" fontSize={8} fontWeight="600" fill={color}>
        {val}
      </text>
    </motion.g>
  );
}

function Arrow({ x1, x2, y, label }: { x1: number; x2: number; y: number; label?: string }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <line x1={x1} y1={y} x2={x2 - 5} y2={y} stroke={C.weight} strokeWidth={1.2} />
      <polygon points={`${x2},${y} ${x2 - 6},${y - 3} ${x2 - 6},${y + 3}`} fill={C.weight} />
      {label && (
        <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" fontSize={8} fill={C.weight}>{label}</text>
      )}
    </motion.g>
  );
}

function BracketLabel({ x, y, text, color }: { x: number; y: number; text: string; color: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={9} fontWeight="600" fill={color}>{text}</text>
  );
}

export function ForwardStep0() {
  const baseY = 30;
  return (
    <g>
      {/* X vector */}
      <BracketLabel x={30} y={baseY - 4} text="X" color={C.input} />
      <MatCell x={14} y={baseY} val="0.5" color={C.input} delay={0} />
      <MatCell x={14} y={baseY + 18} val="0.8" color={C.input} delay={0.05} />

      <Arrow x1={48} x2={68} y={baseY + 17} label="×" />

      {/* W1 matrix 2x3 */}
      <BracketLabel x={106} y={baseY - 4} text="W₁ (2×3)" color={C.weight} />
      <MatCell x={70} y={baseY} val="0.3" color={C.weight} delay={0.1} />
      <MatCell x={104} y={baseY} val="0.5" color={C.weight} delay={0.12} />
      <MatCell x={138} y={baseY} val="-0.2" color={C.weight} delay={0.14} />
      <MatCell x={70} y={baseY + 18} val="0.7" color={C.weight} delay={0.16} />
      <MatCell x={104} y={baseY + 18} val="-0.4" color={C.weight} delay={0.18} />
      <MatCell x={138} y={baseY + 18} val="0.6" color={C.weight} delay={0.2} />

      <Arrow x1={172} x2={192} y={baseY + 17} label="+" />

      {/* b1 */}
      <BracketLabel x={208} y={baseY - 4} text="b₁" color={C.weight} />
      <MatCell x={192} y={baseY + 8} val="0.1" color={C.weight} delay={0.25} />

      <Arrow x1={226} x2={246} y={baseY + 17} label="σ" />

      {/* A1 result */}
      <BracketLabel x={266} y={baseY - 4} text="A₁" color={C.hidden} />
      <MatCell x={248} y={baseY} val="0.69" color={C.hidden} delay={0.3} />
      <MatCell x={248} y={baseY + 18} val="0.44" color={C.hidden} delay={0.35} />
      <MatCell x={248} y={baseY + 36} val="0.57" color={C.hidden} delay={0.4} />

      {/* Computation trace */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <rect x={14} y={baseY + 66} width={268} height={36} rx={5}
          fill={`${C.hidden}08`} stroke={C.hidden} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={22} y={baseY + 82} fontSize={8} fill={C.weight}>
          h₁: 0.3×0.5 + 0.7×0.8 + 0.1 = 0.81
        </text>
        <text x={22} y={baseY + 95} fontSize={8} fontWeight="600" fill={C.hidden}>
          σ(0.81) = 1/(1+e⁻⁰·⁸¹) = 0.69
        </text>
      </motion.g>
    </g>
  );
}

export function ForwardStep1() {
  const baseY = 30;
  return (
    <g>
      {/* A1 */}
      <BracketLabel x={30} y={baseY - 4} text="A₁" color={C.hidden} />
      <MatCell x={14} y={baseY} val="0.69" color={C.hidden} delay={0} />
      <MatCell x={14} y={baseY + 18} val="0.44" color={C.hidden} delay={0.05} />
      <MatCell x={14} y={baseY + 36} val="0.57" color={C.hidden} delay={0.1} />

      <Arrow x1={48} x2={72} y={baseY + 26} label="×" />

      {/* W2 matrix 3x2 */}
      <BracketLabel x={106} y={baseY - 4} text="W₂ (3×2)" color={C.weight} />
      <MatCell x={74} y={baseY} val="0.4" color={C.weight} delay={0.12} />
      <MatCell x={108} y={baseY} val="-0.3" color={C.weight} delay={0.14} />
      <MatCell x={74} y={baseY + 18} val="0.2" color={C.weight} delay={0.16} />
      <MatCell x={108} y={baseY + 18} val="0.5" color={C.weight} delay={0.18} />
      <MatCell x={74} y={baseY + 36} val="-0.1" color={C.weight} delay={0.2} />
      <MatCell x={108} y={baseY + 36} val="0.3" color={C.weight} delay={0.22} />

      <Arrow x1={142} x2={166} y={baseY + 26} label="σ" />

      {/* A2 result */}
      <BracketLabel x={182} y={baseY - 4} text="A₂" color={C.hidden} />
      <MatCell x={166} y={baseY + 8} val="0.61" color={C.hidden} delay={0.3} />
      <MatCell x={166} y={baseY + 26} val="0.53" color={C.hidden} delay={0.35} />

      {/* Dimension annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={214} y={baseY + 4} width={72} height={36} rx={5}
          fill={`${C.hidden}08`} stroke={C.hidden} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={222} y={baseY + 20} fontSize={9} fill={C.weight}>3차원 → 2차원</text>
        <text x={222} y={baseY + 34} fontSize={9} fontWeight="600" fill={C.hidden}>특징 압축</text>
      </motion.g>
    </g>
  );
}

export function ForwardStep2() {
  const baseY = 24;
  return (
    <g>
      {/* A2 */}
      <BracketLabel x={30} y={baseY - 4} text="A₂" color={C.hidden} />
      <MatCell x={14} y={baseY} val="0.61" color={C.hidden} delay={0} />
      <MatCell x={14} y={baseY + 18} val="0.53" color={C.hidden} delay={0.05} />

      <Arrow x1={48} x2={68} y={baseY + 17} label="×W₃" />

      {/* Raw output */}
      <BracketLabel x={86} y={baseY - 4} text="Z" color={C.weight} />
      <MatCell x={70} y={baseY} val="1.02" color={C.weight} delay={0.15} />
      <MatCell x={70} y={baseY + 18} val="0.38" color={C.weight} delay={0.2} />

      <Arrow x1={104} x2={128} y={baseY + 17} label="sm" />

      {/* Softmax output */}
      <BracketLabel x={148} y={baseY - 4} text="Y" color={C.output} />
      <MatCell x={130} y={baseY} val="0.65" color={C.output} delay={0.3} />
      <MatCell x={130} y={baseY + 18} val="0.35" color={C.output} delay={0.35} />

      {/* Softmax computation detail */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <rect x={14} y={baseY + 54} width={265} height={56} rx={5}
          fill={`${C.output}08`} stroke={C.output} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={22} y={baseY + 70} fontSize={8} fill={C.weight}>
          e¹·⁰² = 2.77   e⁰·³⁸ = 1.46   합 = 4.23
        </text>
        <text x={22} y={baseY + 84} fontSize={8} fontWeight="600" fill={C.output}>
          y₁ = 2.77 / 4.23 = 0.65
        </text>
        <text x={22} y={baseY + 98} fontSize={8} fontWeight="600" fill={C.output}>
          y₂ = 1.46 / 4.23 = 0.35   (합 = 1.0)
        </text>
      </motion.g>
    </g>
  );
}
