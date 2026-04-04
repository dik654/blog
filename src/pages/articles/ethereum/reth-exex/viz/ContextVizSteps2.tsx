import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: ExEx — 노드 내부 스트림 */
export function StepExExInternal() {
  return (<g>
    <ModuleBox x={20} y={18} w={100} h={48} label="Pipeline" sub="블록 실행" color={C.pipeline} />
    <motion.line x1={125} y1={42} x2={165} y2={42} stroke={C.mgr} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={170} y={18} w={100} h={48} label="ExExManager" sub="fan-out" color={C.mgr} />
    </motion.g>
    {['인덱서', '브릿지', '분석'].map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 + i * 0.1 }}>
        <DataBox x={310} y={8 + i * 28} w={80} h={22} label={`${s} ExEx`} color={C.ext} />
        <motion.line x1={275} y1={42} x2={308} y2={19 + i * 28}
          stroke={C.mgr} strokeWidth={0.7} strokeDasharray="3"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.2 }} />
      </motion.g>
    ))}
    <text x={210} y={105} textAnchor="middle" fontSize={11} fill={C.ext}>
      노드 프로세스 안에서 모든 처리 — 별도 서비스 불필요
    </text>
  </g>);
}

/* Step 4: 3종 알림 + FinishedHeight */
export function StepNotifications() {
  const notifs = [
    { label: 'ChainCommitted', sub: '새 블록', color: C.ext },
    { label: 'ChainReverted', sub: 'reorg 롤백', color: C.idx },
    { label: 'ChainReorged', sub: '체인 교체', color: C.err },
  ];
  return (<g>
    {notifs.map((n, i) => (
      <motion.g key={n.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={10 + i * 130} y={20} w={115} h={28} label={n.label} sub={n.sub} color={n.color} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={100} y={65} width={220} height={28} rx={14} fill="var(--card)" />
      <rect x={100} y={65} width={220} height={28} rx={14}
        fill={`${C.mgr}12`} stroke={C.mgr} strokeWidth={0.8} />
      <text x={210} y={83} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.mgr}>
        FinishedHeight → 프루닝 기준점
      </text>
    </motion.g>
  </g>);
}
