import { motion } from 'framer-motion';

export function ParamExtraction() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* User input */}
      <rect x={40} y={70} width={170} height={36} rx={6}
        fill="#f59e0b10" stroke="#f59e0b" strokeWidth={1} />
      <text x={50} y={85} fontSize={8} fontWeight={600} fill="#f59e0b">
        User:
      </text>
      <text x={50} y={98} fontSize={8} fill="var(--muted-foreground)">
        "Python 코드 리뷰해줘"
      </text>
      {/* Arrow */}
      <line x1={210} y1={88} x2={240} y2={88}
        stroke="var(--muted-foreground)" strokeWidth={1} />
      <polygon points="238,85 244,88 238,91" fill="var(--muted-foreground)" />
      {/* Extracted JSON */}
      <rect x={244} y={65} width={180} height={52} rx={6}
        fill="#6366f108" stroke="#6366f1" strokeWidth={1} />
      <rect x={244} y={65} width={4} height={52} rx={2} fill="#6366f1" />
      <text x={258} y={80} fontSize={8} fontFamily="monospace"
        fontWeight={600} fill="#6366f1">tool_use:</text>
      <text x={258} y={92} fontSize={8} fontFamily="monospace"
        fill="var(--muted-foreground)">{"  skill: \"code-review\","}</text>
      <text x={258} y={104} fontSize={8} fontFamily="monospace"
        fill="var(--muted-foreground)">{"  language: \"Python\""}</text>
    </motion.g>
  );
}

export function PromptAssembly() {
  const sources = [
    { label: '시스템 프롬프트', c: '#6366f1', y: 75 },
    { label: '스킬 프롬프트', c: '#10b981', y: 103 },
    { label: '사용자 컨텍스트', c: '#f59e0b', y: 131 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {sources.map((r, i) => (
        <motion.g key={r.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={60} y={r.y} width={150} height={24} rx={4}
            fill={`${r.c}12`} stroke={r.c} strokeWidth={1} />
          <text x={135} y={r.y + 16} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={r.c}>{r.label}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <text x={230} y={115} fontSize={14}
          fill="var(--muted-foreground)">→</text>
        <rect x={260} y={90} width={140} height={34} rx={5}
          fill="#10b98115" stroke="#10b981" strokeWidth={1.5} />
        <text x={330} y={111} textAnchor="middle" fontSize={9}
          fontWeight={700} fill="#10b981">조립된 프롬프트</text>
      </motion.g>
    </motion.g>
  );
}
