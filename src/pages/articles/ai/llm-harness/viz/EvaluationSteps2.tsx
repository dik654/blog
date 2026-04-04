import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Metric { label: string; icon: string; color: string; value: string }

export function GoldenStep(): ReactNode {
  const items = ['골든 셋 (200개)', '엣지 케이스', '회귀 테스트'];
  const colors = ['#6366f1', '#f59e0b', '#10b981'];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {items.map((t, i) => (
        <motion.g key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={80} y={30 + i * 48} width={140} height={32} rx={5}
            fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1} />
          <text x={150} y={50 + i * 48} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={colors[i]}>{t}</text>
          <text x={265} y={50 + i * 48} fontSize={9}
            fill="var(--muted-foreground)">CI/CD</text>
        </motion.g>
      ))}
    </motion.g>
  );
}

export function MetricsStep({ metrics }: { metrics: Metric[] }): ReactNode {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {metrics.map((m, i) => (
        <motion.g key={m.label}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={30 + i * 105} y={35} width={88} height={80} rx={8}
            fill={`${m.color}12`} stroke={m.color} strokeWidth={1.5} />
          <text x={74 + i * 105} y={58} textAnchor="middle"
            fontSize={16} fill={m.color}>{m.icon}</text>
          <text x={74 + i * 105} y={76} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={m.color}>{m.label}</text>
          <text x={74 + i * 105} y={90} textAnchor="middle"
            fontSize={10} fontWeight={700} fill={m.color}>{m.value}</text>
          <text x={74 + i * 105} y={106} textAnchor="middle"
            fontSize={8} fill="var(--muted-foreground)">
            {['골든셋 기준', 'P95 측정', '1K 요청당', '100 샘플'][i]}
          </text>
        </motion.g>
      ))}
      <text x={220} y={142} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">
        4개 지표를 대시보드로 실시간 추적 — 임계값 이탈 시 알림
      </text>
    </motion.g>
  );
}
