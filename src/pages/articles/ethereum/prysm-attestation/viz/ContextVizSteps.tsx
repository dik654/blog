import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepVoting() {
  const votes = [
    { label: 'Head', sub: '0x3f2a...' },
    { label: 'Source', sub: 'Ep 149' },
    { label: 'Target', sub: 'Ep 150' },
  ];
  return (<g>
    {votes.map((v, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={20 + i * 138} y={25} width={110} height={38} rx={6}
          fill={`${C.attest}12`} stroke={C.attest} strokeWidth={1} />
        <text x={75 + i * 138} y={42} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.attest}>{v.label}</text>
        <text x={75 + i * 138} y={56} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{v.sub}</text>
      </motion.g>
    ))}
    <text x={210} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      3중 투표 — head(블록 루트), source(justified), target(현재 에폭)
    </text>
  </g>);
}

export function StepVolume() {
  return (<g>
    <AlertBox x={80} y={18} w={260} h={50} label="에폭당 ~580,000 어테스테이션"
      sub="슬롯당 ~18,000개 — 개별 BLS 검증 불가" color={C.err} />
    <motion.text x={210} y={92} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      효율적 집계 + 서브넷 분산 필수
    </motion.text>
  </g>);
}

export function StepBandwidth() {
  return (<g>
    <AlertBox x={110} y={18} w={200} h={50} label="전체 브로드캐스트"
      sub="대역폭 폭발" color={C.err} />
    <motion.text x={210} y={92} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      64개 서브넷으로 분산 필요
    </motion.text>
  </g>);
}

export function StepSubnet() {
  const subnets = [
    { id: 0, count: '~280' },
    { id: 1, count: '~280' },
    { id: 2, count: '~280' },
    { id: 3, count: '~280' },
  ];
  return (<g>
    {subnets.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <ModuleBox x={10 + i * 105} y={20} w={90} h={42} label={`Subnet ${s.id}`}
          sub={`${s.count}명/위원회`} color={C.subnet} />
      </motion.g>
    ))}
    <text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      ... 총 64개 서브넷 × ~280명 = ~18,000 검증자/슬롯
    </text>
  </g>);
}

export function StepBLSAggregate() {
  return (<g>
    {Array.from({ length: 4 }, (_, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
        <rect x={15 + i * 68} y={20} width={55} height={24} rx={12}
          fill="var(--card)" stroke={C.attest} strokeWidth={0.7} />
        <text x={42 + i * 68} y={36} textAnchor="middle" fontSize={10} fill={C.attest}>sig_{i}</text>
      </motion.g>
    ))}
    <motion.line x1={300} y1={32} x2={330} y2={55} stroke={C.ok} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={290} y={52} w={110} h={28} label="1개 집계 서명" sub="크기 ↓ 검증 ↑" color={C.ok} />
    </motion.g>
  </g>);
}
