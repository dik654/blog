import { motion } from 'framer-motion';

const C = { base: '#6366f1', ok: '#10b981', fail: '#ef4444', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

export default function Step0Concept() {
  return (
    <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* 정수 비유 */}
      <motion.text x={245} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.base} {...fade(0)}>
        정수에서의 소수 ↔ 다항식에서의 기약
      </motion.text>

      {/* 소수 */}
      <motion.g {...fade(0.3)}>
        <rect x={30} y={44} width={190} height={60} rx={6}
          fill={`${C.ok}10`} stroke={`${C.ok}30`} strokeWidth={0.6} />
        <text x={125} y={66} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.ok}>7 은 소수</text>
        <text x={125} y={86} textAnchor="middle" fontSize={11} fill={C.m}>
          더 작은 정수의 곱으로 쪼갤 수 없다
        </text>
      </motion.g>

      {/* 합성수 */}
      <motion.g {...fade(0.6)}>
        <rect x={260} y={44} width={200} height={60} rx={6}
          fill={`${C.fail}10`} stroke={`${C.fail}30`} strokeWidth={0.6} />
        <text x={360} y={66} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.fail}>6 = 2 × 3</text>
        <text x={360} y={86} textAnchor="middle" fontSize={11} fill={C.m}>
          쪼갤 수 있다 (합성수)
        </text>
      </motion.g>

      {/* 화살표 */}
      <motion.text x={245} y={128} textAnchor="middle" fontSize={12} fill={C.m} {...fade(1.0)}>
        ↓ 다항식도 마찬가지
      </motion.text>

      {/* 기약 */}
      <motion.g {...fade(1.3)}>
        <rect x={30} y={140} width={190} height={52} rx={6}
          fill={`${C.ok}10`} stroke={`${C.ok}30`} strokeWidth={0.6} />
        <text x={125} y={162} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.ok}>
          x² + 1  (F₇에서 기약)
        </text>
        <text x={125} y={180} textAnchor="middle" fontSize={10} fill={C.m}>
          F₇ 안에서 인수분해 불가
        </text>
      </motion.g>

      {/* 가약 */}
      <motion.g {...fade(1.6)}>
        <rect x={260} y={140} width={200} height={52} rx={6}
          fill={`${C.fail}10`} stroke={`${C.fail}30`} strokeWidth={0.6} />
        <text x={360} y={162} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.fail}>
          x² − 2 = (x−3)(x−4)
        </text>
        <text x={360} y={180} textAnchor="middle" fontSize={10} fill={C.m}>
          F₇ 안에서 인수분해 가능
        </text>
      </motion.g>
    </svg>
  );
}
