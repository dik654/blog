import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './BuildJobDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      best_transactions_with_attributes() 내부
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pool}>
      Line 1: let iter = pool.best_transactions()
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.pool}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: iter.filter(|tx| tx.max_fee &gt;= base_fee)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.pool}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // effective_tip 내림차순 정렬 이터레이터
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      TX₀ tip=12.4 Gwei → TX₁ tip=8.1 → TX₂ tip=3.2
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      가스 한도 검사 + revm 실행
    </text>
    <text x={20} y={42} fontSize={10} fill={C.gas}>
      Line 1: if cumulative_gas + tx.gas_limit &gt; block_gas_limit {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.gas}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2:     continue  // 해당 TX 건너뜀
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.gas}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      Line 3: {'}'}
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.exec}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Line 4: let result = evm.transact(&amp;tx)?  // revm 실행
    </motion.text>
    <motion.text x={20} y={108} fontSize={10} fill={C.exec}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
      Line 5: if result.is_err() {'{'} pool.mark_invalid(tx) {'}'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      누적 + continuous building
    </text>
    <text x={20} y={42} fontSize={10} fill={C.exec}>
      Line 1: executed_txs.push(tx)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.exec}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cumulative_gas += result.gas_used
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.exec}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 19,500,000 / 30,000,000 gas (65%)
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Line 4: // GetPayload 호출 전까지 TX 계속 추가 → 수익 극대화
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      BuiltPayload 반환
    </text>
    <text x={20} y={42} fontSize={10} fill={C.ok}>
      Line 1: let block_value = executed_txs.iter()
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     .map(|tx| tx.effective_tip).sum()  // 0.0847 ETH
    </motion.text>
    <motion.text x={20} y={76} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: BuiltPayload {'{'} block, bundle_state, block_value {'}'}
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={340} y={88} w={120} h={26}
        label="0.0847 ETH" sub="CL이 MEV와 비교" color={C.ok} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function BuildJobDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
