import { motion } from 'framer-motion';

const MF = 'ui-monospace,monospace';
const CE = '#10b981';

export function StepNaming() {
  const bad = ['<a>', '<d1>', '<x>'];
  const good = ['<user_query>', '<system_rules>', '<expected_output>'];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={120} y={22} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#ef4444">Bad</text>
      {bad.map((t, i) => (
        <motion.g key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={40 + i * 70} y={30} width={55} height={28} rx={4}
            fill="#ef444408" stroke="#ef4444" strokeWidth={1} strokeDasharray="3 3" />
          <text x={67 + i * 70} y={48} textAnchor="middle"
            fontSize={9} fontFamily={MF} fill="#ef4444">{t}</text>
        </motion.g>
      ))}
      <text x={340} y={22} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={CE}>Good</text>
      {good.map((t, i) => (
        <motion.g key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}>
          <rect x={260} y={30 + i * 36} width={160} height={28} rx={4}
            fill={`${CE}10`} stroke={CE} strokeWidth={1} />
          <text x={340} y={48 + i * 36} textAnchor="middle"
            fontSize={9} fontFamily={MF} fill={CE}>{t}</text>
        </motion.g>
      ))}
      <text x={230} y={55} textAnchor="middle" fontSize={16}
        fill="var(--muted-foreground)">→</text>
      <text x={230} y={130} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">태그 이름 = 의미적 단서</text>
    </motion.g>
  );
}

export function StepClosingTag() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={30} y={30} width={180} height={70} rx={6}
        fill="#ef444408" stroke="#ef4444" strokeWidth={1} />
      <text x={120} y={22} textAnchor="middle" fontSize={9}
        fontWeight={600} fill="#ef4444">닫는 태그 없음</text>
      <text x={40} y={52} fontSize={9} fontFamily={MF}
        fill="#ef4444">{'<instructions>'}</text>
      <text x={50} y={68} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">  요약해줘...</text>
      <text x={50} y={84} fontSize={9} fontFamily={MF}
        fill="var(--muted-foreground)">  ← 경계 어디?</text>
      <rect x={250} y={30} width={180} height={70} rx={6}
        fill={`${CE}08`} stroke={CE} strokeWidth={1.5} />
      <text x={340} y={22} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={CE}>닫는 태그 있음</text>
      <text x={260} y={52} fontSize={9} fontFamily={MF}
        fill={CE}>{'<instructions>'}</text>
      <text x={270} y={68} fontSize={9} fontFamily={MF}
        fill="var(--foreground)">  요약해줘...</text>
      <text x={260} y={84} fontSize={9} fontFamily={MF}
        fill={CE}>{'</instructions>'}</text>
      <motion.text x={230} y={135} textAnchor="middle" fontSize={9}
        fill="var(--foreground)" fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        여는 태그 + 닫는 태그 = 경계 인식의 핵심
      </motion.text>
    </motion.g>
  );
}
