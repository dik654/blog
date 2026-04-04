import { motion } from 'framer-motion';

const C = { a: '#6366f1', b: '#10b981', r: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Fp2 multiplication: (a+bu)(c+du) expansion step by step */
export default function Fp2Multiply() {
  return (
    <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.a} {...fade(0)}>Fp² 곱셈: (a+bu)(c+du)</motion.text>

      {/* Step 1: FOIL expansion */}
      <motion.g {...fade(0.3)}>
        <text x={30} y={52} fontSize={10} fontWeight={500} fill={C.m}>① 전개 (FOIL):</text>
        <text x={30} y={74} fontSize={11} fill={C.a}>ac</text>
        <text x={58} y={74} fontSize={11} fill={C.m}>+</text>
        <text x={72} y={74} fontSize={11} fill={C.b}>adu</text>
        <text x={108} y={74} fontSize={11} fill={C.m}>+</text>
        <text x={122} y={74} fontSize={11} fill={C.b}>bcu</text>
        <text x={162} y={74} fontSize={11} fill={C.m}>+</text>
        <text x={176} y={74} fontSize={11} fill={C.r}>bdu²</text>
      </motion.g>

      {/* Step 2: substitute u² = -1 */}
      <motion.g {...fade(0.8)}>
        <line x1={30} y1={86} x2={260} y2={86} stroke={`${C.m}15`} strokeWidth={0.5} />
        <text x={30} y={106} fontSize={10} fontWeight={500} fill={C.m}>② u² = −1 대입:</text>
        <rect x={176} y={56} width={46} height={22} rx={3}
          fill={`${C.r}20`} stroke={C.r} strokeWidth={0.8} />
        <motion.line x1={199} y1={80} x2={199} y2={108}
          stroke={C.r} strokeWidth={0.8} strokeDasharray="3 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.9 }} />
        <text x={30} y={128} fontSize={11} fill={C.a}>ac</text>
        <text x={58} y={128} fontSize={11} fill={C.m}>+</text>
        <text x={72} y={128} fontSize={11} fill={C.b}>(ad+bc)u</text>
        <text x={170} y={128} fontSize={11} fill={C.r}>− bd</text>
        <text x={210} y={128} fontSize={9} fill={C.r}>← bdu² = −bd</text>
      </motion.g>

      {/* Step 3: final result */}
      <motion.g {...fade(1.3)}>
        <line x1={30} y1={142} x2={260} y2={142} stroke={`${C.m}15`} strokeWidth={0.5} />
        <text x={30} y={162} fontSize={10} fontWeight={500} fill={C.m}>③ 정리:</text>
        <rect x={30} y={172} width={430} height={36} rx={6}
          fill={`${C.a}10`} stroke={`${C.a}30`} strokeWidth={0.7} />
        <text x={50} y={194} fontSize={12} fill={C.a}>실수부: (ac − bd)</text>
        <text x={260} y={194} fontSize={12} fill={C.b}>허수부: (ad + bc) · u</text>
      </motion.g>

      {/* Cost */}
      <motion.g {...fade(1.7)}>
        <text x={260} y={232} textAnchor="middle" fontSize={10} fill={C.m}>
          순진한 계산: Fp 곱셈 4번 (ac, ad, bc, bd). Karatsuba로 3번으로 줄일 수 있다 →
        </text>
      </motion.g>
    </svg>
  );
}
