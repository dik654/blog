import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function Step0() {
  return (<g>
    <DataBox x={20} y={22} w={100} h={32} label="확정 블록" sub="합의 완료" color={C.exec} />
    <motion.line x1={125} y1={38} x2={175} y2={38} stroke={C.exec} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={180} y={14} w={130} h={48} label="ApplyBlock" sub="유일한 실행 진입점" color={C.exec} />
    </motion.g>
    <motion.line x1={315} y1={38} x2={350} y2={38} stroke={C.abci} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <DataBox x={355} y={22} w={55} h={32} label="상태 전진" color={C.abci} />
    </motion.g>
    <text x={210} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      합의 완료 → ApplyBlock → 상태 전진 (H → H+1)
    </text>
  </g>);
}

export function Step1() {
  return (<g>
    <ActionBox x={30} y={15} w={100} h={35} label="ABCI 호출" color={C.abci} />
    <motion.text x={140} y={36} fontSize={12} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>+</motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ActionBox x={155} y={15} w={100} h={35} label="상태 갱신" color={C.save} />
    </motion.g>
    <motion.text x={265} y={36} fontSize={12} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>+</motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={280} y={15} w={100} h={35} label="DB 기록" color={C.save} />
    </motion.g>
    <motion.text x={210} y={72} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      모두 원자적으로 — 중간 크래시 시 불일치 위험
    </motion.text>
  </g>);
}

export function Step2() {
  const steps = [
    { label: 'Validate', color: C.validate },
    { label: 'Finalize', color: C.abci },
    { label: 'Update', color: C.exec },
    { label: 'Commit', color: C.abci },
    { label: 'Save', color: C.save },
    { label: 'Events', color: C.event },
  ];
  return (<g>
    {steps.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={5 + i * 68} y={28} width={60} height={28} rx={14}
          fill={`${s.color}12`} stroke={s.color} strokeWidth={0.7} />
        <text x={35 + i * 68} y={46} textAnchor="middle" fontSize={10}
          fill={s.color}>{s.label}</text>
        {i < 5 && <text x={67 + i * 68} y={46} fontSize={11} fill="var(--muted-foreground)">{'→'}</text>}
      </motion.g>
    ))}
    <text x={210} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      ApplyBlock 내부 — 6단계 순차 실행
    </text>
  </g>);
}

export function Step3() {
  const checks = [
    { label: 'ChainID', sub: '일치', color: C.validate },
    { label: 'Height', sub: 'Last+1', color: C.validate },
    { label: 'LastCommit', sub: '2/3+ 서명', color: C.exec },
    { label: 'Evidence', sub: '유효기간', color: C.err },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      validateBlock(state, block) — 4가지 검증
    </text>
    {checks.map((c, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.15 + 0.2 }}>
        <DataBox x={8 + i * 102} y={30} w={92} h={35} label={c.label} sub={c.sub} color={c.color} />
      </motion.g>
    ))}
    <text x={210} y={88} textAnchor="middle" fontSize={10} fill={C.err}>
      하나라도 실패 → ErrInvalidBlock 반환
    </text>
  </g>);
}

