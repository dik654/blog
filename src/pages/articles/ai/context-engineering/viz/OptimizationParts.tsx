import { motion } from 'framer-motion';

const W = 460;
const CTX_X = 30, CTX_W = 400;

export function PriorityPyramid() {
  const rows = [
    { label: '높음: 시스템 규칙', y: 80, w: 140, c: '#6366f1' },
    { label: '중간: RAG + 최근 대화', y: 115, w: 220, c: '#10b981' },
    { label: '낮음: 오래된 히스토리', y: 150, w: 300, c: '#f59e0b' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {rows.map((p, i) => (
        <motion.g key={p.label}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={W / 2 - p.w / 2} y={p.y} width={p.w} height={28} rx={5}
            fill={`${p.c}15`} stroke={p.c} strokeWidth={1} />
          <text x={W / 2} y={p.y + 18} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={p.c}>{p.label}</text>
        </motion.g>
      ))}
    </motion.g>
  );
}

export function CompressionThreshold() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={CTX_X} y={80} width={CTX_W} height={22} rx={4}
        fill="var(--muted)" opacity={0.1} stroke="var(--border)" strokeWidth={1} />
      <line x1={CTX_X + CTX_W * 0.75} y1={78} x2={CTX_X + CTX_W * 0.75} y2={104}
        stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" />
      <text x={CTX_X + CTX_W * 0.75} y={115} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#f59e0b">75% 경고</text>
      <line x1={CTX_X + CTX_W * 0.92} y1={78} x2={CTX_X + CTX_W * 0.92} y2={104}
        stroke="#ef4444" strokeWidth={1.5} strokeDasharray="3 3" />
      <text x={CTX_X + CTX_W * 0.92} y={115} textAnchor="middle"
        fontSize={9} fontWeight={600} fill="#ef4444">92% 압축</text>
      <motion.rect x={CTX_X} y={80} height={22} rx={4}
        fill="#6366f125"
        initial={{ width: 0 }} animate={{ width: CTX_W * 0.85 }}
        transition={{ duration: 1 }} />
      <text x={CTX_X + CTX_W * 0.85 / 2} y={95} textAnchor="middle"
        fontSize={9} fill="#6366f1" fontWeight={600}>사용 중 85%</text>
      <motion.text x={W / 2} y={145} textAnchor="middle"
        fontSize={9} fill="#10b981" fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}>
        → 오래된 턴 요약 + 중복 제거 → 60%로 압축
      </motion.text>
    </motion.g>
  );
}

export function AttentionCurve() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={W / 2} y={90} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">
        앞쪽 토큰이 더 안정적으로 참조됨 ("Lost in the Middle")
      </text>
      <motion.path
        d={`M${CTX_X} 130 Q${CTX_X + 80} 105 ${CTX_X + CTX_W / 2} 125 Q${CTX_X + CTX_W - 80} 145 ${CTX_X + CTX_W} 110`}
        fill="none" stroke="#6366f1" strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }} />
      <text x={CTX_X + 20} y={125} fontSize={9} fill="#6366f1">높음</text>
      <text x={CTX_X + CTX_W / 2} y={140} fontSize={9}
        fill="var(--muted-foreground)" textAnchor="middle">낮음</text>
      <text x={CTX_X + CTX_W - 20} y={125} fontSize={9}
        fill="#6366f1" textAnchor="end">높음</text>
    </motion.g>
  );
}
