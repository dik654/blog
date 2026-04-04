import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 단일 서버 장애 */
export function StepSingleFailure() {
  return (<g>
    <AlertBox x={120} y={10} w={160} h={42}
      label="단일 서버" sub="죽으면 서비스 전체 중단" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}>
      <ActionBox x={40} y={72} w={130} h={35}
        label="복제본 A" sub="같은 상태 유지" color={C.smr} />
      <ActionBox x={230} y={72} w={130} h={35}
        label="복제본 B" sub="같은 상태 유지" color={C.smr} />
    </motion.g>
    <motion.text x={200} y={125} textAnchor="middle" fontSize={11}
      fill={C.smr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      💡 블록체인 = SMR (트랜잭션 = 명령)
    </motion.text>
  </g>);
}

/* Step 1: 결정론적 실행 */
export function StepDeterministic() {
  const replicas = ['R1', 'R2', 'R3'];
  return (<g>
    <ActionBox x={30} y={15} w={100} h={35}
      label="명령 순서" sub="cmd1 → cmd2 → cmd3" color={C.log} />
    {replicas.map((r, i) => (
      <motion.g key={r} initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
        <ModuleBox x={200} y={5 + i * 38} w={100} h={32}
          label={r} sub="S → S'" color={C.smr} />
        <motion.line x1={130} y1={32} x2={200} y2={21 + i * 38}
          stroke={C.log} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.15 + 0.2 }} />
      </motion.g>
    ))}
    <motion.text x={350} y={65} fontSize={11} fill={C.smr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      같은 순서 → 같은 결과
    </motion.text>
  </g>);
}

/* Step 2: 순서 불일치 문제 */
export function StepOrderConflict() {
  return (<g>
    <ActionBox x={30} y={20} w={100} h={35}
      label="노드 A" sub="cmd1 → cmd2" color={C.smr} />
    <AlertBox x={230} y={20} w={100} h={35}
      label="노드 B" sub="cmd2 → cmd1" color={C.err} />
    <motion.text x={200} y={38} textAnchor="middle" fontSize={12}
      fill={C.err}>≠</motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}>
      <AlertBox x={80} y={72} w={240} h={38}
        label="상태 불일치" sub="네트워크 지연으로 순서가 달라짐" color={C.err} />
    </motion.g>
  </g>);
}

/* Step 3: 해결 — Paxos → Raft → BFT */
export function StepSolution() {
  const protos = [
    { label: 'Paxos', sub: '최초 합의', color: C.paxos },
    { label: 'Raft', sub: '리더 기반', color: C.log },
    { label: 'BFT', sub: '악의적 허용', color: C.smr },
  ];
  return (<g>
    <defs>
      <marker id="smr-a" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
        <path d="M0,0 L6,3 L0,6" fill={C.smr} /></marker>
    </defs>
    {protos.map((p, i) => (
      <motion.g key={p.label} initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15, type: 'spring' }}>
        <ModuleBox x={20 + i * 130} y={20} w={110} h={40}
          label={p.label} sub={p.sub} color={p.color} />
        {i < 2 && (
          <motion.line x1={130 + i * 130} y1={40} x2={150 + i * 130} y2={40}
            stroke={C.smr} strokeWidth={1.2} markerEnd="url(#smr-a)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.15 + 0.3 }} />
        )}
      </motion.g>
    ))}
    <motion.text x={200} y={85} textAnchor="middle" fontSize={11}
      fill={C.smr} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      💡 모두 TOB(전체 순서 브로드캐스트)를 구현
    </motion.text>
  </g>);
}
