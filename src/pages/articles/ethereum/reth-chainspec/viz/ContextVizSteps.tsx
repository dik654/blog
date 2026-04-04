import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 네트워크마다 다른 타이밍 */
export function StepNetworks() {
  const nets = [
    { name: 'Mainnet', sub: 'Cancun @1710338135', color: C.chain },
    { name: 'Sepolia', sub: 'Cancun @1706655072', color: C.fork },
    { name: 'Holesky', sub: 'Cancun @1707305664', color: C.gen },
  ];
  return (<g>
    {nets.map((n, i) => (
      <motion.g key={n.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ModuleBox x={10 + i * 138} y={20} w={120} h={45} label={n.name} sub={n.sub} color={n.color} />
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      같은 하드포크도 네트워크마다 활성화 시점이 다름
    </text>
  </g>);
}

/* Step 1: 세 가지 활성화 조건 */
export function StepThreeConditions() {
  const conds = [
    { name: 'Block', sub: '#12,965,000', color: C.chain },
    { name: 'TTD', sub: '58750000000...', color: C.gen },
    { name: 'Timestamp', sub: '1710338135', color: C.fork },
  ];
  return (<g>
    {conds.map((c, i) => (
      <motion.g key={c.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ActionBox x={10 + i * 138} y={25} w={120} h={42} label={c.name} sub={c.sub} color={c.color} />
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      세 가지 방식이 혼재 — 각 방식에 맞는 비교 로직 필요
    </text>
  </g>);
}

/* Step 2: Geth nil 체크 문제 */
export function StepGethNil() {
  return (<g>
    <AlertBox x={60} y={15} w={300} h={55}
      label="Geth ChainConfig" sub="LondonBlock *big.Int — nil이면 비활성" color={C.err} />
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      nil 체크를 빠뜨리면 합의 실패 → 네트워크 분리
    </motion.text>
  </g>);
}
