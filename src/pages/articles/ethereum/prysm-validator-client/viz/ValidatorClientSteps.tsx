import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ValidatorClientVizData';

export function Step0() {
  return (<g>
    <ModuleBox x={20} y={15} w={120} h={40} label="Beacon Node" sub="검증 로직" color={C.tick} />
    <rect x={20} y={60} width={120} height={18} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.4} />
    <text x={80} y={72} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">서명 키 포함</text>
    <motion.text x={190} y={40} fontSize={14} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      vs
    </motion.text>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={250} y={15} w={140} h={40} label="Validator Client" sub="키만 분리 관리" color={C.why} />
      <AlertBox x={270} y={60} w={100} h={22} label="키 유출 방지" color={C.sign} />
    </motion.g>
  </g>);
}

export function Step1() {
  const ticks = [4800, 4801, 4802];
  return (<g>
    <ModuleBox x={20} y={20} w={110} h={36} label="NextSlot()" sub="채널 수신" color={C.tick} />
    {ticks.map((t, i) => (
      <motion.g key={t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.2 + 0.3 }}>
        <motion.line x1={135} y1={38} x2={175} y2={18 + i * 25}
          stroke={C.tick} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.2 + 0.3 }} />
        <DataBox x={180} y={8 + i * 25} w={90} h={22} label={`Slot ${t}`} color={C.tick} />
      </motion.g>
    ))}
    <motion.text x={340} y={45} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      12초마다 틱
    </motion.text>
  </g>);
}

export function Step2() {
  const roles = ['Proposer', 'Attester', 'SyncCommittee', 'Aggregator'];
  return (<g>
    <ActionBox x={20} y={20} w={100} h={36} label="RolesAt()" sub="gRPC 질의" color={C.duty} />
    {roles.map((r, i) => (
      <motion.g key={r} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.3 }}>
        <motion.line x1={125} y1={38} x2={165} y2={14 + i * 22}
          stroke={C.duty} strokeWidth={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.12 + 0.3 }} />
        <DataBox x={170} y={4 + i * 22} w={100} h={18} label={r} color={C.duty} />
      </motion.g>
    ))}
    <motion.text x={330} y={48} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      슬롯별 역할 할당
    </motion.text>
  </g>);
}
