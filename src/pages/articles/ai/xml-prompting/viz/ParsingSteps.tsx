import { motion } from 'framer-motion';

const MF = 'ui-monospace,monospace';
const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export function StepSingleExtract() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={30} y={20} width={180} height={90} rx={6}
        fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
      <text x={120} y={38} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="var(--foreground)">LLM 응답</text>
      <text x={40} y={58} fontSize={9} fontFamily={MF}
        fill="var(--muted-foreground)">분석 결과를 보면...</text>
      <text x={40} y={74} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={CV}>{'<answer>'}</text>
      <text x={50} y={88} fontSize={9} fontFamily={MF}
        fill={CV}>  핵심 내용은 X</text>
      <text x={40} y={100} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={CV}>{'</answer>'}</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        <line x1={220} y1={70} x2={270} y2={70}
          stroke={CV} strokeWidth={1.5} />
        <polygon points="268,66 276,70 268,74" fill={CV} />
        <text x={245} y={60} textAnchor="middle" fontSize={9}
          fill="var(--muted-foreground)">regex</text>
      </motion.g>
      <motion.rect x={280} y={45} width={150} height={50} rx={6}
        fill={`${CE}10`} stroke={CE} strokeWidth={1.5}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }} />
      <motion.text x={355} y={68} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={CE}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>"핵심 내용은 X"</motion.text>
      <motion.text x={355} y={84} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>→ 파이프라인 연결</motion.text>
    </motion.g>
  );
}

export function StepMultiField() {
  const fields = [
    { tag: 'summary', val: '요약 텍스트', c: CV },
    { tag: 'confidence', val: '0.85', c: CE },
    { tag: 'sources', val: '문서A, 논문B', c: CA },
  ];
  const parsed = [
    { key: 'summary', val: '"요약 텍스트"', c: CV, y: 30 },
    { key: 'confidence', val: '0.85', c: CE, y: 72 },
    { key: 'sources', val: '["문서A","논문B"]', c: CA, y: 114 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={20} y={15} width={190} height={130} rx={6}
        fill="var(--card)" stroke="var(--border)" strokeWidth={1} />
      {fields.map((f, i) => (
        <motion.g key={f.tag} initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
          <text x={30} y={40 + i * 38} fontSize={9}
            fontFamily={MF} fontWeight={600} fill={f.c}>{`<${f.tag}>`}</text>
          <text x={40} y={53 + i * 38} fontSize={9}
            fontFamily={MF} fill="var(--foreground)">{`  ${f.val}`}</text>
        </motion.g>
      ))}
      <line x1={220} y1={80} x2={260} y2={80}
        stroke="var(--border)" strokeWidth={1.5} />
      <polygon points="258,76 266,80 258,84" fill="var(--muted-foreground)" />
      {parsed.map((f, i) => (
        <motion.g key={f.key} initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12 }}>
          <rect x={270} y={f.y} width={170} height={32} rx={5}
            fill={`${f.c}10`} stroke={f.c} strokeWidth={1} />
          <text x={280} y={f.y + 14} fontSize={9} fontWeight={600} fill={f.c}>{f.key}</text>
          <text x={280} y={f.y + 26} fontSize={9} fontFamily={MF}
            fill="var(--foreground)">{f.val}</text>
        </motion.g>
      ))}
    </motion.g>
  );
}
