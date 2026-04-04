import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

export function CheckStep() {
  const checks = [
    { label: 'Merkle inclusion', sub: 'BMT multi-proof verify', c: C2 },
    { label: 'Checksum match', sub: "shard·H == Z'[indices]", c: C3 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        ZODA check() — 2단계 검증
      </text>
      {checks.map((c, i) => (
        <g key={i}>
          <rect x={40} y={40 + i * 55} width={400} height={40} rx={5} fill="var(--card)" />
          <rect x={40} y={40 + i * 55} width={400} height={40} rx={5}
            fill={`${c.c}10`} stroke={c.c} strokeWidth={0.8} />
          <text x={160} y={60 + i * 55} textAnchor="middle" fontSize={10} fontWeight={500} fill={c.c}>
            {c.label}
          </text>
          <text x={360} y={60 + i * 55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            {c.sub}
          </text>
        </g>
      ))}
      <rect x={60} y={145} width={360} height={20} rx={3} fill={`${C1}08`} stroke={C1} strokeWidth={0.4} />
      <text x={240} y={159} textAnchor="middle" fontSize={10} fill={C1}>
        ValidatingScheme: 샤드 1개만 검증해도 전체 데이터 유효성 보장
      </text>
    </motion.g>
  );
}

export function ShardStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        Strong → Weak 변환
      </text>
      {[
        { label: 'StrongShard', fields: 'rows + proof + checksum + root', c: C1, x: 30 },
        { label: 'WeakShard', fields: 'rows + proof만', c: C2, x: 260 },
      ].map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={35} width={190} height={50} rx={5} fill="var(--card)" />
          <rect x={s.x} y={35} width={190} height={50} rx={5}
            fill={`${s.c}10`} stroke={s.c} strokeWidth={0.8} />
          <text x={s.x + 95} y={55} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.c}>
            {s.label}
          </text>
          <text x={s.x + 95} y={73} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            {s.fields}
          </text>
        </g>
      ))}
      <line x1={220} y1={60} x2={260} y2={60} stroke="var(--border)" strokeWidth={0.6} />
      <text x={240} y={52} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">weaken()</text>
      <rect x={100} y={105} width={280} height={40} rx={5} fill="var(--card)" />
      <rect x={100} y={105} width={280} height={40} rx={5} fill={`${C3}10`} stroke={C3} strokeWidth={0.8} />
      <text x={240} y={123} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>CheckedShard</text>
      <text x={240} y={137} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        check() 통과 → decode() 참여 가능
      </text>
    </motion.g>
  );
}
