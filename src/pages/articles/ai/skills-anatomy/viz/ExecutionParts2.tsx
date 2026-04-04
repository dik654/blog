import { motion } from 'framer-motion';

const W = 460;

export function SubAgentPattern() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={40} y={75} width={160} height={70} rx={6}
        fill="#6366f108" stroke="#6366f1" strokeWidth={1.5} />
      <text x={120} y={92} textAnchor="middle" fontSize={9}
        fontWeight={700} fill="#6366f1">메인 에이전트</text>
      <text x={120} y={108} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">컨텍스트 A</text>
      <motion.line x1={200} y1={110} x2={250} y2={110}
        stroke="#10b981" strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }} />
      <rect x={250} y={75} width={170} height={70} rx={6}
        fill="#10b98108" stroke="#10b981" strokeWidth={1.5}
        strokeDasharray="4 3" />
      <text x={335} y={92} textAnchor="middle" fontSize={9}
        fontWeight={700} fill="#10b981">서브에이전트 (스킬)</text>
      <text x={335} y={108} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">격리된 컨텍스트 B</text>
      <text x={335} y={125} textAnchor="middle" fontSize={9}
        fill="#f59e0b">결과만 반환 →</text>
    </motion.g>
  );
}

export function ToolPermissions() {
  const skills = [
    { skill: 'code-review', tools: ['Read ✓', 'Write ✗'], c: '#6366f1' },
    { skill: 'translate', tools: ['LLM only ✓'], c: '#10b981' },
    { skill: 'test-gen', tools: ['Read ✓', 'Write ✓'], c: '#f59e0b' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {skills.map((s, i) => (
        <motion.g key={s.skill}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={30 + i * 140} y={80} width={125} height={55} rx={5}
            fill={`${s.c}10`} stroke={s.c} strokeWidth={1} />
          <text x={92 + i * 140} y={97} textAnchor="middle"
            fontSize={9} fontWeight={700} fill={s.c}>{s.skill}</text>
          {s.tools.map((t, j) => (
            <text key={t} x={92 + i * 140} y={113 + j * 13}
              textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">{t}</text>
          ))}
        </motion.g>
      ))}
      <text x={W / 2} y={155} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#f59e0b">
        최소 권한 원칙(Least Privilege)
      </text>
    </motion.g>
  );
}
