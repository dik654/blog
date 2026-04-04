import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 랜덤 필요성 */
export function StepNeed() {
  const useCases = [
    { label: '블록 추첨', y: 15 },
    { label: '챌린지 생성', y: 50 },
    { label: '검증자 선택', y: 85 },
  ];
  return (<g>
    {useCases.map((u, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ActionBox x={15} y={u.y} w={120} h={28} label={u.label} color={C.bls} />
      </motion.g>
    ))}
    <motion.line x1={145} y1={55} x2={200} y2={55} stroke={C.ok} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
    <DataBox x={210} y={40} w={120} h={30} label="편향 불가 랜덤" color={C.ok} />
    <AlertBox x={210} y={85} w={120} h={28} label="단일 노드 = 조작" color={C.err} />
  </g>);
}

/* Step 1: 기존 방법의 한계 */
export function StepProblem() {
  return (<g>
    <ModuleBox x={20} y={20} w={110} h={42} label="단일 노드" sub="직접 랜덤 생성" color={C.err} />
    <AlertBox x={155} y={20} w={110} h={42} label="조작 가능" sub="유리한 값 선택" color={C.err} />
    <ModuleBox x={20} y={75} w={110} h={42} label="커밋-리빌" sub="해시 커밋 → 공개" color={C.node} />
    <AlertBox x={155} y={75} w={110} h={42} label="가용성 문제" sub="마지막 공개자 편향" color={C.err} />
    <motion.text x={350} y={65} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      두 방법 모두 편향 가능
    </motion.text>
  </g>);
}

/* Step 2: DRAND 해결 */
export function StepSolution() {
  const nodes = Array.from({ length: 5 }, (_, i) => ({
    x: 30 + i * 42, y: 20,
  }));
  return (<g>
    <defs><marker id="dr-a" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.ok} /></marker></defs>
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.08, type: 'spring' }}>
        <circle cx={n.x} cy={n.y + 12} r={12} fill={`${C.bls}15`} stroke={C.bls} strokeWidth={1} />
        <text x={n.x} y={n.y + 16} textAnchor="middle" fontSize={10} fill={C.bls}>N{i + 1}</text>
      </motion.g>
    ))}
    <motion.text x={120} y={55} fontSize={11} fill={C.node}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      각자 부분 서명 제출
    </motion.text>
    <motion.line x1={120} y1={60} x2={200} y2={80} stroke={C.ok} strokeWidth={0.8}
      markerEnd="url(#dr-a)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.6 }} />
    <ActionBox x={205} y={65} w={100} h={32} label="t개 집계" sub="임계값 도달" color={C.ok} />
    <motion.line x1={305} y1={81} x2={335} y2={81} stroke={C.ok} strokeWidth={0.8}
      markerEnd="url(#dr-a)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.8 }} />
    <DataBox x={340} y={68} w={70} h={28} label="랜덤" color={C.rand} />
    <motion.text x={250} y={115} textAnchor="middle" fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      t개 미만 = 불완성 / 완성 후 = 결과 고정
    </motion.text>
  </g>);
}
