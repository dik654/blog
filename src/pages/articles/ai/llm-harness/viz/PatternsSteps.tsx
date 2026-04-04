import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RouteTarget { label: string; color: string }

export function RoutingStep({ targets }: { targets: RouteTarget[] }): ReactNode {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={30} y={75} width={80} height={32} rx={6}
        fill="#6366f118" stroke="#6366f1" strokeWidth={1.5} />
      <text x={70} y={95} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#6366f1">사용자 입력</text>
      <rect x={150} y={75} width={80} height={32} rx={6}
        fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1.5} />
      <text x={190} y={95} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#f59e0b">의도 분류</text>
      <line x1={110} y1={91} x2={150} y2={91}
        stroke="var(--muted-foreground)" strokeWidth={1} />
      {targets.map((t, i) => (
        <motion.g key={t.label}
          initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}>
          <line x1={230} y1={91} x2={290} y2={56 + i * 50}
            stroke={t.color} strokeWidth={1} opacity={0.5} />
          <rect x={290} y={40 + i * 50} width={70} height={32} rx={5}
            fill={`${t.color}18`} stroke={t.color} strokeWidth={1} />
          <text x={325} y={60 + i * 50} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={t.color}>{t.label}</text>
        </motion.g>
      ))}
    </motion.g>
  );
}

export function GuardrailStep(): ReactNode {
  const labels = ['입력 검증', 'LLM 실행', '출력 검증'];
  const colors = ['#f59e0b', '#6366f1', '#10b981'];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {labels.map((label, i) => (
        <motion.g key={label}
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={60 + i * 130} y={70} width={100} height={40} rx={6}
            fill={`${colors[i]}18`} stroke={colors[i]} strokeWidth={1.5} />
          <text x={110 + i * 130} y={94} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={colors[i]}>{label}</text>
          {i < 2 && (
            <line x1={160 + i * 130} y1={90} x2={190 + i * 130} y2={90}
              stroke="var(--muted-foreground)" strokeWidth={1}
              markerEnd="url(#ptArrow)" />
          )}
        </motion.g>
      ))}
    </motion.g>
  );
}
