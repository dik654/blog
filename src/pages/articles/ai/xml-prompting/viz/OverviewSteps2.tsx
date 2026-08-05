import { motion } from 'framer-motion';
import { FORMATS } from './OverviewData';

export function StepComparison() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={230} y={22} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">소비자에 맞는 형식 선택</text>
      {FORMATS.map((f, i) => {
        const bx = 50, by = 42 + i * 50, bw = 350;
        return (
          <motion.g key={f.label} initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <rect x={bx} y={by} width={bw} height={20} rx={4}
              fill={`${f.color}20`} stroke={f.color} strokeWidth={1} />
            <text x={bx + 10} y={by + 14} fontSize={9}
              fontWeight={700} fill={f.color}>{f.label}</text>
            <text x={bx + bw - 10} y={by + 14} textAnchor="end"
              fontSize={9} fill="var(--muted-foreground)">{f.fit}</text>
          </motion.g>
        );
      })}
      <text x={230} y={205} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">우열 점수 대신 실제 실패 fixture로 비교</text>
    </motion.g>
  );
}

export function StepLLMRecognition({ cx }: { cx: number }) {
  const owners = [
    { name: '작성자', x: 80, color: '#6366f1', note: '역할 표시' },
    { name: '모델', x: 230, color: '#10b981', note: '출력 생성' },
    { name: '검증기', x: 380, color: '#f59e0b', note: '문법·필드 판정' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {owners.map((m, i) => (
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
        fill="#6366f1">구조 단서 → 생성 → 외부 검증</text>
      <text x={cx} y={140} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">태그만으로 권한·정답·스키마 준수는 보장되지 않음</text>
    </motion.g>
  );
}
