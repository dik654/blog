import { motion } from 'framer-motion';

const CX = 230;

export function VersionTimeline() {
  const versions = [
    { v: 'v1.0.0', label: '초기 릴리스', c: '#6366f1' },
    { v: 'v1.1.0', label: '파라미터 추가', c: '#10b981' },
    { v: 'v2.0.0', label: '브레이킹 변경', c: '#f59e0b' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {versions.map((ver, i) => (
        <motion.g key={ver.v}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={60 + i * 125} y={80} width={110} height={40} rx={5}
            fill={`${ver.c}12`} stroke={ver.c} strokeWidth={1} />
          <text x={115 + i * 125} y={98} textAnchor="middle"
            fontSize={10} fontWeight={700} fill={ver.c}>{ver.v}</text>
          <text x={115 + i * 125} y={113} textAnchor="middle"
            fontSize={9} fill="var(--muted-foreground)">{ver.label}</text>
          {i < 2 && (
            <line x1={170 + i * 125} y1={100} x2={185 + i * 125} y2={100}
              stroke="var(--border)" strokeWidth={1} />
          )}
        </motion.g>
      ))}
      <text x={CX} y={145} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">
        semver — 의존성 + 호환성 관리
      </text>
    </motion.g>
  );
}

export function ContributionPipeline() {
  const phases = [
    { label: 'PR 제출', c: '#6366f1' },
    { label: '자동 검증', c: '#10b981' },
    { label: '배포', c: '#f59e0b' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {phases.map((p, i) => (
        <motion.g key={p.label}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}>
          <rect x={50 + i * 140} y={80} width={110} height={34} rx={5}
            fill={`${p.c}15`} stroke={p.c} strokeWidth={1.5} />
          <text x={105 + i * 140} y={101} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={p.c}>{p.label}</text>
          {i < 2 && (
            <motion.line
              x1={160 + i * 140} y1={97}
              x2={190 + i * 140} y2={97}
              stroke={p.c} strokeWidth={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3 + i * 0.2 }} />
          )}
        </motion.g>
      ))}
      <text x={CX} y={135} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">
        문법 체크 + 파라미터 유효성 + 보안 스캔
      </text>
    </motion.g>
  );
}
