import { motion } from 'framer-motion';

const C = { g1: '#6366f1', g2: '#10b981', tw: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Step 3d: Twist solves it — Fp12 → Fp2 compression */
export default function Step3dTwist() {
  return (
    <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.tw} {...fade(0)}>④ 해결: twist — 곡선 방정식을 변형</motion.text>

      {/* Twist formula */}
      <motion.g {...fade(0.3)}>
        <rect x={40} y={42} width={440} height={44} rx={6}
          fill={`${C.tw}08`} stroke={`${C.tw}25`} strokeWidth={0.6} />
        <text x={260} y={64} textAnchor="middle" fontSize={12} fill={C.m}>
          E: y²=x³+3 의 상수를 ξ (Fp² 원소)로 나눠 새 곡선을 만든다
        </text>
        <text x={260} y={80} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.tw}>
          E': y² = x³ + 3/ξ
        </text>
      </motion.g>

      {/* Key: coordinates stay in Fp2 */}
      <motion.g {...fade(0.8)}>
        <text x={40} y={112} fontSize={12} fontWeight={500} fill={C.g2}>
          E' 위의 점들은 좌표가 Fp² 원소로 충분하다:
        </text>
        <text x={52} y={136} fontSize={12} fill={C.m}>점 하나 = (x, y)</text>
        <text x={52} y={156} fontSize={12} fill={C.m}>x = a + bu (Fp 원소 2개)</text>
        <text x={52} y={176} fontSize={12} fill={C.m}>y = c + du (Fp 원소 2개)</text>
      </motion.g>

      {/* Visual: 4 blocks only */}
      <motion.g {...fade(1.3)}>
        <text x={300} y={130} fontSize={12} fontWeight={500} fill={C.g2}>점 1개 =</text>
        {['a', 'b', 'c', 'd'].map((label, i) => (
          <motion.rect key={i} x={300 + i * 36} y={140} width={30} height={26} rx={4}
            fill={`${C.g2}18`} stroke={`${C.g2}40`} strokeWidth={0.6}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 1.4 + i * 0.1 }} />
        ))}
        {['a', 'b', 'c', 'd'].map((label, i) => (
          <text key={`l${i}`} x={315 + i * 36} y={158} textAnchor="middle"
            fontSize={11} fill={C.g2}>{label}</text>
        ))}
        <text x={300 + 4 * 36 + 10} y={158} fontSize={12} fontWeight={600} fill={C.g2}>
          Fp 원소 4개!
        </text>
      </motion.g>

      {/* Isomorphism note */}
      <motion.g {...fade(1.8)}>
        <rect x={40} y={190} width={440} height={38} rx={6}
          fill={`${C.tw}10`} stroke={`${C.tw}25`} strokeWidth={0.6} />
        <text x={260} y={210} textAnchor="middle" fontSize={12} fill={C.tw}>
          E'(Fp²)의 G2 ≅ E(Fp²)의 G2 후보 — 수학적으로 동일한 군
        </text>
        <text x={260} y={224} textAnchor="middle" fontSize={11} fill={C.m}>
          표현만 Fp¹² (24개) → Fp² (4개)로 축소. 역변환(untwist) 가능
        </text>
      </motion.g>

      {/* Bottom: final comparison */}
      <motion.g {...fade(2.2)}>
        <rect x={40} y={240} width={200} height={28} rx={5}
          fill={`${C.g1}10`} stroke={`${C.g1}20`} strokeWidth={0.5} />
        <text x={140} y={259} textAnchor="middle" fontSize={11} fill={C.g1}>
          G1: 점 = Fp 2개
        </text>
        <rect x={280} y={240} width={200} height={28} rx={5}
          fill={`${C.g2}10`} stroke={`${C.g2}20`} strokeWidth={0.5} />
        <text x={380} y={259} textAnchor="middle" fontSize={11} fill={C.g2}>
          G2: 점 = Fp 4개
        </text>
      </motion.g>
    </svg>
  );
}
