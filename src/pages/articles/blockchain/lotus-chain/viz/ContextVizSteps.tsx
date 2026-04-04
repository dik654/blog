import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepBootstrap() {
  const peers = [{ x: 50, y: 30 }, { x: 130, y: 20 }, { x: 90, y: 70 }, { x: 170, y: 60 }];
  return (<g>
    {peers.map((p, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.08, type: 'spring' }}>
        <circle cx={p.x} cy={p.y} r={12} fill="var(--card)" stroke={C.sync} strokeWidth={1} />
        <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fill={C.sync}>P{i}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={260} y={25} w={120} h={40} label="Heaviest Tipset" sub="GossipSub으로 수신" color={C.sync} />
    </motion.g>
    <text x={210} y={110} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      Syncer.incoming ← 새 블록 이벤트 수신
    </text>
  </g>);
}

export function StepHeaders() {
  return (<g>
    {Array.from({ length: 5 }, (_, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: (4 - i) * 0.1 }}>
        <rect x={15 + i * 78} y={35} width={62} height={28} rx={5}
          fill={`${C.valid}12`} stroke={C.valid} strokeWidth={0.8} />
        <text x={46 + i * 78} y={53} textAnchor="middle" fontSize={10} fill={C.valid}>H{4 - i}</text>
        {i < 4 && <text x={77 + i * 78} y={53} fontSize={11} fill="var(--border)">←</text>}
      </motion.g>
    ))}
    <text x={210} y={88} textAnchor="middle" fontSize={11} fill={C.valid}>
      최신 → 제네시스: 부모 CID 연결 검증
    </text>
  </g>);
}

export function StepMessages() {
  return (<g>
    <DataBox x={30} y={25} w={80} h={28} label="Block" sub="헤더만" color={C.sync} />
    <motion.line x1={115} y1={39} x2={160} y2={39} stroke={C.msg} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={165} y={20} w={100} h={38} label="Bitswap" sub="P2P 메시지 수집" color={C.msg} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={300} y={25} w={90} h={28} label="Full Block" sub="검증 4항목 통과" color={C.valid} />
    </motion.g>
    <text x={210} y={88} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      서명 · 타임스탬프 · 부모 해시 · 메시지 루트
    </text>
  </g>);
}

export function StepState() {
  return (<g>
    <DataBox x={15} y={30} w={75} h={28} label="Messages" color={C.msg} />
    <motion.circle r={3} fill={C.state}
      initial={{ cx: 95, cy: 44, opacity: 1 }}
      animate={{ cx: 155, cy: 44, opacity: 0 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }} />
    <ModuleBox x={160} y={20} w={90} h={45} label="FVM" sub="CronTick → 사용자 msg" color={C.state} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={290} y={30} w={100} h={28} label="State Root" sub="HAMT CID" color={C.valid} />
    </motion.g>
  </g>);
}
