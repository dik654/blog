import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: BundleState 메모리 누적 */
export function StepBundle() {
  const slots = ['addr₀: +2 ETH', 'addr₁: slot[3]=7', 'addr₂: 배포'];
  return (<g>
    <ModuleBox x={20} y={20} w={85} h={42} label="revm" sub="실행 엔진" color={C.exec} />
    <motion.line x1={110} y1={41} x2={150} y2={41} stroke={C.ok} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <rect x={155} y={10} width={180} height={78} rx={8} fill="var(--card)" stroke={C.ok} strokeWidth={0.8} />
    <text x={245} y={26} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>BundleState</text>
    {slots.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 + 0.3 }}>
        <text x={170} y={42 + i * 16} fontSize={10} fill="var(--muted-foreground)">{s}</text>
      </motion.g>
    ))}
    <text x={245} y={105} textAnchor="middle" fontSize={10} fill={C.ok}>
      메모리에서 누적 → DB 접근 없이 고속
    </text>
  </g>);
}

/* Step 4: BlockExecutor + BatchExecutor trait */
export function StepTrait() {
  return (<g>
    <ModuleBox x={15} y={18} w={110} h={48} label="BlockExecutor"
      sub="단일 블록 실행" color={C.block} />
    <motion.line x1={130} y1={42} x2={165} y2={42} stroke={C.exec} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={170} y={18} w={110} h={48} label="BatchExecutor"
        sub="누적 → finalize()" color={C.exec} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <motion.line x1={285} y1={42} x2={315} y2={42} stroke={C.ok} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
      <DataBox x={320} y={28} w={90} h={28} label="BundleState" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      finalize() 한 번 → DB 기록 횟수 극적 감소
    </motion.text>
  </g>);
}
