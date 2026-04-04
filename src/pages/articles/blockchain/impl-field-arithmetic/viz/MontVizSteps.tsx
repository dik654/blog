import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './MontVizData';

export function WhyMontStep() {
  return (
    <g>
      <VizBox x={15} y={20} w={130} h={40} label="일반 곱셈" sub="(a*b) mod p → 나눗셈!" c={CV} />
      <motion.text x={160} y={44} fontSize={12} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>vs</motion.text>
      <VizBox x={185} y={20} w={180} h={40} label="Montgomery 곱셈" sub="시프트 + 덧셈만 (R = 2^256)" c={CE} delay={0.3} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={15} y={80} width={350} height={32} rx={4}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.8} />
        <text x={190} y={100} textAnchor="middle" fontSize={8}
          fill={CA} fontWeight={600}>a_mont = a * R mod p → R로 나누기 = 비트 시프트</text>
      </motion.g>
    </g>
  );
}

export function ConvertStep() {
  return (
    <g>
      <VizBox x={15} y={25} w={95} h={36} label="a (raw)" sub="일반 숫자" c={CV} />
      <motion.path d="M 110 43 L 145 43" stroke={CA} strokeWidth={1}
        markerEnd="url(#mArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
      <VizBox x={150} y={15} w={130} h={22} label="mont_mul(a, R^2)" sub="" c={CA} delay={0.3} />
      <motion.text x={215} y={50} fontSize={7} fill="var(--muted-foreground)"
        textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}>= a * R^2 * R^{'{-1}'} = a * R</motion.text>
      <motion.path d="M 280 35 L 310 35" stroke={CA} strokeWidth={1}
        markerEnd="url(#mArr)" initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />
      <VizBox x={315} y={17} w={100} h={36} label="a_mont" sub="a * R mod p" c={CE} delay={0.5} />
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <VizBox x={315} y={75} w={100} h={36} label="a (raw)" sub="복원된 원래 값" c={CV} />
        <motion.path d="M 365 53 L 365 75" stroke={CE} strokeWidth={1}
          markerEnd="url(#mArr)" initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />
        <text x={280} y={90} fontSize={7} fill="var(--muted-foreground)" textAnchor="end">
          REDC(a_mont)
        </text>
      </motion.g>
      <defs>
        <marker id="mArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}

export function SchoolbookStep() {
  const rows = ['self[0]', 'self[1]', 'self[2]', 'self[3]'];
  return (
    <g>
      <text x={50} y={15} fontSize={8} fill={CV} fontWeight={600}>x</text>
      <text x={130} y={15} fontSize={8} fill={CE} fontWeight={600}>rhs</text>
      {rows.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}>
          <rect x={20} y={22 + i * 24} width={70} height={18} rx={3}
            fill={`${CV}10`} stroke={CV} strokeWidth={0.7} />
          <text x={55} y={34 + i * 24} textAnchor="middle"
            fontSize={7.5} fill={CV}>{r}</text>
          <text x={100} y={34 + i * 24} fontSize={9} fill={CA}>x</text>
          <rect x={110} y={22 + i * 24} width={70} height={18} rx={3}
            fill={`${CE}10`} stroke={CE} strokeWidth={0.7} />
          <text x={145} y={34 + i * 24} textAnchor="middle"
            fontSize={7.5} fill={CE}>rhs[0..3]</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <motion.path d="M 200 60 L 240 60" stroke={CA} strokeWidth={1}
          markerEnd="url(#mArr)" initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />
        <rect x={250} y={35} width={160} height={50} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={1} />
        <text x={330} y={55} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={CA}>[u64; 8]</text>
        <text x={330} y={72} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">512비트 중간 결과 (16회 mac)</text>
      </motion.g>
    </g>
  );
}
