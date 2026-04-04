import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './BaseFeeVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      동적 base fee — 가격 자동 조정
    </text>
    <text x={20} y={42} fontSize={10} fill={C.target}>
      Line 1: // first-price auction의 가격 예측 불가 문제
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.target}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // 프로토콜이 base_fee를 자동 조정
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.target}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // 사용자는 max_fee만 설정하면 됨
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      gas_target = gas_limit / elasticity
    </text>
    <text x={20} y={42} fontSize={10} fill={C.target}>
      Line 1: let gas_target = 30_000_000 / 2  // 15M
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.target}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // gas_used가 target에 수렴하도록 base_fee 조정
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={340} y={64} w={120} h={26}
        label="target = 15M" sub="limit의 절반" color={C.target} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      gas_used &gt; target → base fee 인상
    </text>
    <text x={20} y={42} fontSize={10} fill={C.up}>
      Line 1: let delta = base_fee * (used - target) / target / 8
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.up}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // delta = 15 * 10M / 15M / 8 = 1.25 gwei
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.up}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: let delta = max(delta, 1)  // 최소 1 wei 보장
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.up} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      결과: 15 + 1.25 = 16.25 gwei (16.9 gwei 근처)
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      gas_used &lt; target → base fee 인하
    </text>
    <text x={20} y={42} fontSize={10} fill={C.down}>
      Line 1: let delta = base_fee * (target - used) / target / 8
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.down}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // delta = 15 * 7M / 15M / 8 = 0.875 gwei
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.down}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: base_fee.saturating_sub(delta)  // 0 미만 방지
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.down} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      결과: 15 - 0.875 = 14.125 gwei (13.2 gwei 근처)
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Reth vs Geth: u128 vs big.Int
    </text>
    <text x={20} y={42} fontSize={10} fill={C.fee}>
      Line 1: // Reth: u128 (스택 할당, 16 bytes)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // Geth: big.Int (힙 할당 + GC 부담)
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill={C.down}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // Reth → 힙 할당 0, GC 부담 0
    </motion.text>
    <motion.text x={20} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      대량 동기화 시 base_fee 연산이 수억 번 → 성능 차이 누적
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function BaseFeeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
