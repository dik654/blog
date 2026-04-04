import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './BlockStoreVizData';

export function Step0() {
  return (<g>
    <ModuleBox x={130} y={15} w={160} h={55} label="BlockStore" sub="LevelDB 블록 저장소" color={C.block} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <text x={165} y={86} fontSize={10} fill="var(--muted-foreground)">base: 1</text>
      <text x={245} y={86} fontSize={10} fill="var(--muted-foreground)">height: 18,400,000</text>
    </motion.g>
    <text x={210} y={110} textAnchor="middle" fontSize={10} fill={C.block}>
      base~height 연속 범위 보장 (contiguous)
    </text>
  </g>);
}

export function Step1() {
  const parts = [
    { label: 'BlockMeta', sub: '헤더 해시', color: C.block },
    { label: 'Part₀', sub: '65KB', color: C.part },
    { label: 'Part₁', sub: '65KB', color: C.part },
    { label: 'Commit', sub: '2/3+ 서명', color: C.commit },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      SaveBlock(block, parts, commit) → 4종류 키로 분리
    </text>
    {parts.map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 + 0.2 }}>
        <DataBox x={15 + i * 100} y={30} w={90} h={32} label={p.label} sub={p.sub} color={p.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill={C.db}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      calcBlockPartKey(height, index) → LevelDB에 개별 저장
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <ModuleBox x={15} y={22} w={90} h={42} label="LoadBlock" sub="height=h" color={C.block} />
    <motion.line x1={110} y1={43} x2={145} y2={43} stroke={C.block} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    {['Part₀', 'Part₁', 'Part₂'].map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.12 + 0.3 }}>
        <DataBox x={150} y={15 + i * 26} w={60} h={22} label={p} color={C.part} />
      </motion.g>
    ))}
    <motion.line x1={215} y1={43} x2={260} y2={43} stroke={C.commit} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <rect x={265} y={22} width={130} height={42} rx={8} fill="var(--card)" stroke={C.commit} strokeWidth={0.8} />
      <text x={330} y={40} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.commit}>완성 Block</text>
      <text x={330} y={55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">PartSet.Complete()</text>
    </motion.g>
    <text x={210} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      파트를 모아서 역직렬화 → 블록 반환
    </text>
  </g>);
}
