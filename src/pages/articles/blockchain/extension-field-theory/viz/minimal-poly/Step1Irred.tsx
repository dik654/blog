import { motion } from 'framer-motion';

const C = { base: '#6366f1', fail: '#ef4444', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, x: -4 }, animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3, delay: d },
});

const squares = [0, 1, 4, 2, 2, 4, 1]; // x² mod 7 for x=0..6

export default function Step1Irred() {
  return (
    <svg viewBox="0 0 490 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={245} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.base} {...fade(0)}>
        x² + 1 = 0  →  x² ≡ 6 (mod 7) 인 x가 있는가?
      </motion.text>

      {/* 테이블 헤더 */}
      <motion.g {...fade(0.2)}>
        <text x={50} y={48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.base}>x</text>
        <text x={145} y={48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.base}>x² mod 7</text>
        <text x={240} y={48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.base}>= 6?</text>
        <line x1={20} y1={55} x2={285} y2={55} stroke={`${C.base}25`} strokeWidth={0.5} />
      </motion.g>

      {/* 각 행이 순차적으로 등장 */}
      {squares.map((sq, i) => (
        <motion.g key={i} {...fade(0.4 + i * 0.2)}>
          <text x={50} y={76 + i * 22} textAnchor="middle" fontSize={12} fill={C.base}>{i}</text>
          <text x={145} y={76 + i * 22} textAnchor="middle" fontSize={12} fill={C.base}>{sq}</text>
          <text x={240} y={76 + i * 22} textAnchor="middle" fontSize={12} fill={C.fail}>✗</text>
        </motion.g>
      ))}

      {/* 결론 (전부 나온 후) */}
      <motion.g {...fade(0.4 + 7 * 0.2)}>
        <rect x={310} y={60} width={168} height={80} rx={6}
          fill={`${C.fail}12`} stroke={`${C.fail}35`} strokeWidth={0.7} />
        <text x={394} y={84} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.fail}>
          6이 없다!
        </text>
        <text x={394} y={104} textAnchor="middle" fontSize={10} fill={C.m}>
          x² ≡ −1인 x 없음
        </text>
        <text x={394} y={122} textAnchor="middle" fontSize={10} fill={C.m}>
          → 인수분해 불가
        </text>
      </motion.g>

      <motion.g {...fade(0.4 + 8 * 0.2)}>
        <rect x={20} y={218} width={450} height={28} rx={5}
          fill={`${C.base}10`} stroke={`${C.base}25`} strokeWidth={0.5} />
        <text x={245} y={237} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.base}>
          x² + 1 은 F₇에서 기약 → 근 u는 F₇ 바깥의 새로운 원소
        </text>
      </motion.g>
    </svg>
  );
}
