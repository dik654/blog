import { motion } from 'framer-motion';
import { C } from './BTreeVizData';

export function Step0() {
  const types = [
    { label: 'Internal', color: C.internal, desc: '분기 노드' },
    { label: 'Leaf', color: C.leaf, desc: '데이터 노드' },
    { label: 'Overflow', color: C.overflow, desc: '대형 값' },
  ];
  return (
    <g>
      <rect x={20} y={20} width={100} height={36} rx={5}
        fill={`${C.dim}10`} stroke={C.dim} strokeWidth={1} />
      <text x={70} y={35} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="var(--foreground)">OS Page</text>
      <text x={70} y={48} textAnchor="middle" fontSize={9}
        fill={C.dim}>4096 bytes</text>
      {types.map((t, i) => (
        <motion.g key={t.label} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.15 }}>
          <rect x={160} y={20 + i * 50} width={110} height={36}
            rx={5} fill={`${t.color}14`} stroke={t.color}
            strokeWidth={1} />
          <text x={215} y={36 + i * 50} textAnchor="middle"
            fontSize={10} fontWeight={600} fill={t.color}>
            {t.label}
          </text>
          <text x={215} y={50 + i * 50} textAnchor="middle"
            fontSize={9} fill={C.dim}>{t.desc}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function Step1() {
  const keys = ['0x1A', '0x3F', '0x7B'];
  const ptrs = ['pg2', 'pg5', 'pg8', 'pg11'];
  return (
    <g>
      <text x={20} y={28} fontSize={10} fontWeight={600}
        fill={C.internal}>Internal Node (page)</text>
      <rect x={20} y={38} width={340} height={50} rx={5}
        fill={`${C.internal}10`} stroke={C.internal}
        strokeWidth={1} />
      {keys.map((k, i) => (
        <motion.g key={k} initial={{ opacity: 0 }}
          animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
          <rect x={30 + i * 110} y={46} width={40} height={22}
            rx={3} fill={`${C.internal}20`} stroke={C.internal}
            strokeWidth={0.6} />
          <text x={50 + i * 110} y={61} textAnchor="middle"
            fontSize={9} fontFamily="monospace" fill={C.internal}>
            {k}
          </text>
          <rect x={74 + i * 110} y={46} width={32} height={22}
            rx={3} fill={`${C.dim}10`} stroke={C.dim}
            strokeWidth={0.5} />
          <text x={90 + i * 110} y={61} textAnchor="middle"
            fontSize={8} fill={C.dim}>{ptrs[i + 1]}</text>
        </motion.g>
      ))}
      <text x={20} y={115} fontSize={10} fill={C.dim}>
        key로 이진 탐색 → child_pgno로 다음 페이지 이동
      </text>
    </g>
  );
}
