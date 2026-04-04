import { motion } from 'framer-motion';
import { AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './EvidencePoolVizData';

export function Step0() {
  return (<g>
    <AlertBox x={20} y={15} w={160} h={50} label="DuplicateVote" sub="같은 H/R에 다른 블록 투표" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <AlertBox x={220} y={15} w={180} h={50} label="LightClientAttack" sub="위조 헤더로 클라이언트 기만" color={C.err} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill={C.ev}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      두 종류의 비잔틴 증거를 수집하여 슬래싱에 사용
    </motion.text>
  </g>);
}

export function Step1() {
  const checks = ['중복 확인', '밸리데이터 로드', '만료 확인', '서명 검증'];
  return (<g>
    <AlertBox x={10} y={28} w={70} h={35} label="증거" sub="" color={C.err} />
    <motion.line x1={85} y1={45} x2={105} y2={45} stroke={C.ev} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.2 }} />
    {checks.map((c, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.15 + 0.2 }}>
        <rect x={110 + i * 72} y={30} width={65} height={28} rx={6}
          fill="var(--card)" stroke={C.ev} strokeWidth={0.6} />
        <text x={142 + i * 72} y={48} textAnchor="middle" fontSize={10} fill={C.ev}>{c}</text>
        {i < 3 && <text x={178 + i * 72} y={48} fontSize={11} fill="var(--muted-foreground)">{'→'}</text>}
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <DataBox x={160} y={72} w={100} h={26} label="풀에 추가" color={C.ok} />
    </motion.g>
  </g>);
}

export function Step2() {
  return (<g>
    <ActionBox x={15} y={20} w={110} h={42} label="PendingEvidence" sub="maxBytes 한도" color={C.ev} />
    <motion.line x1={130} y1={41} x2={165} y2={41} stroke={C.ev} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={170} y={25} w={90} h={32} label="블록 포함" sub="증거 삽입" color={C.block} />
    </motion.g>
    <motion.line x1={265} y1={41} x2={295} y2={41} stroke={C.ok} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={300} y={25} w={100} h={32} label="Update()" sub="committed 제거" color={C.ok} />
    </motion.g>
    <text x={210} y={85} textAnchor="middle" fontSize={10} fill={C.err}>
      블록 확정 후 앱 레이어에서 슬래싱 처리
    </text>
  </g>);
}
