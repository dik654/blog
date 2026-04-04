import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function FallbackStep(): ReactNode {
  const models = [
    { label: 'GPT-4o', color: '#6366f1', cost: '$0.005', latency: '1.2s' },
    { label: 'Claude 3.5', color: '#10b981', cost: '$0.003', latency: '0.9s' },
    { label: 'Llama 3 (local)', color: '#f59e0b', cost: '$0', latency: '2.1s' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {models.map((m, i) => (
        <motion.g key={m.label} initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
          <rect x={80} y={25 + i * 52} width={170} height={40} rx={6}
            fill={`${m.color}18`} stroke={m.color} strokeWidth={1.5} />
          <text x={100} y={42 + i * 52} fontSize={9}
            fontWeight={600} fill={m.color}>
            {i + 1}차: {m.label}
          </text>
          <text x={100} y={56 + i * 52} fontSize={8}
            fill="var(--muted-foreground)">
            {m.cost}/req  {m.latency} P95
          </text>
          {i < 2 && (
            <motion.g initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.15 }}>
              <text x={270} y={52 + i * 52} fontSize={8}
                fontWeight={600} fill="#ef4444">timeout →</text>
            </motion.g>
          )}
        </motion.g>
      ))}
      <text x={350} y={95} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">가용성</text>
      <text x={350} y={110} textAnchor="middle" fontSize={12}
        fontWeight={700} fill="#10b981">99.9%</text>
    </motion.g>
  );
}

export function HumanLoopStep(): ReactNode {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={30} y={60} width={100} height={46} rx={6}
        fill="#6366f118" stroke="#6366f1" strokeWidth={1.5} />
      <text x={80} y={78} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#6366f1">LLM 응답</text>
      <text x={80} y={94} textAnchor="middle"
        fontSize={8} fill="var(--muted-foreground)">confidence: 0.87</text>
      <rect x={168} y={60} width={100} height={46} rx={6}
        fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={218} y={78} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#f59e0b">임계값 체크</text>
      <text x={218} y={94} textAnchor="middle"
        fontSize={8} fontFamily="monospace" fill="#f59e0b">threshold: 0.85</text>
      <line x1={130} y1={83} x2={168} y2={83}
        stroke="var(--muted-foreground)" strokeWidth={1} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <line x1={268} y1={72} x2={308} y2={52}
          stroke="#10b981" strokeWidth={1} />
        <rect x={308} y={36} width={110} height={36} rx={5}
          fill="#10b98118" stroke="#10b981" strokeWidth={1} />
        <text x={363} y={52} textAnchor="middle"
          fontSize={9} fontWeight={600} fill="#10b981">자동 배포</text>
        <text x={363} y={65} textAnchor="middle"
          fontSize={8} fill="var(--muted-foreground)">0.87 &gt; 0.85 PASS</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}>
        <line x1={268} y1={94} x2={308} y2={115}
          stroke="#f59e0b" strokeWidth={1} />
        <rect x={308} y={100} width={110} height={36} rx={5}
          fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
        <text x={363} y={116} textAnchor="middle"
          fontSize={9} fontWeight={600} fill="#f59e0b">사람 검토 큐</text>
        <text x={363} y={129} textAnchor="middle"
          fontSize={8} fill="var(--muted-foreground)">conf &lt; 0.85 시</text>
      </motion.g>
    </motion.g>
  );
}
