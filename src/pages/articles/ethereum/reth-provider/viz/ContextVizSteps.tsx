import { motion } from 'framer-motion';
import { ModuleBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 상태 접근 필요 */
export function StepWhy() {
  const modules = [
    { label: 'EVM', sub: '실행', color: C.mem },
    { label: 'RPC', sub: '쿼리', color: C.ok },
    { label: 'Sync', sub: '동기화', color: C.db },
  ];
  return (<g>
    {modules.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <ModuleBox x={20 + i * 110} y={18} w={90} h={42} label={m.label} sub={m.sub} color={m.color} />
      </motion.g>
    ))}
    <motion.text x={175} y={80} textAnchor="middle" fontSize={11} fill={C.provider}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      전부 블록체인 상태에 접근해야 함
    </motion.text>
  </g>);
}

/* Step 1: 시점별 상태 */
export function StepTimepoints() {
  const points = [
    { label: '최신', sub: '메모리', color: C.mem },
    { label: '과거', sub: '디스크', color: C.db },
    { label: '고대', sub: '파일', color: C.file },
  ];
  return (<g>
    {points.map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ModuleBox x={20 + i * 130} y={20} w={110} h={42} label={p.label} sub={p.sub} color={p.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      접근 패턴이 전부 다름 → 통합 인터페이스 필요
    </motion.text>
  </g>);
}

/* Step 2: Geth 문제 */
export function StepGethProblem() {
  return (<g>
    <AlertBox x={60} y={18} w={280} h={50} label="Geth: statedb = 구체 구현"
      sub="테스트 시 실제 DB 필요, Mock 주입 어려움" color={C.err} />
    <motion.text x={200} y={88} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      → trait 추상화가 필요
    </motion.text>
  </g>);
}
