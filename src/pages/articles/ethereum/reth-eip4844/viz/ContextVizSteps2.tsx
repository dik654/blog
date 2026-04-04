import { motion } from 'framer-motion';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: KZG */
export function StepKzg() {
  return (<g>
    <DataBox x={20} y={22} w={70} h={24} label="Blob" color={C.blob} />
    <motion.line x1={95} y1={34} x2={130} y2={34} stroke={C.kzg} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <ActionBox x={135} y={15} w={100} h={38} label="KZG Commit"
      sub="다항식 커밋먼트" color={C.kzg} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <motion.line x1={240} y1={34} x2={270} y2={34} stroke={C.ok} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <DataBox x={275} y={22} w={100} h={24} label="versioned_hash" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={75} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      TX 본체에 hash 포함 → blob ↔ TX 매칭
    </motion.text>
  </g>);
}

/* Step 4: Blob Gas */
export function StepBlobGas() {
  return (<g>
    <DataBox x={20} y={22} w={100} h={24} label="excess_blob_gas" color={C.gas} />
    <motion.line x1={125} y1={34} x2={160} y2={34} stroke={C.gas} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <ActionBox x={165} y={15} w={120} h={38} label="fake_exponential()"
      sub="Taylor 급수 (정수)" color={C.gas} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <motion.line x1={290} y1={34} x2={320} y2={34} stroke={C.kzg} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
      <DataBox x={325} y={22} w={80} h={24} label="blob_fee" color={C.kzg} />
    </motion.g>
    <motion.text x={210} y={75} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      target 초과 시 가격 지수적 급등
    </motion.text>
  </g>);
}
