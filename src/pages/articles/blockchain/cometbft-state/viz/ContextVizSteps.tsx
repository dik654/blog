import { motion } from 'framer-motion';
import { ModuleBox, DataBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function Step0() {
  return (<g>
    <ModuleBox x={30} y={20} w={110} h={48} label="합의 엔진" sub="CometBFT" color={C.state} />
    <motion.line x1={145} y1={44} x2={195} y2={44} stroke={C.state} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={200} y={20} w={90} h={48} label="State DB" sub="영구 저장" color={C.db} />
    </motion.g>
    <motion.text x={345} y={38} fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      {'없으면?'}
    </motion.text>
    <motion.text x={345} y={52} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      크래시 → 제네시스부터
    </motion.text>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      재시작 시 마지막 확정 블록부터 이어서 합의
    </text>
  </g>);
}

export function Step1() {
  const items = [
    { label: 'State', sub: '스냅샷', color: C.state, x: 20 },
    { label: 'BlockStore', sub: '높이→파트', color: C.block, x: 155 },
    { label: 'EvidencePool', sub: '풀→블록', color: C.evidence, x: 290 },
  ];
  return (<g>
    {items.map((it, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ModuleBox x={it.x} y={25} w={120} h={48} label={it.label} sub={it.sub} color={it.color} />
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      각각 다른 저장 패턴 — 조회 방식도 다름
    </text>
  </g>);
}

export function Step2() {
  const fields = ['LastBlockHeight', 'Validators', 'NextValidators', 'ConsensusParams', 'AppHash'];
  return (<g>
    <rect x={60} y={10} width={300} height={90} rx={8} fill="var(--card)" stroke={C.state} strokeWidth={0.8} />
    <text x={210} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.state}>State</text>
    {fields.map((f, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 + 0.2 }}>
        <text x={80 + (i % 3) * 100} y={50 + Math.floor(i / 3) * 20}
          fontSize={10} fill="var(--foreground)">{f}</text>
      </motion.g>
    ))}
    <text x={210} y={118} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      블록 확정 시 갱신 → store.Save(state)
    </text>
  </g>);
}

export function Step3() {
  return (<g>
    <ModuleBox x={20} y={18} w={100} h={45} label="BlockStore" sub="LevelDB" color={C.block} />
    <motion.line x1={125} y1={40} x2={165} y2={40} stroke={C.block} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    {['Meta', 'Part₀', 'Part₁', 'Commit'].map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 + 0.4 }}>
        <DataBox x={170 + i * 58} y={26} w={52} h={26} label={p} color={C.block} />
      </motion.g>
    ))}
    <text x={210} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      높이 → BlockMeta + 파트들 + Commit 분리 저장
    </text>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      LoadBlock(h) = 파트 조합 → 완성 블록
    </motion.text>
  </g>);
}

