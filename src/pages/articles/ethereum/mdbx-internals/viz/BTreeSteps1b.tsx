import { motion } from 'framer-motion';
import { C } from './BTreeVizData';

export function Step2() {
  const entries = [
    { k: '0x1A', v: 'acc_data' },
    { k: '0x1F', v: 'nonce=5' },
    { k: '0x22', v: 'bal=1.2' },
  ];
  return (
    <g>
      <text x={20} y={28} fontSize={10} fontWeight={600}
        fill={C.leaf}>Leaf Node (page)</text>
      <rect x={20} y={38} width={340} height={60} rx={5}
        fill={`${C.leaf}10`} stroke={C.leaf} strokeWidth={1} />
      {entries.map((e, i) => (
        <motion.g key={e.k} initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={30 + i * 110} y={48} width={44} height={20}
            rx={3} fill={`${C.leaf}20`} stroke={C.leaf}
            strokeWidth={0.6} />
          <text x={52 + i * 110} y={62} textAnchor="middle"
            fontSize={9} fontFamily="monospace" fill={C.leaf}>
            {e.k}
          </text>
          <rect x={78 + i * 110} y={48} width={52} height={20}
            rx={3} fill={`${C.leaf}08`} stroke={C.leaf}
            strokeWidth={0.4} />
          <text x={104 + i * 110} y={62} textAnchor="middle"
            fontSize={8} fill="var(--foreground)">{e.v}</text>
        </motion.g>
      ))}
      <text x={20} y={125} fontSize={10} fill={C.dim}>
        key-value가 인라인으로 페이지 안에 저장됨
      </text>
    </g>
  );
}
