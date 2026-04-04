import { motion } from 'framer-motion';
import { C } from './CListVizData';

export function Step2() {
  const txs = ['TX₀', 'TX₁', 'TX₂', 'TX₃'];
  return (<g>
    {txs.map((tx, i) => {
      const isDel = i === 1;
      return (
        <motion.g key={tx} initial={{ opacity: 1 }}
          animate={{ opacity: isDel ? 0.3 : 1 }}
          transition={{ delay: isDel ? 0.5 : 0 }}>
          <rect x={20 + i * 100} y={30} width={70} height={30} rx={6}
            fill={isDel ? `${C.del}10` : 'var(--card)'}
            stroke={isDel ? C.del : C.list}
            strokeWidth={isDel ? 1.2 : 0.5}
            strokeDasharray={isDel ? '4 2' : undefined} />
          <text x={55 + i * 100} y={49} textAnchor="middle"
            fontSize={10} fill={isDel ? C.del : C.list}>{tx}</text>
        </motion.g>
      );
    })}
    <motion.line x1={90} y1={45} x2={220} y2={45}
      stroke={C.add} strokeWidth={0.8} strokeDasharray="3 2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} />
    <motion.text x={155} y={38} textAnchor="middle" fontSize={10} fill={C.add}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      skip
    </motion.text>
    <motion.text x={210} y={82} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      Remove() O(1) — prev.next = next, next.prev = prev
    </motion.text>
  </g>);
}
