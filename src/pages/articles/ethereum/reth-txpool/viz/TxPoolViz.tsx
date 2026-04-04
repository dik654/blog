import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './TxPoolVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      trait 기반 TX 풀 설계
    </text>
    <text x={20} y={42} fontSize={10} fill={C.tx}>
      Line 1: // Validator, Ordering, Pool 각각 trait으로 분리
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.tx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // 구현체만 교체하여 L2 커스텀 가능
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      TX 도착 → 6단계 검증
    </text>
    <text x={20} y={42} fontSize={10} fill={C.valid}>
      Line 1: let result = validator.validate(&amp;tx)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.valid}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // chain_id → ecrecover → nonce
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.valid}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // balance → gas → base_fee 검증
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      TransactionOrdering — 우선순위 결정
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pending}>
      Line 1: let priority = ordering.priority(&amp;tx, base_fee)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.pending}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // CoinbaseTipOrdering → effective_tip 내림차순
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.pending}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // trait 교체로 MEV 정렬도 가능
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      서브풀 배치 — Pending / BaseFee / Queued
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pending}>
      Line 1: Pending: nonce 연속 + fee 충족 → max 10,000 TX
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.basefee}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: BaseFee: fee 부족 → 대기 → max 10,000 TX
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.queued}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: Queued: nonce gap → 대기 → max 10,000 TX
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      새 블록 → 서브풀 승격/강등
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pending}>
      Line 1: on_canonical_state_change(update)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.pending}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // base_fee 변동 → BaseFee ↔ Pending 이동
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.pending}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // nonce gap 해소 → Queued → Pending 승격
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function TxPoolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
