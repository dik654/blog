import { motion } from 'framer-motion';

const C = { base: '#6366f1', conj: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

export default function Step0What() {
  return (
    <svg viewBox="0 0 490 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={245} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.base} {...fade(0)}>
        Frobenius 사상 φ(x) = x^p
      </motion.text>

      <motion.g {...fade(0.4)}>
        <rect x={30} y={40} width={200} height={50} rx={6}
          fill={`${C.base}12`} stroke={`${C.base}30`} strokeWidth={0.6} />
        <text x={130} y={62} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.base}>
          입력: 확장체 원소
        </text>
        <text x={130} y={80} textAnchor="middle" fontSize={11} fill={C.m}>
          예) 3 + 5u ∈ F₇²
        </text>
      </motion.g>

      <motion.g {...fade(0.8)}>
        <line x1={235} y1={65} x2={265} y2={65} stroke={`${C.base}50`} strokeWidth={0.8} />
        <polygon points="265,62 271,65 265,68" fill={`${C.base}50`} />
        <text x={253} y={56} textAnchor="middle" fontSize={9} fill={C.base}>p제곱</text>
      </motion.g>

      <motion.g {...fade(1.2)}>
        <rect x={275} y={40} width={200} height={50} rx={6}
          fill={`${C.conj}12`} stroke={`${C.conj}30`} strokeWidth={0.6} />
        <text x={375} y={62} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.conj}>
          출력: 다른 원소
        </text>
        <text x={375} y={80} textAnchor="middle" fontSize={11} fill={C.m}>
          → 3 + 2u  (= 3 − 5u)
        </text>
      </motion.g>

      <motion.g {...fade(1.6)}>
        <line x1={30} y1={108} x2={460} y2={108} stroke={`${C.base}15`} strokeWidth={0.5} />
        <text x={245} y={130} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.base}>
          핵심: p제곱인데 결과는 u의 부호만 뒤집힌다
        </text>
        <text x={245} y={150} textAnchor="middle" fontSize={11} fill={C.m}>
          복소수 켤레 (a+bi → a−bi) 와 정확히 같은 연산
        </text>
        <text x={245} y={170} textAnchor="middle" fontSize={11} fill={C.m}>
          왜 그런지 다음 스텝에서 유도
        </text>
      </motion.g>
    </svg>
  );
}
