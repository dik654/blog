import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ReceiveRoutineVizData';

export function Step0() {
  return (<g>
    <ModuleBox x={120} y={15} w={180} h={55} label="receiveRoutine()" sub="단일 goroutine · for-select 루프" color={C.handler} />
    <motion.text x={210} y={90} textAnchor="middle" fontSize={10} fill={C.handler}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      락 없이 채널 직렬화 → 동시성 버그 원천 차단
    </motion.text>
    <motion.text x={210} y={106} textAnchor="middle" fontSize={10} fill={C.timeout}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      panic → recover → 노드 안전 중단
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <ActionBox x={10} y={20} w={110} h={38} label="peerMsgQueue" sub="피어 메시지" color={C.peer} />
    <motion.line x1={125} y1={39} x2={170} y2={39} stroke={C.peer} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={175} y={25} w={70} h={28} label="WAL" sub="비동기" color={C.wal} />
    </motion.g>
    <motion.line x1={250} y1={39} x2={290} y2={39} stroke={C.handler} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ModuleBox x={295} y={15} w={105} h={48} label="handleMsg" sub="상태 전이" color={C.handler} />
    </motion.g>
    <text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      Proposal · Vote · BlockPart → WAL 기록 → 디스패치
    </text>
  </g>);
}

export function Step2() {
  return (<g>
    <ActionBox x={10} y={20} w={120} h={38} label="internalMsgQueue" sub="자신의 투표" color={C.internal} />
    <motion.line x1={135} y1={39} x2={170} y2={39} stroke={C.internal} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={175} y={25} w={80} h={28} label="WAL" sub="동기(fsync)" color={C.wal} />
    </motion.g>
    <motion.line x1={260} y1={39} x2={290} y2={39} stroke={C.handler} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ModuleBox x={295} y={15} w={105} h={48} label="handleMsg" sub="상태 전이" color={C.handler} />
    </motion.g>
    <text x={210} y={85} textAnchor="middle" fontSize={10} fill={C.wal}>
      WriteSync — 크래시 시 자신의 서명 복구 보장
    </text>
  </g>);
}

export function Step3() {
  const msgs = [
    { label: 'Proposal', target: 'setProposal', color: C.peer },
    { label: 'BlockPart', target: 'addPart → enterPrevote', color: C.internal },
    { label: 'Vote', target: 'tryAddVote → 상태전이', color: C.handler },
  ];
  return (<g>
    {msgs.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <DataBox x={15} y={12 + i * 30} w={85} h={24} label={m.label} color={m.color} />
        <motion.line x1={105} y1={24 + i * 30} x2={165} y2={24 + i * 30}
          stroke={m.color} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.15 + 0.2 }} />
        <text x={172} y={28 + i * 30} fontSize={10} fill="var(--foreground)">{m.target}</text>
      </motion.g>
    ))}
    <motion.text x={350} y={50} fontSize={10} fill={C.handler}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      2/3+ 수집 시
    </motion.text>
    <motion.text x={350} y={64} fontSize={10} fill={C.handler}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      다음 단계로 전이
    </motion.text>
  </g>);
}
