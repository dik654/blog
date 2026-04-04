import { motion } from 'framer-motion';

const C = { g1: '#6366f1', g2: '#10b981', ml: '#ec4899', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});
const draw = (d: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration: 0.4, delay: d }, opacity: { duration: 0.2, delay: d } },
});

/** How the tangent "measures" T-P relationship */
export default function Step7d2Measure() {
  return (
    <svg viewBox="0 0 540 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.ml} {...fade(0)}>접선으로 T-P 관계를 측정하는 원리</motion.text>

      {/* Tangent at T */}
      <motion.line x1={40} y1={160} x2={260} y2={60}
        stroke={C.ml} strokeWidth={1} strokeDasharray="5 3" {...draw(0.3)} />

      {/* T on tangent */}
      <motion.g {...fade(0.5)}>
        <circle cx={120} cy={126} r={8} fill={C.g2} />
        <text x={98} y={118} fontSize={12} fontWeight={600} fill={C.g2}>T</text>
      </motion.g>

      {/* ℓ(T) = 0 */}
      <motion.g {...fade(0.9)}>
        <rect x={136} y={112} width={80} height={24} rx={4}
          fill={`${C.g2}15`} stroke={`${C.g2}40`} strokeWidth={0.5} />
        <text x={176} y={128} textAnchor="middle" fontSize={11} fontWeight={600}
          fill={C.g2}>ℓ(T) = 0</text>
        <text x={224} y={128} fontSize={10} fill={C.m}>← 접선 위</text>
      </motion.g>

      {/* P below tangent */}
      <motion.g {...fade(1.3)}>
        <circle cx={120} cy={220} r={8} fill={C.g1} />
        <text x={98} y={214} fontSize={12} fontWeight={600} fill={C.g1}>P</text>
      </motion.g>

      {/* Distance line T→P */}
      <motion.line x1={120} y1={134} x2={120} y2={212}
        stroke={C.g1} strokeWidth={1} strokeDasharray="3 2" {...draw(1.5)} />

      {/* ℓ(P) ≠ 0 */}
      <motion.g {...fade(1.7)}>
        <rect x={136} y={206} width={100} height={24} rx={4}
          fill={`${C.g1}15`} stroke={`${C.g1}40`} strokeWidth={0.5} />
        <text x={186} y={222} textAnchor="middle" fontSize={11} fontWeight={600}
          fill={C.g1}>ℓ(P) ≠ 0</text>
        <text x={244} y={222} fontSize={10} fill={C.m}>← 접선 밖</text>
      </motion.g>

      {/* Distance bracket */}
      <motion.g {...fade(2.0)}>
        <text x={104} y={178} textAnchor="end" fontSize={11} fill={C.ml}>이 거리</text>
        <text x={104} y={194} textAnchor="end" fontSize={11} fontWeight={600} fill={C.ml}>= ℓ(P)</text>
      </motion.g>

      {/* Right: explanation */}
      <motion.g {...fade(0.5)}>
        <rect x={300} y={70} width={220} height={56} rx={6}
          fill={`${C.g2}08`} stroke={`${C.g2}20`} strokeWidth={0.5} />
        <text x={314} y={90} fontSize={11} fontWeight={600} fill={C.g2}>T에서 평가하면?</text>
        <text x={314} y={110} fontSize={11} fill={C.m}>항상 0. 쓸모없음</text>
        <text x={314} y={122} fontSize={10} fill={C.m}>(접선 위에 있으니까)</text>
      </motion.g>

      <motion.g {...fade(1.5)}>
        <rect x={300} y={142} width={220} height={56} rx={6}
          fill={`${C.g1}10`} stroke={`${C.g1}25`} strokeWidth={0.5} />
        <text x={314} y={162} fontSize={11} fontWeight={600} fill={C.g1}>P에서 평가하면?</text>
        <text x={314} y={182} fontSize={11} fill={C.g1}>≠ 0 값이 나옴</text>
        <text x={314} y={194} fontSize={10} fill={C.m}>= T와 P의 관계를 숫자로</text>
      </motion.g>

      {/* Bottom */}
      <motion.g {...fade(2.3)}>
        <rect x={300} y={214} width={220} height={44} rx={6}
          fill={`${C.ml}10`} stroke={`${C.ml}25`} strokeWidth={0.5} />
        <text x={314} y={234} fontSize={11} fill={C.ml}>T가 이동할 때마다</text>
        <text x={314} y={250} fontSize={11} fontWeight={600} fill={C.ml}>매번 이 측정을 반복 → 누적</text>
      </motion.g>
    </svg>
  );
}
