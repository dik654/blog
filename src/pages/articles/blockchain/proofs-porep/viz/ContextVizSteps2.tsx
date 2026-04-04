import { motion } from 'framer-motion';
import { ActionBox, ModuleBox, StatusBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: PC2 칼럼 해시 */
export function StepPC2() {
  return (<g>
    <rect x={20} y={18} width={12} height={70} rx={3} fill={`${C.pc2}20`} stroke={C.pc2} strokeWidth={0.6} />
    <text x={26} y={56} textAnchor="middle" fontSize={10} fill={C.pc2} transform="rotate(-90,26,56)">칼럼</text>
    {[0, 1, 2].map((i) => (
      <motion.rect key={i} x={20} y={20 + i * 22} width={12} height={18} rx={2}
        fill={C.pc2} opacity={0.15 + i * 0.15}
        initial={{ opacity: 0 }} animate={{ opacity: 0.15 + i * 0.15 }} transition={{ delay: i * 0.15 }} />
    ))}
    <motion.line x1={40} y1={52} x2={100} y2={52} stroke={C.pc2} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={105} y={30} w={120} h={44} label="Poseidon 해시" sub="GPU 가속 가능" color={C.pc2} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <ModuleBox x={270} y={30} w={130} h={44} label="TreeC + comm_r" sub="최종 머클 루트" color={C.commit} />
    </motion.g>
  </g>);
}

/* Step 3: C1/C2 Groth16 */
export function StepCommit() {
  return (<g>
    <ActionBox x={15} y={25} w={115} h={48} label="C1: 챌린지 선택" sub="InteractiveSeed" color={C.chain} />
    <motion.line x1={135} y1={49} x2={175} y2={49} stroke={C.commit} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={180} y={25} w={110} h={48} label="C2: Groth16" sub="GPU MSM 가속" color={C.commit} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <StatusBox x={320} y={25} w={85} h={48} label="검증" sub="1-pairing" color={C.commit} progress={1} />
    </motion.g>
  </g>);
}

/* Step 4: 타임라인 */
export function StepTimeline() {
  const phases = [
    { label: 'PC1', w: 200, color: C.pc1, time: '~3h' },
    { label: 'PC2', w: 50, color: C.pc2, time: '~15m' },
    { label: 'C1/C2', w: 50, color: C.commit, time: '~15m' },
  ];
  let x = 30;
  return (<g>
    {phases.map((p, i) => {
      const cx = x;
      x += p.w + 8;
      return (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={cx} y={35} width={p.w} height={28} rx={5}
            fill={`${p.color}18`} stroke={p.color} strokeWidth={0.8} />
          <text x={cx + p.w / 2} y={47} textAnchor="middle" fontSize={11} fontWeight={600} fill={p.color}>{p.label}</text>
          <text x={cx + p.w / 2} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{p.time}</text>
        </motion.g>
      );
    })}
    <text x={210} y={85} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      합계 ~3.5시간 / 32GiB 섹터
    </text>
  </g>);
}
