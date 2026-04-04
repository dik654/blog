import { motion } from 'framer-motion';

const C = { base: '#6366f1', ext: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { duration: 0.35, delay: d },
});

export default function Step3Extend() {
  return (
    <svg viewBox="0 0 490 290" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={245} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.ext} {...fade(0)}>
        기약 → 새 원소 추가 → 체가 확장된다
      </motion.text>

      {/* F₇: 7개 원소 */}
      <motion.g {...fade(0.3)}>
        <text x={30} y={50} fontSize={11} fontWeight={600} fill={C.base}>F₇ (7개 원소)</text>
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i}>
            <rect x={30 + i * 30} y={58} width={26} height={26} rx={4}
              fill={`${C.base}20`} stroke={`${C.base}40`} strokeWidth={0.5} />
            <text x={43 + i * 30} y={76} textAnchor="middle"
              fontSize={11} fill={C.base}>{i}</text>
          </g>
        ))}
      </motion.g>

      {/* 화살표 + u 추가 */}
      <motion.g {...fade(0.7)}>
        <text x={140} y={106} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ext}>
          + u (u² = −1, F₇ 바깥의 근) ↓
        </text>
      </motion.g>

      {/* F₄₉: 7×7 그리드 */}
      <motion.g {...fade(1.1)}>
        <text x={30} y={130} fontSize={11} fontWeight={600} fill={C.ext}>
          F₄₉ = F₇[u] (49개 원소: a + bu)
        </text>
      </motion.g>
      {Array.from({ length: 7 }).map((_, a) =>
        Array.from({ length: 7 }).map((_, b) => (
          <motion.rect key={`${a}${b}`}
            x={30 + a * 30} y={140 + b * 18} width={26} height={14} rx={3}
            fill={`${C.ext}20`} stroke={`${C.ext}40`} strokeWidth={0.4}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 1.2 + (a + b) * 0.02 }} />
        ))
      )}

      {/* 축 라벨 */}
      <motion.g {...fade(1.8)}>
        <text x={135} y={278} textAnchor="middle" fontSize={10} fill={C.m}>a (0~6)</text>
        <text x={14} y={200} fontSize={10} fill={C.m} transform="rotate(-90 14 200)">b (0~6)</text>
      </motion.g>

      {/* 오른쪽: 핵심 */}
      <motion.g {...fade(1.5)}>
        <rect x={268} y={145} width={210} height={80} rx={6}
          fill={`${C.ext}10`} stroke={`${C.ext}30`} strokeWidth={0.6} />
        <text x={373} y={170} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.ext}>
          7개 → 49개!
        </text>
        <text x={373} y={192} textAnchor="middle" fontSize={11} fill={C.m}>
          u는 F₇에 없던 원소이므로
        </text>
        <text x={373} y={210} textAnchor="middle" fontSize={11} fill={C.m}>
          추가하면 진짜로 체가 커진다
        </text>
      </motion.g>
    </svg>
  );
}
