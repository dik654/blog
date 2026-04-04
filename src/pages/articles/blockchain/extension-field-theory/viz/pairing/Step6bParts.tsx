import { motion } from 'framer-motion';

const C = { g1: '#6366f1', ml: '#ec4899', gt: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** ③ f update section of the iteration animation */
export function FUpdateSection() {
  const fSlots = Array.from({ length: 12 });
  return (
    <g>
      <motion.g {...fade(2.8)}>
        <text x={20} y={164} fontSize={12} fontWeight={600} fill={C.gt}>③ f ← f² · ℓ(P)</text>
      </motion.g>

      {/* f before */}
      <motion.text x={20} y={186} fontSize={10} fill={C.m} {...fade(3.0)}>f =</motion.text>
      {fSlots.map((_, i) => (
        <motion.rect key={`f${i}`} x={44 + i * 28} y={174} width={24} height={20} rx={3}
          fill={`${C.gt}15`} stroke={`${C.gt}35`} strokeWidth={0.5}
          initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: 3.1 + i * 0.03 }} />
      ))}
      <motion.text x={44 + 12 * 28 + 6} y={188} fontSize={10} fontWeight={600}
        fill={C.gt} {...fade(3.5)}>→ f²</motion.text>

      {/* Arrow + multiply */}
      <motion.g {...fade(3.8)}>
        <line x1={210} y1={198} x2={210} y2={210} stroke={`${C.m}40`} strokeWidth={0.7} />
        <polygon points="207,210 210,215 213,210" fill={`${C.m}40`} />
        <text x={224} y={210} fontSize={10} fill={C.ml}>× ℓ(P)</text>
      </motion.g>

      {/* Result f' */}
      <motion.text x={20} y={236} fontSize={10} fill={C.gt} {...fade(4.0)}>f' =</motion.text>
      {fSlots.map((_, i) => (
        <motion.rect key={`fn${i}`} x={44 + i * 28} y={224} width={24} height={20} rx={3}
          fill={`${C.gt}20`} stroke={C.gt} strokeWidth={0.7}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ duration: 0.2, delay: 4.1 + i * 0.04 }} />
      ))}

      <motion.text x={270} y={268} textAnchor="middle" fontSize={11} fill={C.m} {...fade(4.6)}>
        f' 가 다음 iteration의 f가 된다 → 254번 반복
      </motion.text>
    </g>
  );
}
