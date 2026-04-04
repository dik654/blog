import { motion } from 'framer-motion';

const C = { g1: '#6366f1', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

export default function Step2G1() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.g1} {...fade(0)}>G1 — BN254 곡선 위 점들의 군</motion.text>

      {/* 곡선 정의 */}
      <motion.g {...fade(0.3)}>
        <rect x={20} y={40} width={480} height={70} rx={6}
          fill={`${C.g1}08`} stroke={`${C.g1}20`} strokeWidth={0.6} />
        <text x={36} y={62} fontSize={12} fontWeight={600} fill={C.g1}>곡선 정의</text>
        <text x={36} y={82} fontSize={12} fill={C.m}>
          y² = x³ + 3 (Barreto-Naehrig 곡선, BN254)
        </text>
        <text x={36} y={100} fontSize={11} fill={C.m}>
          좌표 공간: Fp (p = 256-bit 소수, 약 10⁷⁷)
        </text>
      </motion.g>

      {/* 군 = 집합 + 연산 */}
      <motion.g {...fade(0.8)}>
        <text x={260} y={132} textAnchor="middle" fontSize={12} fontWeight={600}
          fill={C.g1}>군(group) = 집합 + 연산</text>
      </motion.g>

      {/* 집합 */}
      <motion.g {...fade(1.0)}>
        <rect x={20} y={142} width={240} height={70} rx={6}
          fill={`${C.g1}08`} stroke={`${C.g1}20`} strokeWidth={0.6} />
        <text x={36} y={164} fontSize={12} fontWeight={600} fill={C.g1}>집합 (원소)</text>
        <text x={36} y={184} fontSize={11} fill={C.m}>
          곡선 위 점 (x, y) + 무한원점 O
        </text>
        <text x={36} y={202} fontSize={11} fill={C.m}>
          위수 r ≈ 10⁷⁶ (254-bit 소수)
        </text>
      </motion.g>

      {/* 연산 */}
      <motion.g {...fade(1.3)}>
        <rect x={280} y={142} width={220} height={70} rx={6}
          fill={`${C.g1}08`} stroke={`${C.g1}20`} strokeWidth={0.6} />
        <text x={296} y={164} fontSize={12} fontWeight={600} fill={C.g1}>연산 (점 덧셈)</text>
        <text x={296} y={184} fontSize={11} fill={C.m}>
          두 점 P, Q → P+Q (기하학적)
        </text>
        <text x={296} y={202} fontSize={11} fill={C.m}>
          항등원 O, 역원 −P 존재
        </text>
      </motion.g>

      {/* 한 줄 요약: 왜 G1이 중요한가 */}
      <motion.g {...fade(1.7)}>
        <rect x={20} y={228} width={480} height={36} rx={5}
          fill={`${C.g1}10`} stroke={`${C.g1}25`} strokeWidth={0.5} />
        <text x={260} y={250} textAnchor="middle" fontSize={12} fill={C.g1}>
          Groth16에서 증명자는 G1 점의 선형결합(스칼라곱)으로 증명을 생성한다
        </text>
      </motion.g>
    </svg>
  );
}
