import { motion } from 'framer-motion';
import MillerPipeline from './MillerPipeline';

const C = { g1: '#6366f1', g2: '#10b981', gt: '#f59e0b', ml: '#ec4899' };

const curve = {
  u: 'M 28 140 C 38 115 50 92 72 80 C 92 70 112 64 140 60',
  l: 'M 28 140 C 38 165 50 188 72 200 C 92 210 112 216 140 220',
};
const draw = (d: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration: 0.5, delay: d }, opacity: { duration: 0.2, delay: d } },
});
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

export default function Step6MillerIdea() {
  return (
    <svg viewBox="0 0 520 268" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Left: curve + tangent + doubling */}
      <motion.path d={curve.u} fill="none" stroke={`${C.g2}50`} strokeWidth={1.5} {...draw(0)} />
      <motion.path d={curve.l} fill="none" stroke={`${C.g2}50`} strokeWidth={1.5} {...draw(0)} />

      <motion.g {...fade(0.4)}>
        <circle cx={72} cy={80} r={6} fill={C.g2} />
        <text x={56} y={73} fontSize={12} fontWeight={600} fill={C.g2}>T</text>
      </motion.g>

      <motion.line x1={22} y1={104} x2={148} y2={48}
        stroke={C.ml} strokeWidth={1} strokeDasharray="4 3" opacity={0.7} {...draw(0.8)} />
      <motion.text x={144} y={44} fontSize={9} fontWeight={500} fill={C.ml} {...fade(0.9)}>
        접선 ℓ
      </motion.text>

      <motion.g {...fade(1.2)}>
        <circle cx={120} cy={62} r={3} fill="none" stroke="#ef4444" strokeWidth={1} />
      </motion.g>
      <motion.line x1={120} y1={68} x2={120} y2={210}
        stroke="#ef444440" strokeWidth={0.7} strokeDasharray="2 2" {...draw(1.4)} />
      <motion.g {...fade(1.6)}>
        <circle cx={120} cy={216} r={6} fill={C.gt} />
        <text x={130} y={212} fontSize={11} fontWeight={600} fill={C.gt}>2T</text>
      </motion.g>

      <motion.g {...fade(1.9)}>
        <circle cx={72} cy={200} r={6} fill={C.g1} />
        <text x={56} y={214} fontSize={12} fontWeight={600} fill={C.g1}>P</text>
        <line x1={72} y1={194} x2={72} y2={88}
          stroke={`${C.g1}30`} strokeWidth={0.6} strokeDasharray="2 2" />
      </motion.g>

      <motion.g {...fade(2.2)}>
        <rect x={16} y={226} width={110} height={22} rx={4}
          fill={`${C.ml}15`} stroke={`${C.ml}30`} strokeWidth={0.5} />
        <text x={71} y={241} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.ml}>
          ℓ(P) → Fp¹² 원소
        </text>
      </motion.g>

      {/* Right: pipeline */}
      <MillerPipeline />
    </svg>
  );
}
