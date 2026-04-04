import { motion } from 'framer-motion';

const CX = 230;

export function DebateView() {
  const agents = [
    { label: 'Agent A', x: 120, color: '#6366f1' },
    { label: 'Agent B', x: 230, color: '#10b981' },
    { label: 'Agent C', x: 340, color: '#f59e0b' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={CX} y={20} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="var(--foreground)">Debate Pattern</text>
      {agents.map((a) => (
        <g key={a.label}>
          <rect x={a.x - 45} y={40} width={90} height={36} rx={6}
            fill={`${a.color}15`} stroke={a.color} strokeWidth={1.5} />
          <text x={a.x} y={63} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={a.color}>{a.label}</text>
        </g>
      ))}
      <path d="M 165 58 Q 175 90 220 58" fill="none"
        stroke="#6366f1" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
      <path d="M 275 58 Q 285 90 330 58" fill="none"
        stroke="#10b981" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
      <text x={CX} y={105} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">라운드 1, 2, 3... → 토론</text>
      <rect x={CX - 50} y={120} width={100} height={30} rx={6}
        fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
      <text x={CX} y={140} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="#10b981">합의(Consensus)</text>
    </motion.g>
  );
}

export function RoutingView() {
  const specialists = [
    { label: 'Code', color: '#6366f1', x: 100 },
    { label: 'Search', color: '#10b981', x: 230 },
    { label: 'Data', color: '#f59e0b', x: 360 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={CX - 50} y={20} width={100} height={34} rx={6}
        fill="#6366f118" stroke="#6366f1" strokeWidth={2} />
      <text x={CX} y={42} textAnchor="middle" fontSize={11}
        fontWeight={700} fill="#6366f1">Router</text>
      {specialists.map((s, i) => (
        <motion.g key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={s.x - 50} y={90} width={100} height={36} rx={6}
            fill={`${s.color}15`} stroke={s.color} strokeWidth={1.5} />
          <text x={s.x} y={113} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={s.color}>{s.label} Agent</text>
          <line x1={CX} y1={54} x2={s.x} y2={90}
            stroke={s.color} strokeWidth={1} opacity={0.4} />
        </motion.g>
      ))}
      <text x={100} y={82} textAnchor="middle" fontSize={9}
        fill="#6366f1">코드 질문</text>
      <text x={230} y={82} textAnchor="middle" fontSize={9}
        fill="#10b981">검색 요청</text>
      <text x={360} y={82} textAnchor="middle" fontSize={9}
        fill="#f59e0b">데이터 분석</text>
    </motion.g>
  );
}
