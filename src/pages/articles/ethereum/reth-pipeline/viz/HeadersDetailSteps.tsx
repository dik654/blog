import { motion } from 'framer-motion';
import { DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { C } from './HeadersDetailVizData';

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
      next_block_range() — 헤더 다운로드 범위 결정
    </text>
  </g>);
}

export function Step1() {
  const peers = [{ cx: 40, label: 'P₁' }, { cx: 40, label: 'P₂' }];
  return (<g>
    {peers.map((p, i) => (
      <g key={i}>
        <circle cx={p.cx} cy={30 + i * 45} r={18} fill={`${C.peer}12`} stroke={C.peer} strokeWidth={0.8} />
        <text x={p.cx} y={34 + i * 45} textAnchor="middle" fontSize={11} fill={C.peer}>{p.label}</text>
        <motion.line x1={62} y1={30 + i * 45} x2={140} y2={55} stroke={C.peer} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.2, duration: 0.4 }} />
      </g>
    ))}
    {[0, 1, 2].map(i => (
      <motion.g key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 + i * 0.15 }}>
        <DataBox x={145 + i * 80} y={40} w={70} h={24} label={`Header #${i}`} color={C.range} />
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      GetBlockHeaders → 피어에서 헤더 스트림 수신
    </text>
  </g>);
}

export function Step2() {
  return (<g>
    <DataBox x={30} y={30} w={85} h={28} label="parent" sub="#15M" color={C.range} />
    <DataBox x={155} y={30} w={85} h={28} label="child" sub="#15M+1" color={C.range} />
    <motion.line x1={118} y1={44} x2={152} y2={44} stroke="var(--muted-foreground)" strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={270} y={22} w={120} h={40} label="validate_header" sub="hash · number · time" color={C.valid} />
    </motion.g>
    <motion.text x={330} y={80} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.valid}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      ✓ valid
    </motion.text>
    <text x={210} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      parent_hash · block_number · timestamp 일관성 검증
    </text>
  </g>);
}

export function Step3() {
  const headers = ['H₁', 'H₂', 'H₃'];
  return (<g>
    {headers.map((h, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.1 }}>
        <DataBox x={20 + i * 70} y={35} w={60} h={22} label={h} color={C.range} />
      </motion.g>
    ))}
    <motion.line x1={235} y1={46} x2={290} y2={46} stroke={C.db} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ellipse cx={340} cy={46} rx={40} ry={25} fill={`${C.db}10`} stroke={C.db} strokeWidth={0.8} />
      <text x={340} y={43} textAnchor="middle" fontSize={11} fill={C.db}>DB</text>
      <text x={340} y={55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">insert</text>
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      검증된 헤더를 MDBX 배치 삽입
    </text>
  </g>);
}

export function Step4() {
  return (<g>
    <StatusBox x={100} y={20} w={220} h={55} label="HeadersStage 완료"
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
