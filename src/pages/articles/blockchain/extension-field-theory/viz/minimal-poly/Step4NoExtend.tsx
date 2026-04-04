import { motion } from 'framer-motion';

const C = { base: '#6366f1', fail: '#ef4444', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { duration: 0.35, delay: d },
});

export default function Step4NoExtend() {
  return (
    <svg viewBox="0 0 490 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={245} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.fail} {...fade(0)}>
        가약 → 근을 추가해도 체가 커지지 않는다
      </motion.text>

      {/* F₇: 7개 원소 */}
      <motion.g {...fade(0.3)}>
        <text x={20} y={52} fontSize={11} fontWeight={600} fill={C.base}>F₇</text>
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i}>
            <rect x={20 + i * 36} y={60} width={30} height={30} rx={4}
              fill={`${C.base}20`} stroke={`${C.base}40`} strokeWidth={0.5} />
            <text x={35 + i * 36} y={80} textAnchor="middle"
              fontSize={12} fill={C.base}>{i}</text>
          </g>
        ))}
      </motion.g>

      {/* "3을 추가?" */}
      <motion.g {...fade(0.7)}>
        <text x={245} y={114} textAnchor="middle" fontSize={12} fill={C.fail}>
          x²−2의 근 = 3. "3을 추가"하면?
        </text>
      </motion.g>

      {/* 결과: 동일한 F₇ */}
      <motion.g {...fade(1.1)}>
        <text x={20} y={140} fontSize={11} fontWeight={600} fill={C.fail}>여전히 F₇</text>
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i}>
            <rect x={20 + i * 36} y={148} width={30} height={30} rx={4}
              fill={i === 3 ? `${C.fail}25` : `${C.base}20`}
              stroke={i === 3 ? C.fail : `${C.base}40`}
              strokeWidth={i === 3 ? 1.5 : 0.5} />
            <text x={35 + i * 36} y={168} textAnchor="middle"
              fontSize={12} fill={i === 3 ? C.fail : C.base}>{i}</text>
          </g>
        ))}
      </motion.g>

      {/* 화살표: 3이 이미 있다 */}
      <motion.g {...fade(1.1)}>
        <line x1={35 + 3 * 36} y1={92} x2={35 + 3 * 36} y2={146}
          stroke={C.fail} strokeWidth={1} strokeDasharray="3 2" />
        <text x={35 + 3 * 36 + 20} y={124} fontSize={10} fontWeight={500} fill={C.fail}>
          이미 있다!
        </text>
      </motion.g>

      {/* 결론 */}
      <motion.g {...fade(1.5)}>
        <rect x={290} y={140} width={190} height={50} rx={6}
          fill={`${C.fail}10`} stroke={`${C.fail}30`} strokeWidth={0.6} />
        <text x={385} y={162} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.fail}>
          변화 없음: 7개 → 7개
        </text>
        <text x={385} y={180} textAnchor="middle" fontSize={10} fill={C.m}>
          가약 근은 새 원소가 아니다
        </text>
      </motion.g>
    </svg>
  );
}
