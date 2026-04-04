import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './PoseidonVizData';

export function SpongeInitStep() {
  const slots = [
    { idx: 0, label: '0', sub: 'capacity', c: '#94a3b8', fill: '#94a3b808' },
    { idx: 1, label: 'left', sub: 'rate₀', c: CV, fill: `${CV}12` },
    { idx: 2, label: 'right', sub: 'rate₁', c: CE, fill: `${CE}12` },
  ];
  return (
    <g>
      <text x={220} y={18} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        state: [Fr; 3]
      </text>
      {slots.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={60 + i * 130} y={30} width={110} height={50} rx={5}
            fill={s.fill} stroke={s.c} strokeWidth={1} />
          <text x={115 + i * 130} y={50} textAnchor="middle"
            fontSize={10} fontWeight={600} fill={s.c}>{s.label}</text>
          <text x={115 + i * 130} y={66} textAnchor="middle"
            fontSize={7} fill="var(--muted-foreground)">state[{s.idx}] = {s.sub}</text>
        </motion.g>
      ))}
      <motion.text x={220} y={108} textAnchor="middle" fontSize={8} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        capacity: 외부 노출 안 됨 / rate: 입출력 영역
      </motion.text>
    </g>
  );
}

export function ARKStep() {
  return (
    <g>
      <text x={220} y={15} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        AddRoundConstants: state[i] += rc[offset + i]
      </text>
      {[0, 1, 2].map((i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={40 + i * 140} y={30} width={110} height={35} rx={4}
            fill={`${CV}10`} stroke={CV} strokeWidth={1} />
          <text x={95 + i * 140} y={52} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={CV}>state[{i}]</text>
        </motion.g>
      ))}
      {[0, 1, 2].map((i) => (
        <motion.g key={`rc-${i}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.1 }}>
          <text x={95 + i * 140} y={78} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>+ rc[{i}]</text>
          <rect x={40 + i * 140} y={88} width={110} height={35} rx={4}
            fill={`${CE}10`} stroke={CE} strokeWidth={1} />
          <text x={95 + i * 140} y={110} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={CE}>state[{i}]'</text>
        </motion.g>
      ))}
    </g>
  );
}
