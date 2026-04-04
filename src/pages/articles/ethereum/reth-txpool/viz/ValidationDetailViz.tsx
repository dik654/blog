import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './ValidationDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      TransactionValidator::validate() 시작
    </text>
    <text x={20} y={42} fontSize={10} fill={C.chain}>
      Line 1: fn validate(tx: &amp;Transaction) -&gt; ValidationResult {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2:     // 6단계 검증 체인
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: {'}'}  // Valid → 풀 삽입 | Invalid → 거부
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      1~3단계: 체인ID → 서명 → nonce
    </text>
    <text x={20} y={42} fontSize={10} fill={C.chain}>
      Line 1: ensure!(tx.chain_id() == 1)  // mainnet
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.sig}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let sender = ecrecover(tx.signature)?  // 0xd8dA..
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.nonce}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: ensure!(tx.nonce &gt;= account.nonce)  // 413 &gt;= 413 OK
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      4~6단계: 잔액 → gas → base_fee
    </text>
    <text x={20} y={42} fontSize={10} fill={C.bal}>
      Line 1: ensure!(balance &gt;= tx.cost())  // 10 ETH &gt;= 1.5 OK
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.gas}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: ensure!(tx.gas_limit &gt;= 21_000)  // intrinsic gas
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.sig}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: ensure!(tx.max_fee &gt;= current_base_fee)
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      검증 결과 반환
    </text>
    <text x={20} y={42} fontSize={10} fill={C.bal}>
      Line 1: return ValidationResult::Valid {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.bal}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     propagate: true,  // 피어에게 전파
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.bal}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'}
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      trait 기반 → L2에서 추가 검증(L1 fee 등) 확장 가능
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ValidationDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
