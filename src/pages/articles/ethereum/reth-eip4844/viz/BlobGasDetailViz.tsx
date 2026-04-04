import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './BlobGasDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      calc_excess_blob_gas() 내부
    </text>
    <text x={20} y={42} fontSize={10} fill={C.excess}>
      Line 1: let parent_excess = 262_144
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.excess}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let parent_used = 524_288  // 4 blobs
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.target}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: const TARGET = 393_216  // 3 blobs
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.excess} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Line 4: excess = 262144 + 524288 - 393216 = 393,216
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      calc_blob_fee(excess) 내부
    </text>
    <text x={20} y={42} fontSize={10} fill={C.fee}>
      Line 1: let blob_fee = fake_exponential(
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.fee}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2:     MIN_BLOB_GASPRICE,  // factor = 1
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.fee}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      Line 3:     excess,  // 393,216
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.fee}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Line 4:     BLOB_GASPRICE_UPDATE_FRACTION)  // 3,338,477
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={340} y={96} w={120} h={26}
        label="~1.12 wei" sub="blob 가격" color={C.fee} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      fake_exponential: Taylor 급수 전개
    </text>
    <text x={20} y={42} fontSize={10} fill={C.taylor}>
      Line 1: let mut output = 0, accum = factor * denom
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.taylor}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: for i in 1.. {'{'}
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.taylor}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     output += accum  // 누적
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.taylor}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4:     accum = accum * num / (denom * i)
    </motion.text>
    <motion.text x={20} y={110} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      정수만 사용 → 부동소수점 없이 노드 간 동일 결과 보장
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function BlobGasDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
