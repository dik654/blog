import { motion } from 'framer-motion';
import { FORMATS } from './OverviewData';

const MF = 'ui-monospace,monospace';

export function StepComparison() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={230} y={22} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">포맷별 구조화 능력</text>
      {FORMATS.map((f, i) => {
        const bx = 50, by = 42 + i * 40, bw = f.quality * 300;
        return (
          <motion.g key={f.label} initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <text x={bx - 5} y={by + 14} textAnchor="end"
              fontSize={9} fontWeight={600} fill={f.color}>{f.label}</text>
            <rect x={bx} y={by} width={bw} height={20} rx={4}
              fill={`${f.color}20`} stroke={f.color} strokeWidth={1} />
            {f.label === 'JSON' && (
              <text x={bx + bw + 6} y={by + 14} fontSize={9}
                fill="var(--muted-foreground)">이스케이프 문제</text>
            )}
            {f.label === 'Markdown' && (
              <text x={bx + bw + 6} y={by + 14} fontSize={9}
                fill="var(--muted-foreground)">중첩 불가</text>
            )}
            {f.label === 'XML' && (
              <text x={bx + bw + 6} y={by + 14} fontSize={9}
                fill="#6366f1" fontWeight={600}>중첩 + 가독성</text>
            )}
          </motion.g>
        );
      })}
    </motion.g>
  );
}

export function StepLLMRecognition({ cx }: { cx: number }) {
  const models = [
    { name: 'Claude', x: 80, color: '#6366f1', note: '공식 권장' },
    { name: 'GPT', x: 230, color: '#10b981', note: '잘 인식' },
    { name: 'Gemini', x: 360, color: '#f59e0b', note: '잘 인식' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {models.map((m, i) => (
        <motion.g key={m.name} initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
          <rect x={m.x - 50} y={40} width={100} height={44} rx={8}
            fill={`${m.color}12`} stroke={m.color} strokeWidth={1.5} />
          <text x={m.x} y={60} textAnchor="middle" fontSize={10}
            fontWeight={700} fill={m.color}>{m.name}</text>
          <text x={m.x} y={75} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">{m.note}</text>
        </motion.g>
      ))}
      <text x={cx} y={120} textAnchor="middle" fontSize={9}
        fontFamily={MF} fill="#6366f1">{'<tag>'}...{'</tag>'}</text>
      <text x={cx} y={140} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">→ 구조적 단서(structural cue)로 작동</text>
    </motion.g>
  );
}
