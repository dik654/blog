import { motion } from 'framer-motion';
import { C } from './DupSortVizData';

export function Step0() {
  const rows = [
    { k: 'addr_A', v: 'balance=1.0' },
    { k: 'addr_B', v: 'balance=2.5' },
    { k: 'addr_C', v: 'balance=0.3' },
  ];
  return (
    <g>
      <text x={20} y={24} fontSize={10} fontWeight={600}
        fill={C.key}>기본 B+tree: 1 key → 1 value</text>
      {rows.map((r, i) => (
        <motion.g key={r.k} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={30} y={40 + i * 36} width={90} height={26}
            rx={4} fill={`${C.key}14`} stroke={C.key}
            strokeWidth={0.8} />
          <text x={75} y={57 + i * 36} textAnchor="middle"
            fontSize={9} fontFamily="monospace" fill={C.key}>
            {r.k}
          </text>
          <line x1={120} y1={53 + i * 36} x2={150}
            y2={53 + i * 36} stroke={C.dim} strokeWidth={0.8} />
          <rect x={155} y={40 + i * 36} width={100} height={26}
            rx={4} fill={`${C.val}10`} stroke={C.val}
            strokeWidth={0.6} />
          <text x={205} y={57 + i * 36} textAnchor="middle"
            fontSize={9} fill={C.val}>{r.v}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function Step1() {
  const vals = ['slot_0', 'slot_1', 'slot_2', 'slot_3'];
  return (
    <g>
      <text x={20} y={24} fontSize={10} fontWeight={600}
        fill={C.sub}>DupSort: 1 key → N values</text>
      <rect x={30} y={40} width={80} height={110} rx={5}
        fill={`${C.key}10`} stroke={C.key} strokeWidth={1} />
      <text x={70} y={60} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={C.key}>addr_A</text>
      <line x1={110} y1={90} x2={145} y2={90}
        stroke={C.sub} strokeWidth={1} />
      <polygon points="143,86 150,90 143,94" fill={C.sub} />
      <rect x={155} y={40} width={120} height={110} rx={5}
        fill={`${C.sub}08`} stroke={C.sub} strokeWidth={1} />
      <text x={215} y={56} textAnchor="middle" fontSize={9}
        fontWeight={600} fill={C.sub}>sorted values</text>
      {vals.map((v, i) => (
        <motion.g key={v} initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}>
          <rect x={165} y={64 + i * 20} width={100} height={16}
            rx={3} fill={`${C.val}10`} stroke={C.val}
            strokeWidth={0.4} />
          <text x={215} y={76 + i * 20} textAnchor="middle"
            fontSize={9} fontFamily="monospace" fill={C.val}>
            {v}
          </text>
        </motion.g>
      ))}
    </g>
  );
}
