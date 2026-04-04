import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './OrderingDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      TransactionOrdering::priority() trait
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pool}>
      Line 1: trait TransactionOrdering {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.pool}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2:     type Priority: Ord + Clone
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.pool}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3:     fn priority(tx, base_fee) -&gt; Self::Priority
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.pool}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 4: {'}'}  // PriorityValue로 정렬 키 반환
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      CoinbaseTipOrdering (기본 구현)
    </text>
    <text x={20} y={42} fontSize={10} fill={C.tip}>
      Line 1: fn priority(tx, base_fee) -&gt; U256 {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.tip}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     tx.effective_tip_per_gas(base_fee)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.tip}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'}  // TX₀ tip=5 &gt; TX₁ tip=3 &gt; TX₂ tip=1
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      PayloadBuilder가 best_txs()로 이 순서대로 TX 선택
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      커스텀 정렬 — trait 교체
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pool}>
      Line 1: // 기본: CoinbaseTipOrdering (effective_tip)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.tip}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // 커스텀: MevBundleOrdering (MEV 수익 기반)
    </motion.text>
    <motion.text x={20} y={76} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      trait 구현체 교체만으로 정렬 기준 변경 (Geth는 하드코딩)
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function OrderingDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
