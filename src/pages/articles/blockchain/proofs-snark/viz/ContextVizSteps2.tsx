import { motion } from 'framer-motion';
import { ModuleBox, StatusBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: GPU 가속 bellperson */
export function StepGPU() {
  return (<g>
    <ModuleBox x={20} y={20} w={140} h={50} label="bellperson" sub="CUDA / OpenCL" color={C.gpu} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <rect x={190} y={20} width={200} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <rect x={190} y={20} width={200} height={50} rx={6} fill={`${C.msm}06`} />
      <text x={290} y={38} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.msm}>MSM = 70~80% 시간</text>
      <motion.rect x={200} y={48} height={8} rx={4} fill={C.msm}
        initial={{ width: 0 }} animate={{ width: 180 }} transition={{ duration: 1, ease: 'easeOut' }} />
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.gpu}>
      GPU MSM + NTT로 10~50배 속도 향상
    </text>
  </g>);
}

/* Step 3: SupraSeal */
export function StepSupra() {
  const items = [
    { label: 'PC1 SHA256', sub: '캐시 최적화', color: C.groth, p: 0.3 },
    { label: 'PC2 Poseidon', sub: 'GPU 배치', color: C.gpu, p: 0.7 },
    { label: 'C2 MSM', sub: '커널 최적화', color: C.msm, p: 0.9 },
  ];
  return (<g>
    {items.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <StatusBox x={10 + i * 138} y={15} w={120} h={55} label={s.label}
          sub={s.sub} color={s.color} progress={s.p} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.supra} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      {'봉인 전체 시간 ≥ 50% 단축'}
    </motion.text>
  </g>);
}
