import { motion } from 'framer-motion';

const C = { fe: '#a78bfa', gt: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

export default function Step3Pairing() {
  return (
    <svg viewBox="0 0 490 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={245} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.fe} {...fade(0)}>
        페어링에서의 역할: 거듭제곱을 공짜로
      </motion.text>

      {/* 문제 */}
      <motion.g {...fade(0.4)}>
        <rect x={20} y={40} width={450} height={38} rx={6}
          fill={`${C.gt}10`} stroke={`${C.gt}25`} strokeWidth={0.5} />
        <text x={35} y={58} fontSize={11} fontWeight={500} fill={C.gt}>
          Final Exp에서 f^(p^k) 를 계산해야 한다  (k = 1, 2, 3, 6, ...)
        </text>
        <text x={35} y={72} fontSize={10} fill={C.m}>
          나이브: p^k ≈ 2²⁵⁴ᵏ 번 곱셈? → 불가능
        </text>
      </motion.g>

      {/* Frobenius 해법 */}
      <motion.g {...fade(0.9)}>
        <rect x={20} y={90} width={450} height={52} rx={6}
          fill={`${C.fe}12`} stroke={`${C.fe}30`} strokeWidth={0.6} />
        <text x={35} y={110} fontSize={12} fontWeight={600} fill={C.fe}>
          Frobenius로 대체: f^p = 계수 재배열
        </text>
        <text x={35} y={128} fontSize={10} fill={C.m}>
          Fp12 원소의 12개 계수에 미리 계산한 상수를 곱해 자리를 바꿈
        </text>
        <text x={35} y={142} fontSize={10} fill={C.m}>
          곱셈이 아닌 "치환" → 비용 ≈ 0
        </text>
      </motion.g>

      {/* 비용 비교 */}
      <motion.g {...fade(1.4)}>
        <text x={245} y={170} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.fe}>
          비용 비교
        </text>
      </motion.g>

      {[
        { op: 'Fp12 곱셈 1번', cost: 'Fp 곱셈 54번', c: C.gt, w: 120 },
        { op: 'Frobenius 1번', cost: 'Fp 곱셈 ~0번', c: C.fe, w: 8 },
      ].map((r, i) => (
        <motion.g key={r.op} {...fade(1.6 + i * 0.3)}>
          <text x={30} y={194 + i * 22} fontSize={11} fill={r.c}>{r.op}</text>
          <text x={200} y={194 + i * 22} fontSize={11} fill={C.m}>{r.cost}</text>
          <rect x={340} y={184 + i * 22} width={r.w} height={12} rx={3}
            fill={`${r.c}35`} stroke={`${r.c}60`} strokeWidth={0.4} />
        </motion.g>
      ))}
    </svg>
  );
}
