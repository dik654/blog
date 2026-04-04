import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.6 };
const C = { base: '#6366f1', ext: '#10b981', muted: 'var(--muted-foreground)' };

/** Step 0: ℝ → ℂ analogy with number line → 2D plane */
export default function RealToComplex() {
  return (
    <svg viewBox="0 0 500 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Left side: Real number line */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <text x={100} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.base}>
          ℝ (실수)
        </text>
        {/* Number line */}
        <line x1={20} y1={50} x2={185} y2={50} stroke={C.base} strokeWidth={1} />
        <polygon points="185,47 191,50 185,53" fill={C.base} />
        {/* Tick marks */}
        {[-2, -1, 0, 1, 2].map((n, i) => (
          <g key={n}>
            <line x1={40 + i * 35} y1={45} x2={40 + i * 35} y2={55} stroke={C.base} strokeWidth={0.8} />
            <text x={40 + i * 35} y={66} textAnchor="middle" fontSize={9} fill={C.base}>{n}</text>
          </g>
        ))}
        {/* x² + 1 = 0 → no solution */}
        <rect x={22} y={78} width={160} height={30} rx={5}
          fill="#ef444418" stroke="#ef444445" strokeWidth={0.8} />
        <text x={102} y={97} textAnchor="middle" fontSize={10} fill="#ef4444">
          x² + 1 = 0 → 해 없음 ✗
        </text>
      </motion.g>

      {/* Arrow: +i */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={205} y1={56} x2={248} y2={56} stroke={C.ext} strokeWidth={1} />
        <polygon points="248,53 254,56 248,59" fill={C.ext} />
        <text x={230} y={47} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ext}>+ i</text>
        <text x={230} y={72} textAnchor="middle" fontSize={9} fill={C.muted}>근 추가</text>
      </motion.g>

      {/* Right side: Complex plane */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <text x={380} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ext}>
          ℂ = ℝ + ℝ·i (복소수)
        </text>
        {/* Axes */}
        <line x1={280} y1={110} x2={470} y2={110} stroke={C.ext} strokeWidth={0.8} />
        <line x1={380} y1={30} x2={380} y2={155} stroke={C.ext} strokeWidth={0.8} />
        <text x={474} y={114} fontSize={9} fill={C.ext}>ℝ</text>
        <text x={384} y={32} fontSize={9} fill={C.ext}>i</text>
        {/* Grid dots */}
        {[-2, -1, 0, 1, 2].map(r =>
          [-1, 0, 1].map(im => (
            <circle key={`${r}${im}`} cx={380 + r * 35} cy={110 - im * 35}
              r={2.5} fill={`${C.ext}50`} />
          ))
        )}
        {/* Example point: 3 + 2i */}
        <motion.circle cx={380 + 3 * 12} cy={110 - 2 * 18} r={5}
          fill={C.ext} initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ ...sp, delay: 0.7 }} />
        <text x={380 + 3 * 12 + 9} y={110 - 2 * 18 + 4} fontSize={9} fill={C.ext}>3 + 2i</text>
        {/* Dimension label */}
        <rect x={300} y={158} width={160} height={24} rx={4}
          fill={`${C.ext}18`} stroke={`${C.ext}40`} strokeWidth={0.8} />
        <text x={380} y={174} textAnchor="middle" fontSize={9} fill={C.ext}>
          1차원 → 2차원으로 확장
        </text>
      </motion.g>

      {/* Bottom: i² = -1 rule */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={250} y={196} textAnchor="middle" fontSize={9} fill={C.muted}>
          연산 규칙: i² = -1 (나머지는 실수 산술과 동일)
        </text>
      </motion.g>
    </svg>
  );
}
