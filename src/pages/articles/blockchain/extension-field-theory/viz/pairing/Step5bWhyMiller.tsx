import { motion } from 'framer-motion';

const C = { g1: '#6366f1', ml: '#ec4899', gt: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Miller Loop = scalar mul rQ + f accumulation (not analogy, same algorithm) */
export default function Step5bWhyMiller() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.ml} {...fade(0)}>Miller Loop = 스칼라 곱 rQ + f 누적</motion.text>
      <motion.text x={260} y={44} textAnchor="middle" fontSize={11} fill={C.m} {...fade(0.15)}>
        비유가 아니다 — 실제로 같은 루프. 점 연산은 100% 동일
      </motion.text>

      {/* Scalar mul */}
      <motion.g {...fade(0.3)}>
        <rect x={20} y={58} width={480} height={52} rx={6}
          fill={`${C.g1}08`} stroke={`${C.g1}20`} strokeWidth={0.6} />
        <text x={36} y={78} fontSize={12} fontWeight={600} fill={C.g1}>스칼라 곱 rQ</text>
        <text x={36} y={98} fontSize={11} fill={C.m}>
          r의 비트를 순회: T←2T, (bit=1이면 T←T+Q). 결과: T = rQ = O (항등원)
        </text>
      </motion.g>

      {/* Plus sign */}
      <motion.text x={260} y={128} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.ml} {...fade(0.7)}>Miller Loop는 여기에 f 누적을 추가한 것</motion.text>

      {/* Added part */}
      <motion.g {...fade(1.0)}>
        <rect x={20} y={140} width={480} height={52} rx={6}
          fill={`${C.ml}10`} stroke={`${C.ml}30`} strokeWidth={0.7} />
        <text x={36} y={160} fontSize={12} fontWeight={600} fill={C.ml}>추가된 것: f 누적</text>
        <text x={36} y={180} fontSize={11} fill={C.m}>
          매 더블링/덧셈에서 나오는 접선/할선을 P에서 평가 → f에 곱한다
        </text>
      </motion.g>

      {/* Result */}
      <motion.g {...fade(1.5)}>
        <rect x={20} y={206} width={480} height={58} rx={6}
          fill={`${C.gt}08`} stroke={`${C.gt}20`} strokeWidth={0.6} />
        <text x={36} y={226} fontSize={12} fontWeight={600} fill={C.gt}>결과</text>
        <text x={36} y={246} fontSize={11} fill={C.m}>
          T = O (점은 사라짐). f = 254번의 접선 평가가 누적된 Fp¹² 값
        </text>
        <text x={36} y={262} fontSize={11} fill={C.gt}>
          이 f에 P와 Q의 전체 기하학적 관계가 인코딩되어 있다
        </text>
      </motion.g>
    </svg>
  );
}
