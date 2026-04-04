import { motion } from 'framer-motion';

const C = { g1: '#6366f1', g2: '#10b981', gt: '#f59e0b', miller: '#ec4899', m: 'var(--muted-foreground)' };

const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { duration: 0.4, delay: d },
});

export default function Step4Pairing() {
  return (
    <svg viewBox="0 0 490 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* ❶ 입력 */}
      <motion.g {...fade(0)}>
        <rect x={20} y={30} width={80} height={40} rx={6}
          fill={`${C.g1}20`} stroke={C.g1} strokeWidth={1} />
        <text x={60} y={55} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.g1}>P ∈ G1</text>
      </motion.g>
      <motion.g {...fade(0.3)}>
        <rect x={120} y={30} width={80} height={40} rx={6}
          fill={`${C.g2}20`} stroke={C.g2} strokeWidth={1} />
        <text x={160} y={55} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.g2}>Q ∈ G2</text>
      </motion.g>

      {/* ❷ 페어링 함수 */}
      <motion.g {...fade(0.7)}>
        <line x1={205} y1={50} x2={240} y2={50} stroke={`${C.m}50`} strokeWidth={0.8} />
        <polygon points="240,47 246,50 240,53" fill={`${C.m}50`} />
        <rect x={250} y={28} width={90} height={44} rx={6}
          fill={`${C.gt}20`} stroke={C.gt} strokeWidth={1} />
        <text x={295} y={48} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.gt}>e(P, Q)</text>
        <text x={295} y={64} textAnchor="middle" fontSize={9} fill={C.m}>페어링</text>
      </motion.g>

      {/* ❸ 출력 */}
      <motion.g {...fade(1.1)}>
        <line x1={345} y1={50} x2={380} y2={50} stroke={`${C.m}50`} strokeWidth={0.8} />
        <polygon points="380,47 386,50 380,53" fill={`${C.m}50`} />
        <rect x={390} y={28} width={80} height={44} rx={6}
          fill={`${C.gt}18`} stroke={C.gt} strokeWidth={1} />
        <text x={430} y={48} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.gt}>GT 원소</text>
        <text x={430} y={64} textAnchor="middle" fontSize={9} fill={C.m}>Fp¹² 값</text>
      </motion.g>

      {/* ❹ 양선형성 */}
      <motion.g {...fade(1.6)}>
        <line x1={20} y1={95} x2={470} y2={95} stroke={`${C.gt}15`} strokeWidth={0.5} />
        <text x={245} y={120} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.gt}>
          핵심: 양선형성 (bilinearity)
        </text>
      </motion.g>

      <motion.g {...fade(2.0)}>
        <rect x={70} y={132} width={350} height={36} rx={6}
          fill={`${C.miller}10`} stroke={`${C.miller}30`} strokeWidth={0.6} />
        <text x={245} y={155} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.miller}>
          e(aP, bQ) = e(P, Q)^(ab)
        </text>
      </motion.g>

      {/* ❺ 의미 */}
      <motion.g {...fade(2.5)}>
        <text x={245} y={192} textAnchor="middle" fontSize={12} fill={C.m}>
          a, b를 모르면서도 aP, bQ만으로 곱셈 관계를 검증할 수 있다
        </text>
      </motion.g>

      <motion.g {...fade(2.9)}>
        <text x={245} y={220} textAnchor="middle" fontSize={11} fill={C.gt}>
          Groth16 검증: e(A,B) = e(α,β) · e(L,γ) · e(C,δ)
        </text>
        <text x={245} y={240} textAnchor="middle" fontSize={10} fill={C.m}>
          양변이 GT에서 같으면 증명 유효 → 페어링 3번으로 검증 완료
        </text>
      </motion.g>
    </svg>
  );
}
