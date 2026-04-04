import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.6 };
const C = { fp: '#6366f1', tower: '#10b981', gt: '#f59e0b', muted: 'var(--muted-foreground)' };

/** Step 3: BN254 full picture — tower + where G1/G2/GT live */
export default function PairingSummary() {
  const layers = [
    { label: 'Fp', y: 140, w: 80, c: C.fp, role: 'G1 좌표', ext: '' },
    { label: 'Fp²', y: 105, w: 120, c: C.tower, role: 'G2 좌표', ext: 'u²=-1' },
    { label: 'Fp⁶', y: 70, w: 170, c: C.tower, role: '중간 단계', ext: 'v³=ξ' },
    { label: 'Fp¹²', y: 35, w: 220, c: C.gt, role: 'GT (페어링 결과)', ext: 'w²=v' },
  ];

  return (
    <svg viewBox="0 0 480 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Tower on the left */}
      {layers.map((l, i) => {
        const x = 130 - l.w / 2;
        return (
          <motion.g key={l.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={x} y={l.y} width={l.w} height={28} rx={4}
              fill={`${l.c}10`} stroke={l.c} strokeWidth={1} />
            <text x={130} y={l.y + 17} textAnchor="middle" fontSize={9} fontWeight={600}
              fill={l.c}>{l.label}</text>
            {/* Extension polynomial label */}
            {l.ext && (
              <text x={x + l.w + 6} y={l.y + 17} fontSize={9} fill={`${l.c}90`}>{l.ext}</text>
            )}
            {/* Dimension bar */}
            {i > 0 && (
              <motion.line x1={130} y1={l.y + 28} x2={130} y2={layers[i - 1].y}
                stroke={`${l.c}40`} strokeWidth={0.6} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ ...sp, delay: i * 0.12 + 0.1 }} />
            )}
          </motion.g>
        );
      })}

      {/* Right side: role mapping */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        {layers.map((l, i) => (
          <g key={`role-${i}`}>
            <line x1={130 + l.w / 2 + (l.ext ? 30 : 4)} y1={l.y + 14}
              x2={300} y2={l.y + 14}
              stroke={`${l.c}20`} strokeWidth={0.5} strokeDasharray="2 3" />
            <rect x={302} y={l.y + 2} width={150} height={22} rx={4}
              fill={`${l.c}08`} stroke={`${l.c}25`} strokeWidth={0.5} />
            <text x={377} y={l.y + 16} textAnchor="middle" fontSize={9} fill={l.c}>
              {l.role}
            </text>
          </g>
        ))}
      </motion.g>

      {/* Bottom: dimension summary */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <text x={240} y={185} textAnchor="middle" fontSize={9} fill={C.muted}>
          2 × 3 × 2 = 12차 확장 — 타워 구조로 단계적 구성
        </text>
      </motion.g>
    </svg>
  );
}
