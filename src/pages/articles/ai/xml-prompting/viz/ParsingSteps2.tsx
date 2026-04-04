import { motion } from 'framer-motion';

const MF = 'ui-monospace,monospace';
const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export function StepListParse() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={30} y={20} width={170} height={130} rx={6}
        fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
      <text x={115} y={38} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">LLM 응답</text>
      {['항목 A', '항목 B', '항목 C'].map((item, i) => (
        <motion.g key={item} initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} transition={{ delay: i * 0.12 }}>
          <text x={45} y={60 + i * 28} fontSize={9}
            fontFamily={MF} fill={CV}>{`<item>`}</text>
          <text x={95} y={60 + i * 28} fontSize={9}
            fontFamily={MF} fill="var(--foreground)">{item}</text>
          <text x={140} y={60 + i * 28} fontSize={9}
            fontFamily={MF} fill={CV}>{`</item>`}</text>
        </motion.g>
      ))}
      <line x1={210} y1={85} x2={260} y2={85}
        stroke="var(--border)" strokeWidth={1.5} />
      <polygon points="258,81 266,85 258,89" fill="var(--muted-foreground)" />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}>
        <rect x={270} y={40} width={160} height={90} rx={6}
          fill={`${CE}10`} stroke={CE} strokeWidth={1} />
        <text x={350} y={58} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={CE}>Array[3]</text>
        {['[0] "항목 A"', '[1] "항목 B"', '[2] "항목 C"'].map((a, i) => (
          <text key={a} x={285} y={78 + i * 16} fontSize={9}
            fontFamily={MF} fill="var(--foreground)">{a}</text>
        ))}
      </motion.g>
    </motion.g>
  );
}

export function StepErrorRetry() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={30} y={20} width={120} height={50} rx={6}
        fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
      <text x={90} y={40} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#ef4444">시도 1</text>
      <text x={90} y={56} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">태그 누락</text>
      <motion.line x1={155} y1={45} x2={185} y2={45}
        stroke={CA} strokeWidth={1} strokeDasharray="3 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <rect x={190} y={20} width={130} height={50} rx={6}
          fill={`${CA}10`} stroke={CA} strokeWidth={1} />
        <text x={255} y={40} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={CA}>재시도</text>
        <text x={255} y={55} textAnchor="middle" fontSize={9}
          fontFamily={MF} fill="var(--muted-foreground)">"태그로 감싸라"</text>
      </motion.g>
      <motion.line x1={325} y1={45} x2={350} y2={45}
        stroke={CE} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.5 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <rect x={355} y={20} width={80} height={50} rx={6}
          fill={`${CE}10`} stroke={CE} strokeWidth={1.5} />
        <text x={395} y={40} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={CE}>성공</text>
        <text x={395} y={55} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">파싱 완료</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}>
        <rect x={80} y={95} width={300} height={70} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
        <text x={230} y={115} textAnchor="middle" fontSize={9}
          fontWeight={600} fill="var(--foreground)">재시도 전략</text>
        <text x={100} y={135} fontSize={9}
          fill="var(--muted-foreground)">
          태그 누락 → "반드시 태그로 감싸라" 강조
        </text>
        <text x={100} y={150} fontSize={9}
          fill="var(--muted-foreground)">
          max_retries=3 — 보통 2회 이내 해결
        </text>
      </motion.g>
    </motion.g>
  );
}
