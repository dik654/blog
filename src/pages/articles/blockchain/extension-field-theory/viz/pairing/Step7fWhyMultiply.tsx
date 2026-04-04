import { motion } from 'framer-motion';

const C = { g1: '#6366f1', gt: '#f59e0b', ml: '#ec4899', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Why multiply + why 254 times */
export default function Step7fWhyMultiply() {
  return (
    <svg viewBox="0 0 540 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.gt} {...fade(0)}>왜 곱하는가, 왜 254번인가</motion.text>

      {/* Why multiply */}
      <motion.g {...fade(0.3)}>
        <rect x={20} y={42} width={500} height={54} rx={6}
          fill={`${C.gt}08`} stroke={`${C.gt}20`} strokeWidth={0.6} />
        <text x={36} y={62} fontSize={12} fontWeight={600} fill={C.gt}>
          왜 곱하는가
        </text>
        <text x={36} y={82} fontSize={12} fill={C.m}>
          페어링의 정의 자체가 "모든 접선 평가값의 곱"이다
        </text>
      </motion.g>

      {/* Analogy side by side */}
      <motion.g {...fade(0.7)}>
        <rect x={20} y={110} width={240} height={50} rx={6}
          fill={`${C.g1}08`} stroke={`${C.g1}20`} strokeWidth={0.6} />
        <text x={36} y={130} fontSize={12} fontWeight={600} fill={C.g1}>스칼라 곱 rQ</text>
        <text x={36} y={150} fontSize={11} fill={C.m}>Q를 r번 더한다 = 덧셈 반복</text>
      </motion.g>

      <motion.g {...fade(1.0)}>
        <rect x={280} y={110} width={240} height={50} rx={6}
          fill={`${C.gt}10`} stroke={`${C.gt}25`} strokeWidth={0.6} />
        <text x={296} y={130} fontSize={12} fontWeight={600} fill={C.gt}>페어링 e(P, Q)</text>
        <text x={296} y={150} fontSize={11} fill={C.m}>ℓ(P)를 r번 곱한다 = 곱셈 반복</text>
      </motion.g>

      {/* Why 254 */}
      <motion.g {...fade(1.4)}>
        <rect x={20} y={176} width={500} height={54} rx={6}
          fill={`${C.ml}08`} stroke={`${C.ml}20`} strokeWidth={0.6} />
        <text x={36} y={196} fontSize={12} fontWeight={600} fill={C.ml}>
          왜 254번인가
        </text>
        <text x={36} y={216} fontSize={12} fill={C.m}>
          r = G1의 위수 (254-bit 소수). r의 비트 수 = 254.
          double-and-add로 254번 순회
        </text>
      </motion.g>

      {/* Summary */}
      <motion.g {...fade(1.8)}>
        <rect x={20} y={244} width={500} height={28} rx={5}
          fill={`${C.gt}12`} stroke={`${C.gt}30`} strokeWidth={0.5} />
        <text x={270} y={263} textAnchor="middle" fontSize={12} fill={C.gt}>
          254개의 T-P 관계 스냅샷을 곱 → P와 Q의 전체 관계 = 페어링 원재료
        </text>
      </motion.g>
    </svg>
  );
}
