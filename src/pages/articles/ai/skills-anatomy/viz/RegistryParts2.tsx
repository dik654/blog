import { motion } from 'framer-motion';

const CX = 230;

export function SkillChaining() {
  const chain = [
    { label: 'code-review', c: '#6366f1' },
    { label: 'test-gen', c: '#10b981' },
    { label: 'commit-msg', c: '#f59e0b' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={CX} y={80} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">
        PR 리뷰 워크플로우
      </text>
      {chain.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}>
          <rect x={40 + i * 145} y={95} width={120} height={34} rx={5}
            fill={`${s.c}15`} stroke={s.c} strokeWidth={1.5} />
          <text x={100 + i * 145} y={116} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={s.c}>{s.label}</text>
          {i < 2 && (
            <motion.line
              x1={160 + i * 145} y1={112}
              x2={185 + i * 145} y2={112}
              stroke={s.c} strokeWidth={1.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4 + i * 0.2 }} />
          )}
        </motion.g>
      ))}
      <text x={CX} y={150} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">
        각 스킬의 출력 → 다음 스킬의 입력
      </text>
    </motion.g>
  );
}
