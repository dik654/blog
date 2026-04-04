import { motion } from 'framer-motion';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepWhy() {
  return (<g>
    <DataBox x={20} y={35} w={70} h={26} label="TX₁" color={C.mem} />
    <DataBox x={100} y={35} w={70} h={26} label="TX₂" color={C.mem} />
    <motion.line x1={175} y1={48} x2={215} y2={48} stroke={C.mem} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={220} y={22} w={100} h={48} label="Mempool" sub="수집·검증·보관" color={C.mem} />
    </motion.g>
    <motion.line x1={325} y1={48} x2={360} y2={48} stroke={C.check} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={365} y={35} w={45} h={26} label="Block" color={C.check} />
    </motion.g>
    <text x={210} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      제안자가 멤풀에서 TX를 꺼내 블록 생성
    </text>
  </g>);
}

export function StepProblem() {
  const problems = [
    { label: '중복 TX', desc: '같은 TX 여러 피어에서 도착', color: C.err },
    { label: '무효 TX', desc: 'nonce 오류, 잔고 부족', color: C.err },
    { label: '상태 변경', desc: '블록 후 남은 TX 무효화', color: C.recheck },
  ];
  return (<g>
    {problems.map((p, i) => (
      <motion.g key={p.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <AlertBox x={20 + i * 140} y={25} w={120} h={45} label={p.label} sub={p.desc} color={p.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      cache + ABCI CheckTx + Recheck로 해결
    </motion.text>
  </g>);
}

export function StepCList() {
  const txs = ['TX₀', 'TX₁', 'TX₂', 'TX₃', 'TX₄'];
  return (<g>
    {txs.map((tx, i) => (
      <motion.g key={tx} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.08 }}>
        <rect x={15 + i * 80} y={35} width={60} height={28} rx={14}
          fill={`${C.mem}12`} stroke={C.mem} strokeWidth={0.7} />
        <text x={45 + i * 80} y={53} textAnchor="middle" fontSize={10} fill={C.mem}>{tx}</text>
        {i < txs.length - 1 && (
          <line x1={75 + i * 80} y1={42} x2={95 + i * 80} y2={42} stroke="var(--border)" strokeWidth={0.6} />
        )}
        {i > 0 && (
          <line x1={15 + i * 80} y1={56} x2={-5 + i * 80} y2={56} stroke="var(--border)" strokeWidth={0.6} />
        )}
      </motion.g>
    ))}
    <text x={210} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      이중 연결 리스트: O(1) 삽입/삭제, NextWaitChan()으로 대기
    </text>
  </g>);
}
