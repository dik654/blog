import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 블록 수신 */
export function StepReceive() {
  return (<g>
    <motion.circle r={5} fill={C.block}
      initial={{ cx: 30, cy: 50, opacity: 1 }}
      animate={{ cx: 160, cy: 50, opacity: 0.3 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }} />
    <text x={60} y={35} fontSize={10} fill="var(--muted-foreground)">P2P 수신</text>
    <ModuleBox x={180} y={25} w={120} h={45} label="onBlock()" sub="검증 파이프라인" color={C.block} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={320} y={32} w={80} h={30} label="상태 반영" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 1: 다양한 오퍼레이션 */
export function StepOps() {
  const ops = [
    { name: 'RANDAO', max: '1' },
    { name: 'eth1', max: '1' },
    { name: 'Attest', max: '128' },
    { name: 'Deposit', max: '16' },
    { name: 'Exit', max: '16' },
  ];
  return (<g>
    {ops.map((op, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={10 + i * 82} y={25} width={70} height={36} rx={13}
          fill={`${C.ops}12`} stroke={C.ops} strokeWidth={0.8} />
        <text x={45 + i * 82} y={42} textAnchor="middle" fontSize={11} fill={C.ops}>{op.name}</text>
        <text x={45 + i * 82} y={54} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">max {op.max}</text>
      </motion.g>
    ))}
    <text x={210} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      스펙 순서대로 처리해야 상태 일관성 유지
    </text>
  </g>);
}

/* Step 2: EL 위임 */
export function StepELDelegation() {
  return (<g>
    <ModuleBox x={30} y={20} w={100} h={45} label="CL (Prysm)" sub="비콘 블록" color={C.block} />
    <motion.line x1={135} y1={42} x2={195} y2={42} stroke={C.exec} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.text x={165} y={35} textAnchor="middle" fontSize={10} fill={C.exec}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Engine API
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={200} y={20} w={100} h={45} label="EL (Geth)" sub="TX 실행" color={C.exec} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={320} y={28} w={80} h={28} label="VALID?" color={C.ok} />
    </motion.g>
  </g>);
}

/* Step 3: 6단계 파이프라인 */
export function StepPipeline() {
  const stages = ['부모 조회', '슬롯 전진', 'ProcessBlock'];
  return (<g>
    {stages.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ActionBox x={10 + i * 138} y={25} w={115} h={40} label={s}
          sub={['getState()', 'ProcessSlots', '헤더→OPS→EL'][i]} color={C.block} />
        {i < 2 && (
          <motion.line x1={125 + i * 138} y1={45} x2={148 + i * 138} y2={45}
            stroke={C.block} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.12 + 0.2, duration: 0.2 }} />
        )}
      </motion.g>
    ))}
    <text x={210} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">onBlock → ProcessSlots → ProcessBlock → DB 저장</text>
  </g>);
}
/* Step 4: 배치 BLS */
export function StepBatchBLS() {
  return (<g>
    {Array.from({ length: 4 }, (_, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
        <rect x={15 + i * 68} y={20} width={55} height={24} rx={12}
          fill="var(--card)" stroke={C.block} strokeWidth={0.7} />
        <text x={42 + i * 68} y={36} textAnchor="middle" fontSize={10} fill={C.block}>sig_{i}</text>
      </motion.g>
    ))}
    <motion.line x1={300} y1={32} x2={330} y2={55} stroke={C.ok} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={295} y={52} w={100} h={28} label="배치 검증" sub="한 번에 통과" color={C.ok} />
    </motion.g>
    <text x={210} y={100} textAnchor="middle" fontSize={10} fill={C.ok}>개별 검증 대비 수십 배 빠름</text>
  </g>);
}
