import { motion } from 'framer-motion';
import { C } from './CheckTxFlowVizData';

export function Step2() {
  return (<g>
    <rect x={30} y={18} width={100} height={35} rx={6}
      fill="var(--card)" stroke={C.abci} strokeWidth={0.8} />
    <text x={80} y={34} textAnchor="middle" fontSize={10}
      fontWeight={600} fill={C.abci}>ABCI 응답</text>
    <text x={80} y={46} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">reqResCb()</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <line x1={135} y1={28} x2={195} y2={25} stroke={C.abci} strokeWidth={0.8} />
      <rect x={200} y={12} width={120} height={28} rx={6}
        fill={`${C.abci}10`} stroke={C.abci} strokeWidth={0.8} />
      <text x={260} y={30} textAnchor="middle" fontSize={10} fill={C.abci}>
        code=0 → addTx()
      </text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <line x1={135} y1={42} x2={195} y2={55} stroke={C.err} strokeWidth={0.8} />
      <rect x={200} y={44} width={140} height={28} rx={6}
        fill={`${C.err}08`} stroke={C.err} strokeWidth={0.8} />
      <text x={270} y={62} textAnchor="middle" fontSize={10} fill={C.err}>
        code!=0 → cache.Remove
      </text>
    </motion.g>
    <motion.text x={260} y={92} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      addTx(): CList.PushBack(memTx) + txByKey[key] = elem
    </motion.text>
  </g>);
}
