import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

export function SchemeStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {[
        { label: 'Scheme', sub: 'encode → check → decode', c: C1, y: 20 },
        { label: 'PhasedScheme', sub: 'encode → weaken → check → decode', c: C2, y: 80 },
      ].map((s, i) => (
        <g key={i}>
          <rect x={60} y={s.y} width={360} height={44} rx={6} fill="var(--card)" />
          <rect x={60} y={s.y} width={360} height={44} rx={6}
            fill={`${s.c}10`} stroke={s.c} strokeWidth={0.8} />
          <text x={150} y={s.y + 22} textAnchor="middle" fontSize={11} fontWeight={600} fill={s.c}>
            {s.label}
          </text>
          <text x={340} y={s.y + 22} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            {s.sub}
          </text>
          {i === 1 && (
            <text x={240} y={s.y + 38} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              Strong(로컬 완전검증) → Weak(전달 경량검증) 분리
            </text>
          )}
        </g>
      ))}
      <text x={240} y={152} textAnchor="middle" fontSize={10} fill={C3}>
        ZODA는 PhasedScheme + ValidatingScheme 구현
      </text>
    </motion.g>
  );
}

export function EncodeStep() {
  const steps = [
    { label: 'Matrix n·S×c', c: C1 },
    { label: 'RS encode', c: C2 },
    { label: 'Merkle tree', c: C3 },
    { label: 'Z = X · H', c: C1 },
    { label: 'Shards', c: C2 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={15} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        ZODA encode() 파이프라인
      </text>
      {steps.map((s, i) => (
        <g key={i}>
          <rect x={10 + i * 92} y={30} width={84} height={34} rx={4} fill="var(--card)" />
          <rect x={10 + i * 92} y={30} width={84} height={34} rx={4}
            fill={`${s.c}10`} stroke={s.c} strokeWidth={0.7} />
          <text x={52 + i * 92} y={51} textAnchor="middle" fontSize={10} fontWeight={500} fill={s.c}>
            {s.label}
          </text>
          {i < 4 && (
            <line x1={94 + i * 92} y1={47} x2={102 + i * 92} y2={47} stroke="var(--border)" strokeWidth={0.4} />
          )}
        </g>
      ))}
      <rect x={30} y={85} width={420} height={55} rx={5} fill="var(--card)" />
      <rect x={30} y={85} width={420} height={55} rx={5} fill={`${C3}06`} stroke={C3} strokeWidth={0.5} />
      <text x={240} y={103} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>
        Fiat-Shamir transcript
      </text>
      <text x={240} y={117} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        commit(data_bytes + root) → checking_matrix H (결정론적)
      </text>
      <text x={240} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        commit(checksum) → shuffle_indices (샤드 행 할당)
      </text>
    </motion.g>
  );
}
