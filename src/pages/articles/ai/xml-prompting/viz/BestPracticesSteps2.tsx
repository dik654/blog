import { motion } from 'framer-motion';

const MF = 'ui-monospace,monospace';
const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export function StepDepth() {
  const depths = [
    { depth: 1, label: '<task>', x: 40, w: 380, c: CV },
    { depth: 2, label: '<subtask>', x: 70, w: 320, c: CE },
    { depth: 3, label: '<detail>', x: 100, w: 260, c: CA },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {depths.map((d, i) => (
        <motion.g key={d.label} initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
          <rect x={d.x} y={25 + i * 44} width={d.w} height={36} rx={5}
            fill={`${d.c}10`} stroke={d.c} strokeWidth={1.5} />
          <text x={d.x + 10} y={47 + i * 44} fontSize={9}
            fontFamily={MF} fontWeight={600} fill={d.c}>{d.label}</text>
          <text x={d.x + d.w - 10} y={47 + i * 44}
            textAnchor="end" fontSize={9}
            fill="var(--muted-foreground)">깊이 {d.depth} OK</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={130} y={157} width={200} height={36} rx={5}
          fill="#ef444408" stroke="#ef4444" strokeWidth={1}
          strokeDasharray="4 3" />
        <text x={140} y={179} fontSize={9}
          fontFamily={MF} fill="#ef4444">{'<sub_detail>'}</text>
        <text x={350} y={179} fontSize={9}
          fill="#ef4444">깊이 4+ → 분리 권장</text>
      </motion.g>
    </motion.g>
  );
}

export function StepTemplate() {
  const parts = [
    { tag: 'role', desc: '역할 정의', c: CV, y: 48 },
    { tag: 'rules', desc: '행동 규칙', c: CE, y: 72 },
    { tag: 'output_format', desc: '출력 형식', c: CA, y: 96 },
    { tag: 'examples', desc: 'Few-shot', c: CE, y: 120 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={60} y={10} width={340} height={200} rx={8}
        fill={`${CV}06`} stroke={CV} strokeWidth={1.5} />
      <text x={70} y={30} fontSize={9} fontFamily={MF}
        fontWeight={700} fill={CV}>{'<system>'}</text>
      {parts.map((t, i) => (
        <motion.g key={t.tag} initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <rect x={85} y={t.y - 10} width={290} height={20} rx={3}
            fill={`${t.c}08`} />
          <text x={95} y={t.y + 4} fontSize={9} fontFamily={MF}
            fontWeight={600} fill={t.c}>{`<${t.tag}>`}</text>
          <text x={230} y={t.y + 4} fontSize={9}
            fill="var(--muted-foreground)">{t.desc}</text>
          <text x={355} y={t.y + 4} textAnchor="end" fontSize={9}
            fontFamily={MF} fill={t.c}>{`</${t.tag}>`}</text>
        </motion.g>
      ))}
      <text x={70} y={148} fontSize={9} fontFamily={MF}
        fontWeight={700} fill={CV}>{'</system>'}</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={85} y={158} width={290} height={20} rx={3}
          fill={`${CA}10`} />
        <text x={95} y={172} fontSize={9} fontFamily={MF}
          fontWeight={600} fill={CA}>{'<user_input>'}</text>
        <text x={230} y={172} fontSize={9}
          fill="var(--muted-foreground)">사용자 입력</text>
        <text x={355} y={172} textAnchor="end" fontSize={9}
          fontFamily={MF} fill={CA}>{'</user_input>'}</text>
      </motion.g>
      <motion.text x={230} y={200} textAnchor="middle" fontSize={9}
        fill={CV} fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        → 재사용 가능한 프롬프트 템플릿
      </motion.text>
    </motion.g>
  );
}
