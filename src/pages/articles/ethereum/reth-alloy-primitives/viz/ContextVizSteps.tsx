import { motion } from 'framer-motion';
import { AlertBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 모든 데이터 RLP 직렬화 */
export function StepRLP() {
  const types = ['TX', 'Block', 'State', 'Trie'];
  return (<g>
    {types.map((t, i) => (
      <motion.g key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <DataBox x={15 + i * 95} y={25} w={78} h={26} label={t} color={C.rlp} />
      </motion.g>
    ))}
    <motion.text x={210} y={75} textAnchor="middle" fontSize={11} fill={C.rlp} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      전부 RLP로 직렬화
    </motion.text>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      Address, B256, U256 — 가장 빈번한 타입
    </text>
  </g>);
}

/* Step 1: 결정적 직렬화 */
export function StepDeterministic() {
  return (<g>
    <DataBox x={40} y={30} w={120} h={28} label="RLP encode(TX)" color={C.rlp} />
    <motion.line x1={165} y1={44} x2={210} y2={44} stroke={C.ok} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={215} y={30} w={100} h={28} label="keccak256" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      1비트라도 다르면 해시 불일치 → 블록 무효
    </motion.text>
  </g>);
}

/* Step 2: big.Int 힙 할당 */
export function StepHeap() {
  return (<g>
    <AlertBox x={30} y={18} w={160} h={50} label="Go big.Int"
      sub="힙 슬라이스 + GC 압박" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <motion.rect key={i} x={220 + i * 30} y={30 + (i % 2) * 12} width={22} height={18} rx={3}
          fill={`${C.err}15`} stroke={C.err} strokeWidth={0.6}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.08 }} />
      ))}
    </motion.g>
    <text x={295} y={75} textAnchor="middle" fontSize={10} fill={C.err}>malloc + free 반복</text>
    <text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.err}>
      블록당 수천 번 생성 → 성능 저하
    </text>
  </g>);
}
