import { motion } from 'framer-motion';

const C = { g2: '#10b981', gt: '#f59e0b', ml: '#ec4899', sp: '#6366f1', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});
const draw = (d: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration: 0.4, delay: d }, opacity: { duration: 0.2, delay: d } },
});

/** Step7: One Miller iteration detail with Fp12 sparse multiplication */
export default function Step7MillerIter() {
  return (
    <svg viewBox="0 0 520 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.ml} {...fade(0)}>한 iteration 상세 (254번 반복)</motion.text>

      {/* ① 점 더블링 */}
      <motion.g {...fade(0.3)}>
        <rect x={15} y={32} width={490} height={44} rx={6}
          fill={`${C.g2}10`} stroke={`${C.g2}30`} strokeWidth={0.6} />
        <text x={30} y={50} fontSize={12} fontWeight={600} fill={C.g2}>① 점 더블링: T ← 2T</text>
        <text x={30} y={68} fontSize={9} fill={C.m}>
          접선 기울기 λ = (3x²+a) / (2y). 새 좌표 x₃ = λ²−2x, y₃ = λ(x−x₃)−y
        </text>
      </motion.g>

      {/* ↓ arrow + tangent equation passes to ② */}
      <motion.g {...fade(0.7)}>
        <motion.line x1={260} y1={78} x2={260} y2={88} stroke={`${C.m}40`} strokeWidth={0.7} {...draw(0.7)} />
        <polygon points="257,88 260,93 263,88" fill={`${C.m}40`} />
        <text x={280} y={88} fontSize={9} fill={C.ml}>λ를 ②에 전달</text>
      </motion.g>

      {/* ② 접선 함수 평가 */}
      <motion.g {...fade(0.9)}>
        <rect x={15} y={96} width={490} height={44} rx={6}
          fill={`${C.ml}10`} stroke={`${C.ml}30`} strokeWidth={0.6} />
        <text x={30} y={114} fontSize={12} fontWeight={600} fill={C.ml}>② 접선 함수 평가: ℓ(P)</text>
        <text x={30} y={132} fontSize={9} fill={C.m}>
          ℓ(x,y) = y − λ·x − (yT − λ·xT). G1 점 P = (xP, yP)를 대입 → Fp¹² 원소
        </text>
      </motion.g>

      {/* ↓ arrow */}
      <motion.g {...fade(1.3)}>
        <motion.line x1={260} y1={142} x2={260} y2={152} stroke={`${C.m}40`} strokeWidth={0.7} {...draw(1.3)} />
        <polygon points="257,152 260,157 263,152" fill={`${C.m}40`} />
      </motion.g>

      {/* ③ f 업데이트 + sparse detail */}
      <motion.g {...fade(1.5)}>
        <rect x={15} y={160} width={490} height={50} rx={6}
          fill={`${C.gt}10`} stroke={`${C.gt}30`} strokeWidth={0.6} />
        <text x={30} y={178} fontSize={12} fontWeight={600} fill={C.gt}>③ f ← f² · ℓ(P)</text>
        <text x={30} y={198} fontSize={9} fill={C.m}>
          f²: Fp12 제곱 (Fp 곱 ~36번). ℓ(P)는 12계수 중 3~4개만 ≠ 0.
        </text>
      </motion.g>

      {/* Sparse multiplication visualization */}
      <motion.g {...fade(2.0)}>
        <text x={260} y={228} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.sp}>
          sparse 곱셈: ℓ의 구조
        </text>
        {/* 12 slots showing which are non-zero */}
        {Array.from({ length: 12 }).map((_, i) => {
          const nonZero = i === 0 || i === 2 || i === 3;
          return (
            <motion.rect key={i} x={135 + i * 22} y={234} width={18} height={16} rx={2}
              fill={nonZero ? `${C.sp}30` : 'color-mix(in oklch, var(--muted) 15%, transparent)'}
              stroke={nonZero ? `${C.sp}60` : 'var(--border)'} strokeWidth={0.5}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 2.1 + i * 0.03 }} />
          );
        })}
        <text x={135 + 12 * 22 + 8} y={246} fontSize={9} fill={C.sp}>
          3/12 ≠ 0 → 비용 1/3
        </text>
      </motion.g>
    </svg>
  );
}
