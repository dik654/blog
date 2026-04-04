import { motion } from 'framer-motion';
import Step7bFormula from './Step7bFormula';

const C = { ml: '#ec4899', g1: '#6366f1', g2: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});
const draw = (d: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration: 0.5, delay: d }, opacity: { duration: 0.2, delay: d } },
});

/** ② ℓ(P): geometric picture + formula. T에서 만들고 P에서 평가 */
export default function Step7bLineEval() {
  return (
    <svg viewBox="0 0 540 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={22} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.ml} {...fade(0)}>② 접선은 T에서 만들고, P에서 평가한다</motion.text>

      {/* Left: geometric picture */}
      {/* Tangent line through T */}
      <motion.line x1={20} y1={160} x2={220} y2={60}
        stroke={C.ml} strokeWidth={1} strokeDasharray="5 3" {...draw(0.3)} />

      {/* T on the line → ℓ(T) = 0 */}
      <motion.g {...fade(0.6)}>
        <circle cx={88} cy={126} r={7} fill={C.g2} />
        <text x={66} y={120} fontSize={12} fontWeight={600} fill={C.g2}>T</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <rect x={100} y={110} width={68} height={22} rx={4}
          fill={`${C.g2}15`} stroke={`${C.g2}40`} strokeWidth={0.5} />
        <text x={134} y={125} textAnchor="middle" fontSize={11} fill={C.g2}>ℓ(T) = 0</text>
      </motion.g>

      {/* P NOT on the line → ℓ(P) ≠ 0 */}
      <motion.g {...fade(1.3)}>
        <circle cx={88} cy={210} r={7} fill={C.g1} />
        <text x={66} y={206} fontSize={12} fontWeight={600} fill={C.g1}>P</text>
      </motion.g>

      {/* Distance line from P to tangent */}
      <motion.line x1={88} y1={203} x2={88} y2={133}
        stroke={C.g1} strokeWidth={1} strokeDasharray="3 2" {...draw(1.5)} />
      <motion.g {...fade(1.7)}>
        <rect x={100} y={196} width={96} height={22} rx={4}
          fill={`${C.g1}15`} stroke={`${C.g1}40`} strokeWidth={0.5} />
        <text x={148} y={211} textAnchor="middle" fontSize={11} fontWeight={600}
          fill={C.g1}>ℓ(P) ≠ 0</text>
      </motion.g>

      {/* Bracket: distance = ℓ(P) */}
      <motion.g {...fade(2.0)}>
        <text x={56} y={172} fontSize={10} fill={C.m} textAnchor="middle">거리</text>
        <text x={56} y={186} fontSize={10} fill={C.g1} textAnchor="middle">= ℓ(P)</text>
      </motion.g>

      {/* Right side: formula + meaning */}
      <Step7bFormula delay={0.5} />
    </svg>
  );
}
