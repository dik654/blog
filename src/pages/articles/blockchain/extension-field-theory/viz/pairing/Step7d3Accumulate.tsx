import { motion } from 'framer-motion';

const C = { g1: '#6366f1', g2: '#10b981', ml: '#ec4899', gt: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** 254 measurements accumulated → f contains P-Q relationship */
export default function Step7d3Accumulate() {
  const snaps = [
    { t: 'Q', l: 'ℓ(P)', d: 0.4 },
    { t: '2Q', l: 'ℓ\'(P)', d: 0.8 },
    { t: '4Q', l: 'ℓ\'\'(P)', d: 1.2 },
    { t: '8Q', l: 'ℓ\'\'\'(P)', d: 1.6 },
  ];

  return (
    <svg viewBox="0 0 540 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.gt} {...fade(0)}>254번 측정을 곱으로 누적 → f</motion.text>

      {/* Each snapshot: T position → ℓ(P) value → into f */}
      {snaps.map((s, i) => (
        <motion.g key={i} {...fade(s.d)}>
          {/* T position */}
          <circle cx={50 + i * 120} cy={74} r={6} fill={C.g2} />
          <text x={50 + i * 120} y={64} textAnchor="middle" fontSize={11}
            fontWeight={600} fill={C.g2}>{s.t}</text>

          {/* Arrow down to ℓ(P) */}
          <line x1={50 + i * 120} y1={82} x2={50 + i * 120} y2={98}
            stroke={`${C.m}30`} strokeWidth={0.6} />
          <polygon points={`${47 + i * 120},98 ${50 + i * 120},104 ${53 + i * 120},98`}
            fill={`${C.m}30`} />

          {/* ℓ(P) value */}
          <rect x={14 + i * 120} y={106} width={72} height={24} rx={4}
            fill={`${C.ml}15`} stroke={`${C.ml}35`} strokeWidth={0.5} />
          <text x={50 + i * 120} y={122} textAnchor="middle" fontSize={11}
            fontWeight={500} fill={C.ml}>{s.l}</text>
        </motion.g>
      ))}

      {/* dots */}
      <motion.text x={510} y={118} fontSize={14} fill={C.m} {...fade(1.8)}>…</motion.text>

      {/* "multiply all" arrows converging to f */}
      <motion.g {...fade(2.0)}>
        <text x={270} y={154} textAnchor="middle" fontSize={12} fill={C.m}>
          × 곱으로 합친다
        </text>
        {snaps.map((_, i) => (
          <line key={i} x1={50 + i * 120} y1={132} x2={270} y2={170}
            stroke={`${C.gt}25`} strokeWidth={0.5} />
        ))}
      </motion.g>

      {/* f result */}
      <motion.g {...fade(2.3)}>
        <rect x={120} y={174} width={300} height={34} rx={6}
          fill={`${C.gt}15`} stroke={C.gt} strokeWidth={0.8} />
        <text x={270} y={190} textAnchor="middle" fontSize={13} fontWeight={600} fill={C.gt}>
          f = 254개의 ℓ(P) 값을 모두 곱한 것
        </text>
      </motion.g>

      {/* What f contains */}
      <motion.g {...fade(2.7)}>
        <rect x={40} y={224} width={460} height={44} rx={6}
          fill={`${C.ml}08`} stroke={`${C.ml}20`} strokeWidth={0.5} />
        <text x={270} y={244} textAnchor="middle" fontSize={12} fill={C.ml}>
          각 ℓ(P) = "그 순간 T와 P의 관계" (한 스냅샷)
        </text>
        <text x={270} y={262} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.gt}>
          전부 곱하면 = P와 Q의 전체 관계 → 이것이 페어링 원재료
        </text>
      </motion.g>
    </svg>
  );
}
