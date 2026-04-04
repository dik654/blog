import { motion } from 'framer-motion';
import { DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { C } from './BodiesDetailVizData';

export function Step0() {
  return (<g>
    <rect x={30} y={35} width={360} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={50} y={52} fontSize={10} fill="var(--muted-foreground)">checkpoint</text>
    <motion.rect x={50} y={58} height={6} rx={3} fill={C.range}
      initial={{ width: 0 }} animate={{ width: 200 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
    <rect x={50} y={58} width={320} height={6} rx={3} fill="var(--border)" opacity={0.2} />
    <motion.text x={255} y={55} fontSize={11} fill={C.range} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      start=15,000,001 → end=15,001,000
    </motion.text>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      next_block_range() — 바디 다운로드 범위 결정
    </text>
  </g>);
}

export function Step1() {
  return (<g>
    <circle cx={45} cy={50} r={20} fill={`${C.peer}12`} stroke={C.peer} strokeWidth={0.8} />
    <text x={45} y={54} textAnchor="middle" fontSize={11} fill={C.peer}>Peer</text>
    <motion.line x1={68} y1={50} x2={135} y2={50} stroke={C.peer} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    {[0, 1].map(i => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 + i * 0.2 }}>
        <DataBox x={140 + i * 120} y={32} w={105} h={30} label={`Body #${i}`} sub="txs + uncles" color={C.peer} />
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      GetBlockBodies → 트랜잭션 목록 + 엉클 수신
    </text>
  </g>);
}

export function Step2() {
  return (<g>
    <DataBox x={20} y={25} w={100} h={28} label="Header" sub="tx_root" color={C.range} />
    <DataBox x={20} y={62} w={100} h={28} label="Body" sub="txs[]" color={C.peer} />
    <motion.line x1={125} y1={48} x2={175} y2={48} stroke="var(--muted-foreground)" strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.line x1={125} y1={76} x2={175} y2={58} stroke="var(--muted-foreground)" strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={180} y={30} w={130} h={38} label="DeriveSha(txs)" sub="tx_root 일치 검증" color={C.valid} />
    </motion.g>
    <motion.text x={350} y={54} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.valid}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      ✓ match
    </motion.text>
    <text x={210} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      헤더 tx_root와 바디 해시 대조 — 불일치 시 피어 차단
    </text>
  </g>);
}

export function Step3() {
  const blocks = ['B₁', 'B₂', 'B₃'];
  return (<g>
    {blocks.map((b, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.1 }}>
        <DataBox x={20 + i * 70} y={35} w={60} h={24} label={b} color={C.valid} />
      </motion.g>
    ))}
    <motion.line x1={235} y1={47} x2={290} y2={47} stroke={C.db} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ellipse cx={340} cy={47} rx={40} ry={25} fill={`${C.db}10`} stroke={C.db} strokeWidth={0.8} />
      <text x={340} y={44} textAnchor="middle" fontSize={11} fill={C.db}>DB</text>
      <text x={340} y={56} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">insert</text>
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      검증된 바디를 MDBX에 저장
    </text>
  </g>);
}

export function Step4() {
  return (<g>
    <StatusBox x={100} y={20} w={220} h={55} label="BodiesStage 완료"
      sub="checkpoint = 15,001,000" color={C.check} progress={1} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={130} y={82} width={160} height={22} rx={11} fill="var(--card)" />
      <rect x={130} y={82} width={160} height={22} rx={11}
        fill={`${C.check}12`} stroke={C.check} strokeWidth={0.8} />
      <text x={210} y={97} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.check}>
        Checkpoint(end) 저장
      </text>
    </motion.g>
  </g>);
}
