import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ProtocolVizData';

const N = 5, T = 3;

/* Step 0: DKG 과정 */
export function StepDKG() {
  return (<g>
    {Array.from({ length: N }, (_, i) => {
      const x = 15 + i * 78;
      return (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}>
          <ModuleBox x={x} y={15} w={65} h={42} label={`Node ${i + 1}`} sub={`sk_${i + 1}`} color={C.bls} />
        </motion.g>
      );
    })}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={140} y={75} w={140} h={28} label={`PK (공개) / t=${T}-of-${N}`} color={C.ok} />
    </motion.g>
    <motion.text x={210} y={120} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      전체 비밀키 sk는 어떤 단일 노드도 알지 못함
    </motion.text>
  </g>);
}

/* Step 1: 부분 서명 → 집계 */
export function StepAggregate() {
  return (<g>
    <defs><marker id="pr-a" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.ok} /></marker></defs>
    {Array.from({ length: T }, (_, i) => {
      const x = 15 + i * 100;
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.15 }}>
          <ModuleBox x={x} y={10} w={80} h={38} label={`Node ${i + 1}`} sub={`sig_${i + 1}`} color={C.bls} />
          <motion.line x1={x + 40} y1={48} x2={x + 40} y2={70}
            stroke={C.bls} strokeWidth={0.8} markerEnd="url(#pr-a)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.15 + 0.3 }} />
        </motion.g>
      );
    })}
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, type: 'spring' }}>
      <ActionBox x={80} y={72} w={160} h={32} label="라그랑주 보간 집계" sub="Sigma = Aggregate(...)" color={C.ok} />
    </motion.g>
    <text x={340} y={40} fontSize={11} fill="var(--muted-foreground)">
      <tspan x={320} dy={0}>t={T}개 이상</tspan>
      <tspan x={320} dy={14}>부분 서명 필요</tspan>
    </text>
  </g>);
}

/* Step 2: 랜덤 출력 */
export function StepOutput() {
  return (<g>
    <defs><marker id="pr-b" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.hash} /></marker></defs>
    <DataBox x={30} y={35} w={100} h={30} label="Sigma (집계 서명)" color={C.bls} />
    <motion.line x1={130} y1={50} x2={175} y2={50}
      stroke={C.hash} strokeWidth={1} markerEnd="url(#pr-b)"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <ActionBox x={180} y={32} w={80} h={36} label="SHA-256" sub="해시" color={C.hash} />
    <motion.line x1={260} y1={50} x2={295} y2={50}
      stroke={C.hash} strokeWidth={1} markerEnd="url(#pr-b)"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
    <DataBox x={300} y={35} w={100} h={30} label="랜덤 바이트열" color={C.ok} />
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      BLS 결정론적 서명: 같은 라운드 → 같은 결과
    </motion.text>
    <motion.text x={210} y={112} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      완성 순간 결과 고정 — 조작 불가
    </motion.text>
  </g>);
}
