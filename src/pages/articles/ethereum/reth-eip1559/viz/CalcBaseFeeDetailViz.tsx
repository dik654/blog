import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './CalcBaseFeeDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      gas_target 계산
    </text>
    <text x={20} y={42} fontSize={10} fill={C.target}>
      Line 1: let gas_target = gas_limit / ELASTICITY  // 30M / 2
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.target}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 2: gas_target = 15_000_000  // target은 limit의 절반
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={340} y={60} w={120} h={26}
        label="target = 15M" sub="gas_limit의 50%" color={C.target} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      gas_used == target → 유지
    </text>
    <text x={20} y={42} fontSize={10} fill={C.target}>
      Line 1: if gas_used == gas_target {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.target}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2:     return parent_base_fee  // 15 gwei 그대로
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.target}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: {'}'}
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      사용량이 target과 정확히 일치하면 base fee 변동 없음
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      gas_used &gt; target → 인상
    </text>
    <text x={20} y={42} fontSize={10} fill={C.up}>
      Line 1: let gas_used_delta = gas_used - gas_target
    </text>
    <text x={350} y={42} fontSize={10} fill="var(--muted-foreground)">// 25M - 15M = 10M</text>
    <motion.text x={20} y={58} fontSize={10} fill={C.up}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: let delta = base_fee * gas_used_delta / gas_target / 8
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.calc}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: let delta = max(delta as u128, 1)  // 최소 1 wei
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.up} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 4: return 15 + 1.25 = 16.25 gwei → 인상
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      gas_used &lt; target → 인하
    </text>
    <text x={20} y={42} fontSize={10} fill={C.down}>
      Line 1: let gas_used_delta = gas_target - gas_used
    </text>
    <text x={350} y={42} fontSize={10} fill="var(--muted-foreground)">// 15M - 8M = 7M</text>
    <motion.text x={20} y={58} fontSize={10} fill={C.down}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: let delta = base_fee * gas_used_delta / gas_target / 8
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.calc}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: base_fee.saturating_sub(delta)  // 0 미만 방지
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.down} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 4: return 15 - 0.875 = 14.125 gwei → 인하
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function CalcBaseFeeDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
