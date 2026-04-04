import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ForkChoiceTreeVizData';

const D = 0.15;

export function Step0() {
  const forks = ['Fork A w=90', 'Fork B w=210'];
  return (<g>
    <ModuleBox x={150} y={5} w={120} h={38} label="체인 HEAD 선택" sub="어느 포크가 정당한가?" color={C.ghost} />
    {forks.map((f, i) => (
      <motion.g key={f} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * D + 0.3 }}>
        <motion.line x1={210} y1={43} x2={80 + i * 260} y2={60}
          stroke={i === 1 ? C.head : C.node} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * D + 0.3, duration: 0.3 }} />
        <DataBox x={25 + i * 240} y={58} w={110} h={28} label={f} color={i === 1 ? C.head : C.node} />
      </motion.g>
    ))}
    <motion.text x={210} y={102} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      LMD-GHOST: 가장 최근 투표가 ��은 포크 선택
    </motion.text>
  </g>);
}

export function Step1() {
  const fields = ['nodeByRoot map[Root]*Node', 'justifiedCheckpoint', 'bestJustifiedCheckpoint'];
  return (<g>
    <ModuleBox x={110} y={3} w={200} h={100} label="ForkChoiceStore" sub="O(1) 루트 탐색" color={C.store} />
    {fields.map((f, i) => (
      <motion.text key={f} x={130} y={42 + i * 18} fontSize={10} fill="var(--foreground)"
        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.2 }}>
        {f}
      </motion.text>
    ))}
  </g>);
}

export function Step2() {
  const fields = ['slot uint64', 'root [32]byte', 'weight uint64', 'parent *Node', 'children []*Node'];
  return (<g>
    <rect x={130} y={2} width={160} height={105} rx={8} fill="var(--card)" stroke={C.node} strokeWidth={0.7} />
    <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.node}>Node 구조체</text>
    {fields.map((f, i) => (
      <motion.text key={f} x={145} y={35 + i * 15} fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
        {f}
      </motion.text>
    ))}
  </g>);
}
