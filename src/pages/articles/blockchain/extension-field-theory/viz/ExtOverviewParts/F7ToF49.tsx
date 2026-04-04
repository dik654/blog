import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.6 };
const C = { base: '#6366f1', ext: '#10b981', fail: '#ef4444' };

/** Step 1: F₇ → F₄₉ with brute-force check table + 2D grid */
export default function F7ToF49() {
  // x² mod 7 values: 0,1,4,2,2,4,1 → none equals 6 (≡ -1)
  const squares = [0, 1, 4, 2, 2, 4, 1];

  return (
    <svg viewBox="0 0 510 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Left: F₇ brute-force check */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <text x={100} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.base}>
          F₇ 에서 x² + 1 = 0 검증
        </text>
        {/* Table header */}
        <text x={30} y={38} fontSize={9} fontWeight={500} fill={C.base}>x</text>
        <text x={90} y={38} fontSize={9} fontWeight={500} fill={C.base}>x² mod 7</text>
        <text x={160} y={38} fontSize={9} fontWeight={500} fill={C.base}>= 6?</text>
        <line x1={20} y1={43} x2={190} y2={43} stroke={`${C.base}30`} strokeWidth={0.5} />
        {/* Each row */}
        {squares.map((sq, i) => (
          <motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.06 }}>
            <text x={30} y={58 + i * 17} fontSize={9} fill={C.base}>{i}</text>
            <text x={100} y={58 + i * 17} textAnchor="middle" fontSize={9} fill={C.base}>{sq}</text>
            <text x={160} y={58 + i * 17} textAnchor="middle" fontSize={9}
              fill={C.fail}>✗</text>
          </motion.g>
        ))}
        {/* Conclusion */}
        <rect x={20} y={172} width={170} height={26} rx={4}
          fill={`${C.fail}15`} stroke={`${C.fail}40`} strokeWidth={0.8} />
        <text x={105} y={189} textAnchor="middle" fontSize={9} fill={C.fail}>
          x² ≡ -1 (mod 7) 불가 → 해 없음
        </text>
      </motion.g>

      {/* Arrow: +u */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={205} y1={100} x2={245} y2={100} stroke={C.ext} strokeWidth={1} />
        <polygon points="245,97 251,100 245,103" fill={C.ext} />
        <text x={228} y={92} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ext}>+ u</text>
        <text x={228} y={112} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          근 추가
        </text>
      </motion.g>

      {/* Right: F₄₉ = F₇[u] grid */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <text x={385} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ext}>
          F₄₉ = F₇[u] (49개 원소)
        </text>
        {/* 7×7 grid */}
        {Array.from({ length: 7 }).map((_, a) =>
          Array.from({ length: 7 }).map((_, b) => (
            <motion.rect key={`${a}${b}`}
              x={280 + a * 28} y={30 + b * 24} width={24} height={20} rx={3}
              fill={`${C.ext}20`} stroke={`${C.ext}50`} strokeWidth={0.5}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ ...sp, delay: 0.5 + (a + b) * 0.01 }} />
          ))
        )}
        {/* Axis labels */}
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={`lbl${i}`}>
            <text x={292 + i * 28} y={208} textAnchor="middle" fontSize={9} fill={C.ext}>{i}</text>
            <text x={268} y={44 + i * 24} textAnchor="end" fontSize={9} fill={C.ext}>{i}u</text>
          </g>
        ))}
        <text x={385} y={224} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          a (실수부)
        </text>
        <text x={250} y={60} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
          transform="rotate(-90 250 60)">b (u 계수)</text>
        {/* Highlight one element */}
        <motion.rect x={280 + 3 * 28} y={30 + 5 * 24} width={24} height={20} rx={3}
          fill={`${C.ext}45`} stroke={C.ext} strokeWidth={1.2}
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ ...sp, delay: 0.9 }} />
        <text x={292 + 3 * 28} y={44 + 5 * 24} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.ext}>3+5u</text>
      </motion.g>
    </svg>
  );
}
