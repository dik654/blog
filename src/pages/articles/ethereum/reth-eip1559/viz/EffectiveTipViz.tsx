import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './EffectiveTipVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      max_fee vs base_fee 검사
    </text>
    <text x={20} y={42} fontSize={10} fill={C.max}>
      Line 1: let max_fee = 20  // gwei
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.base}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let base_fee = 25  // gwei
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: if max_fee &lt; base_fee {'{'} return None {'}'}
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      유효하지 않음 → BaseFee 서브풀에서 대기
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      EIP-1559 TX: effective_tip 계산
    </text>
    <text x={20} y={42} fontSize={10} fill={C.max}>
      Line 1: let max_fee = 30, priority_fee = 2, base_fee = 20
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.tip}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: let tip = min(priority_fee, max_fee - base_fee)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.tip}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // min(2, 30 - 20) = min(2, 10) = 2 gwei
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={340} y={80} w={120} h={26}
        label="tip = 2 gwei" sub="사용자 한도 내" color={C.tip} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Legacy TX: gas_price - base_fee
    </text>
    <text x={20} y={42} fontSize={10} fill={C.max}>
      Line 1: let gas_price = 25  // gwei (Legacy TX)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.base}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let base_fee = 20
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.tip}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let tip = gas_price - base_fee  // 25 - 20 = 5
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={340} y={80} w={120} h={26}
        label="tip = 5 gwei" sub="effective_gas_price()" color={C.tip} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function EffectiveTipViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
