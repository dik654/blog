import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './RecheckVizData';

export function Step0() {
  const txs = ['TX₀', 'TX₁', 'TX₂', 'TX₃', 'TX₄'];
  return (<g>
    <text x={210} y={16} textAnchor="middle" fontSize={10} fill={C.block}>
      Block 커밋: TX₁, TX₃ 포함됨
    </text>
    {txs.map((tx, i) => {
      const included = i === 1 || i === 3;
      return (
        <motion.g key={tx} initial={{ opacity: 1 }}
          animate={{ opacity: included ? 0.25 : 1 }}
          transition={{ delay: included ? 0.5 : 0 }}>
          <rect x={15 + i * 80} y={28} width={60} height={26} rx={13}
            fill={included ? `${C.remove}10` : `${C.ok}10`}
            stroke={included ? C.remove : C.ok} strokeWidth={0.7}
            strokeDasharray={included ? '3 2' : undefined} />
          <text x={45 + i * 80} y={45} textAnchor="middle" fontSize={10}
            fill={included ? C.remove : C.ok}>{tx}</text>
        </motion.g>
      );
    })}
    <motion.text x={210} y={75} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      포함된 TX 제거 → TX₀, TX₂, TX₄ 남음
    </motion.text>
  </g>);
}

export function Step1() {
  const remaining = ['TX₀', 'TX₂', 'TX₄'];
  return (<g>
    {remaining.map((tx, i) => (
      <motion.g key={tx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.15 }}>
        <DataBox x={15 + i * 90} y={25} w={70} h={24} label={tx} color={C.recheck} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <line x1={270} y1={37} x2={300} y2={37} stroke={C.recheck} strokeWidth={0.8} />
      <ModuleBox x={305} y={15} w={100} h={42}
        label="ABCI CheckTx" sub="type=Recheck" color={C.recheck} />
    </motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      Front()부터 순회 → 각 TX를 ABCI로 재검증
    </motion.text>
  </g>);
}
