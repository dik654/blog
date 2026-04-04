import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 탈중앙 시스템에서 시간 증명 */
export function StepNeed() {
  const nodes = [
    { x: 30, y: 20 }, { x: 120, y: 12 }, { x: 75, y: 70 },
    { x: 170, y: 55 }, { x: 35, y: 100 },
  ];
  return (<g>
    {nodes.map((p, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.08, type: 'spring', bounce: 0.4 }}>
        <circle cx={p.x} cy={p.y} r={10} fill="var(--card)" stroke={C.vdf} strokeWidth={1} />
        <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10} fill={C.vdf}>N{i + 1}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={20} fontSize={11} fill={C.time}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      누가 다음 블록 생산자?
    </motion.text>
    <ActionBox x={240} y={35} w={110} h={38} label="랜덤 추첨" sub="편향 불가능해야" color={C.time} />
    <AlertBox x={240} y={82} w={110} h={32} label="미리 계산 = 조작" color={C.err} />
  </g>);
}

/* Step 1: 해시 체인의 한계 */
export function StepHashChain() {
  return (<g>
    {Array.from({ length: 5 }, (_, i) => {
      const x = 20 + i * 75;
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.08 }}>
          <rect x={x} y={35} width={55} height={28} rx={5}
            fill={`${C.vdf}12`} stroke={C.vdf} strokeWidth={0.8} />
          <text x={x + 27} y={53} textAnchor="middle" fontSize={11} fill={C.vdf}>H{i}</text>
          {i < 4 && <line x1={x + 55} y1={49} x2={x + 75} y2={49}
            stroke="var(--border)" strokeWidth={0.6} />}
        </motion.g>
      );
    })}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={140} y={78} w={130} h={38} label="ASIC" sub="100배 빠른 하드웨어" color={C.err} />
    </motion.g>
    <motion.text x={210} y={125} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      빠른 하드웨어 = 시간 단축 = 순차성 파괴
    </motion.text>
  </g>);
}

/* Step 2: VDF 해결 */
export function StepVDFSolution() {
  const steps = ['x', 'x^2', 'x^4', '...', 'x^(2^T)'];
  return (<g>
    <defs><marker id="vdf-a" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.ok} /></marker></defs>
    {steps.map((s, i) => {
      const x = 10 + i * 82;
      return (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={x} y={30} width={62} height={28} rx={14}
            fill={`${C.ok}12`} stroke={C.ok} strokeWidth={1} />
          <text x={x + 31} y={48} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ok}>{s}</text>
          {i < 4 && <line x1={x + 62} y1={44} x2={x + 82} y2={44}
            stroke={C.ok} strokeWidth={0.8} markerEnd="url(#vdf-a)" />}
        </motion.g>
      );
    })}
    <motion.text x={210} y={80} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      T번 순차 제곱만이 유일한 경로 (병렬화 불가)
    </motion.text>
    <ActionBox x={130} y={90} w={160} h={32} label="검증: O(log T)" sub="증명 힌트로 빠르게 확인" color={C.app} />
  </g>);
}
