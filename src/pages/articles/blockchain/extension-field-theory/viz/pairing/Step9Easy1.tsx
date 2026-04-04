import { motion } from 'framer-motion';
import Fp12Slots from './Fp12Slots';

const C = { g2: '#10b981', w: '#ec4899', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});
const slotW = 38;
const baseX = 40;

/** Easy Part 1: f^(p⁶−1) via conjugate + inverse */
export default function Step9Easy1() {
  const orig = Array.from({ length: 12 }, (_, i) => `a${i}`);
  const conj = Array.from({ length: 12 }, (_, i) => i < 6 ? `a${i}` : `−a${i}`);
  const colors = { lo: C.g2, hi: C.w };

  return (
    <svg viewBox="0 0 540 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.g2} {...fade(0)}>Easy Part 1: f⁽ᵖ⁶⁻¹⁾</motion.text>
      <motion.text x={270} y={48} textAnchor="middle" fontSize={11} fill={C.m} {...fade(0.15)}>
        Fp12 = Fp6 + Fp6·w — 원소 f = (a₀…a₅) + (a₆…a₁₁)·w
      </motion.text>

      {/* Original f */}
      <motion.text x={baseX - 22} y={78} fontSize={11} fill={C.m} {...fade(0.3)}>f =</motion.text>
      <Fp12Slots baseX={baseX} y={62} slotW={slotW} labels={orig} colors={colors} delay={0.3} />
      <motion.text x={baseX + 3 * slotW} y={100} textAnchor="middle" fontSize={10}
        fill={C.g2} {...fade(0.5)}>Fp6 (하위)</motion.text>
      <motion.text x={baseX + 9 * slotW} y={100} textAnchor="middle" fontSize={10}
        fill={C.w} {...fade(0.5)}>Fp6·w (상위)</motion.text>

      {/* ① Conjugate */}
      <motion.g {...fade(0.7)}>
        <line x1={270} y1={108} x2={270} y2={122} stroke={`${C.m}40`} strokeWidth={0.7} />
        <polygon points="267,122 270,128 273,122" fill={`${C.m}40`} />
        <text x={294} y={120} fontSize={11} fontWeight={500} fill={C.g2}>① 켤레 f̄</text>
      </motion.g>
      <motion.text x={baseX - 22} y={150} fontSize={11} fill={C.m} {...fade(0.9)}>f̄ =</motion.text>
      <Fp12Slots baseX={baseX} y={134} slotW={slotW} labels={conj} colors={colors} delay={0.9} />

      {/* Highlight w-part sign flip */}
      <motion.rect x={baseX + 6 * slotW - 4} y={132} width={6 * slotW + 4} height={28} rx={4}
        fill="none" stroke={C.w} strokeWidth={1.2} strokeDasharray="4 2"
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
        transition={{ duration: 0.4, delay: 1.1 }} />
      <motion.text x={baseX + 9 * slotW} y={176} textAnchor="middle" fontSize={11}
        fontWeight={500} fill={C.w} {...fade(1.1)}>w 계수만 부호 반전 — 곱셈 0번!</motion.text>

      {/* ② Division */}
      <motion.g {...fade(1.4)}>
        <line x1={270} y1={184} x2={270} y2={198} stroke={`${C.m}40`} strokeWidth={0.7} />
        <polygon points="267,198 270,204 273,198" fill={`${C.m}40`} />
        <text x={294} y={198} fontSize={11} fontWeight={500} fill={C.g2}>② f̄ · f⁻¹</text>
      </motion.g>
      <motion.g {...fade(1.6)}>
        <rect x={80} y={210} width={380} height={38} rx={6}
          fill={`${C.g2}12`} stroke={`${C.g2}30`} strokeWidth={0.6} />
        <text x={270} y={230} textAnchor="middle" fontSize={12} fill={C.g2}>
          f⁻¹ (역원 1번) → f̄ · f⁻¹ (곱셈 1번) → 결과 g
        </text>
        <text x={270} y={246} textAnchor="middle" fontSize={10} fill={C.m}>
          역원 1 + 곱셈 1 = Fp12 연산 단 2번
        </text>
      </motion.g>

      {/* Result */}
      <motion.g {...fade(1.9)}>
        <rect x={150} y={260} width={240} height={30} rx={5}
          fill={`${C.g2}20`} stroke={C.g2} strokeWidth={0.8} />
        <text x={270} y={280} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.g2}>
          g = f⁽ᵖ⁶⁻¹⁾ ✓
        </text>
      </motion.g>
    </svg>
  );
}
