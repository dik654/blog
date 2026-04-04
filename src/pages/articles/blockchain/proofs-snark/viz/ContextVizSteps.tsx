import { motion } from 'framer-motion';
import { ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 왜 SNARK인가 */
export function StepWhy() {
  return (<g>
    <ActionBox x={15} y={22} w={120} h={48} label="PoRep/PoSt 증명" sub="~GB 크기 데이터" color={C.err} />
    <motion.text x={155} y={48} fontSize={14} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>→</motion.text>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={175} y={22} w={110} h={48} label="Groth16 SNARK" sub="192B 증명" color={C.groth} />
    </motion.g>
    <motion.text x={305} y={48} fontSize={14} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>→</motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <ActionBox x={320} y={22} w={85} h={48} label="온체인 검증" sub="~ms" color={C.msm} />
    </motion.g>
  </g>);
}

/* Step 1: Groth16 파이프라인 */
export function StepPipeline() {
  const stages = [
    { label: 'R1CS', sub: '회로 합성', color: C.groth },
    { label: 'FFT/NTT', sub: '다항식 평가', color: C.gpu },
    { label: 'MSM', sub: '점 곱셈', color: C.msm },
    { label: 'Proof', sub: 'A,B,C', color: C.supra },
  ];
  return (<g>
    <defs><marker id="sn" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.groth} /></marker></defs>
    {stages.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ModuleBox x={8 + i * 103} y={25} w={88} h={48} label={s.label} sub={s.sub} color={s.color} />
        {i < 3 && (
          <motion.line x1={96 + i * 103} y1={49} x2={111 + i * 103} y2={49}
            stroke={C.groth} strokeWidth={1} markerEnd="url(#sn)"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.12 + 0.2, duration: 0.2 }} />
        )}
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      {'검증: e(A,B) = e(α,β) · e(inputs,γ) · e(C,δ)'}
    </text>
  </g>);
}
