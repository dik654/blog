import { motion } from 'framer-motion';

const MF = 'ui-monospace,monospace';
const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';

export function StepThinking() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={80} y={20} width={300} height={150} rx={8}
        fill={`${CV}08`} stroke={CV} strokeWidth={1.5} />
      <text x={90} y={40} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={CV}>{'<thinking>'}</text>
      {['1. 문제를 분석하면...', '2. 조건 A와 B를 비교하면...', '3. 따라서 결론은...'].map((t, i) => (
        <motion.text key={t} x={105} y={62 + i * 20}
          fontSize={9} fontFamily={MF} fill="var(--foreground)"
          initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.15 }}>{t}</motion.text>
      ))}
      <text x={90} y={130} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={CV}>{'</thinking>'}</text>
      <motion.text x={90} y={155} fontSize={9} fontWeight={600} fill={CE}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        {'<answer>최종 답변</answer>'}
      </motion.text>
    </motion.g>
  );
}

export function StepRulesConstraints() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={30} y={25} width={180} height={90} rx={6}
        fill={`${CE}08`} stroke={CE} strokeWidth={1.5} />
      <text x={40} y={44} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={CE}>{'<rules>'}</text>
      <text x={50} y={62} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">항상 한국어로 응답</text>
      <text x={50} y={78} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">근거를 먼저 제시</text>
      <text x={40} y={96} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={CE}>{'</rules>'}</text>
      <rect x={250} y={25} width={180} height={90} rx={6}
        fill={`${CA}08`} stroke={CA} strokeWidth={1.5} />
      <text x={260} y={44} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={CA}>{'<constraints>'}</text>
      <text x={270} y={62} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">개인정보 출력 금지</text>
      <text x={270} y={78} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">추측 시 명시적 고지</text>
      <text x={260} y={96} fontSize={9} fontFamily={MF}
        fontWeight={600} fill={CA}>{'</constraints>'}</text>
      <text x={120} y={140} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={CE}>MUST</text>
      <text x={340} y={140} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={CA}>NEVER</text>
    </motion.g>
  );
}
