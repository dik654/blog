import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepActor() {
  const actors = ['Account', 'Miner', 'Market', 'Power', 'Reward'];
  return (<g>
    {actors.map((a, i) => (
      <motion.g key={a} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}>
        <rect x={6 + i * 82} y={30} width={72} height={28} rx={4}
          fill={`${C.actor}12`} stroke={C.actor} strokeWidth={0.8} />
        <text x={42 + i * 82} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.actor}>{a}</text>
      </motion.g>
    ))}
    <text x={210} y={85} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      모든 온체인 엔티티가 Actor (잔고 + nonce + 코드CID + 상태CID)
    </text>
  </g>);
}

export function StepHamt() {
  return (<g>
    <DataBox x={20} y={20} w={70} h={26} label="Key" sub="주소" color={C.actor} />
    <motion.line x1={95} y1={33} x2={135} y2={33} stroke={C.hamt} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <ActionBox x={140} y={15} w={120} h={38} label="SHA-256 해시" sub="비트폭 5 슬라이스" color={C.hamt} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={300} y={15} w={100} h={42} label="HAMT Node" sub="IPLD DAG" color={C.hamt} />
    </motion.g>
    <text x={210} y={80} textAnchor="middle" fontSize={11} fill={C.hamt}>
      각 노드: 최대 32개 슬롯 (2^5), 버킷 크기 3
    </text>
  </g>);
}

export function StepAmt() {
  return (<g>
    <ActionBox x={30} y={25} w={140} h={38} label="AMT" sub="Array Mapped Trie" color={C.amt} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <DataBox x={210} y={20} w={80} h={28} label="섹터 0" color={C.amt} />
      <DataBox x={300} y={20} w={80} h={28} label="섹터 1" color={C.amt} />
      <text x={280} y={75} textAnchor="middle" fontSize={11} fill={C.amt}>
        인덱스 기반 접근 — 수백만 섹터 효율 관리
      </text>
    </motion.g>
  </g>);
}

export function StepTree() {
  return (<g>
    <ModuleBox x={30} y={15} w={130} h={42} label="StateTree" sub="주소 → Actor" color={C.state} />
    <motion.line x1={165} y1={36} x2={210} y2={36} stroke={C.state} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={215} y={20} w={110} h={32} label="State Root" sub="HAMT root CID" color={C.hamt} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      에폭마다 새 state root — 이전 상태도 IPLD로 보존
    </motion.text>
  </g>);
}
