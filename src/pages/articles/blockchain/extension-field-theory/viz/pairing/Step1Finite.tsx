import { motion } from 'framer-motion';

const C = { g1: '#6366f1', m: 'var(--muted-foreground)' };

const curveMini = {
  u: 'M 25 80 C 32 64 38 58 46 56 C 56 52 68 51 82 52 C 98 53 110 50 122 45 C 132 40 142 32 150 22',
  l: 'M 25 80 C 32 96 38 102 46 104 C 56 108 68 109 82 108 C 98 107 110 110 122 115 C 132 120 142 128 150 138',
};

const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { duration: 0.4, delay: d },
});

// 유한체 위 흩어진 점 좌표
const dots = [
  [280,40],[310,55],[340,35],[295,70],[325,80],[355,50],[285,95],
  [315,105],[345,75],[370,90],[300,115],[330,120],[360,110],[280,130],[350,135],
];

export default function Step1Finite() {
  return (
    <svg viewBox="0 0 490 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* 왼쪽: 실수 곡선 */}
      <motion.g {...fade(0)}>
        <rect x={10} y={10} width={170} height={150} rx={8}
          fill={`${C.g1}08`} stroke={`${C.g1}20`} strokeWidth={0.6} />
        <path d={curveMini.u} fill="none" stroke={C.g1} strokeWidth={1.8} />
        <path d={curveMini.l} fill="none" stroke={C.g1} strokeWidth={1.8} />
        <text x={90} y={178} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.g1}>
          ℝ 위: 매끄러운 곡선
        </text>
      </motion.g>

      {/* 화살표 */}
      <motion.g {...fade(0.6)}>
        <line x1={190} y1={80} x2={240} y2={80} stroke={C.g1} strokeWidth={1} />
        <polygon points="240,77 246,80 240,83" fill={C.g1} />
        <text x={218} y={70} textAnchor="middle" fontSize={10} fill={C.m}>mod p</text>
      </motion.g>

      {/* 오른쪽: 유한체 점들 */}
      <motion.g {...fade(0.6)}>
        <rect x={258} y={10} width={170} height={150} rx={8}
          fill={`${C.g1}08`} stroke={`${C.g1}20`} strokeWidth={0.6} />
      </motion.g>
      {dots.map(([x, y], i) => (
        <motion.circle key={i} cx={x} cy={y} r={3} fill={`${C.g1}80`}
          {...fade(0.8 + i * 0.06)} />
      ))}
      <motion.text x={343} y={178} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.g1}
        {...fade(1.8)}>
        Fp 위: 흩어진 점들
      </motion.text>

      {/* 하단 설명 */}
      <motion.g {...fade(2.2)}>
        <line x1={10} y1={195} x2={480} y2={195} stroke={`${C.g1}15`} strokeWidth={0.5} />
        <text x={245} y={215} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.g1}>
          곡선 모양은 사라지지만, 점 덧셈 공식은 동일하게 작동한다
        </text>
      </motion.g>
    </svg>
  );
}
