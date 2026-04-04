import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.6 };
const C = { g1: '#6366f1', g2: '#10b981', gt: '#f59e0b', muted: 'var(--muted-foreground)' };

/** Step 2: Why extension fields — G1 × G2 → GT diagram */
export default function WhyExtension() {
  return (
    <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* G1 box */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={20} y={30} width={110} height={74} rx={6}
          fill={`${C.g1}08`} stroke={C.g1} strokeWidth={1} />
        <text x={75} y={52} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.g1}>G1</text>
        <text x={75} y={68} textAnchor="middle" fontSize={9} fill={C.g1}>Fp 위 곡선점</text>
        <text x={75} y={83} textAnchor="middle" fontSize={9} fill={C.muted}>좌표 = 단일 정수</text>
        <text x={75} y={97} textAnchor="middle" fontSize={9} fill={C.muted}>(x, y) ∈ Fp × Fp</text>
      </motion.g>

      {/* × symbol */}
      <motion.text x={148} y={68} textAnchor="middle" fontSize={16} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ ...sp, delay: 0.15 }}>
        ×
      </motion.text>

      {/* G2 box */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={168} y={30} width={120} height={74} rx={6}
          fill={`${C.g2}08`} stroke={C.g2} strokeWidth={1} />
        <text x={228} y={52} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.g2}>G2</text>
        <text x={228} y={68} textAnchor="middle" fontSize={9} fill={C.g2}>Fp² 위 곡선점</text>
        <text x={228} y={83} textAnchor="middle" fontSize={9} fill={C.muted}>좌표 = a + bu 형태</text>
        <text x={228} y={97} textAnchor="middle" fontSize={9} fill={C.muted}>Fp 원소 2개 → 1좌표</text>
      </motion.g>

      {/* → arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>
        <line x1={300} y1={65} x2={340} y2={65} stroke={C.gt} strokeWidth={1} />
        <polygon points="340,62 346,65 340,68" fill={C.gt} />
        <text x={323} y={56} textAnchor="middle" fontSize={9} fontWeight={500} fill={C.gt}>e(P,Q)</text>
      </motion.g>

      {/* GT box */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={350} y={30} width={120} height={74} rx={6}
          fill={`${C.gt}08`} stroke={C.gt} strokeWidth={1} />
        <text x={410} y={52} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.gt}>GT</text>
        <text x={410} y={68} textAnchor="middle" fontSize={9} fill={C.gt}>Fp¹² 위 원소</text>
        <text x={410} y={83} textAnchor="middle" fontSize={9} fill={C.muted}>Fp 원소 12개로 구성</text>
        <text x={410} y={97} textAnchor="middle" fontSize={9} fill={C.muted}>페어링 결과가 사는 곳</text>
      </motion.g>

      {/* Bottom: extension field requirement */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        {/* Underline bars showing field size */}
        <rect x={20} y={120} width={110} height={18} rx={3}
          fill={`${C.g1}12`} stroke={`${C.g1}30`} strokeWidth={0.5} />
        <text x={75} y={133} textAnchor="middle" fontSize={9} fill={C.g1}>Fp (1개)</text>

        <rect x={168} y={120} width={120} height={18} rx={3}
          fill={`${C.g2}12`} stroke={`${C.g2}30`} strokeWidth={0.5} />
        <text x={228} y={133} textAnchor="middle" fontSize={9} fill={C.g2}>Fp² (2개)</text>

        <rect x={350} y={120} width={120} height={18} rx={3}
          fill={`${C.gt}12`} stroke={`${C.gt}30`} strokeWidth={0.5} />
        <text x={410} y={133} textAnchor="middle" fontSize={9} fill={C.gt}>Fp¹² (12개)</text>

        <text x={240} y={158} textAnchor="middle" fontSize={9} fill={C.muted}>
          확장 차수가 높을수록 원소 표현에 더 많은 Fp 원소 필요 → 연산 비용 증가
        </text>
      </motion.g>
    </svg>
  );
}
