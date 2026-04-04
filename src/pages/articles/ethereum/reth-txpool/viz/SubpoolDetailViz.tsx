import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './SubpoolDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      add_transaction() 3단계
    </text>
    <text x={20} y={42} fontSize={10} fill="#6366f1">
      Line 1: let valid = self.validator.validate(&amp;tx)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: self.pool.add_transaction(valid)  // 서브풀 배치
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.pending}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: self.notify_listeners(tx_hash)  // 이벤트 알림
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      validate → add → notify — trait 기반 각 단계 교체 가능
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Pending Pool — 즉시 실행 가능
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pending}>
      Line 1: if tx.nonce == account.nonce  // nonce 연속
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.pending}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:    &amp;&amp; tx.max_fee &gt;= current_base_fee  // fee 충족
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.pending}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'{'} pending_pool.insert(tx) {'}'}  // best_txs() 대상
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      PayloadBuilder가 best_txs()로 여기서 TX 선택
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      BaseFee / Queued 서브풀
    </text>
    <text x={20} y={42} fontSize={10} fill={C.basefee}>
      Line 1: // BaseFee: max_fee &lt; base_fee → fee 부족 대기
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.queued}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // Queued: nonce &gt; account.nonce → nonce gap 대기
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill={C.pending}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      Line 3: // 조건 충족 시 → Pending으로 승격
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      on_canonical_state_change() 내부
    </text>
    <text x={20} y={42} fontSize={10} fill={C.ok}>
      Line 1: fn on_canonical_state_change(update) {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     self.update_base_fee(update.base_fee)
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     self.promote_and_demote()  // 서브풀 간 이동
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4:     self.discard_worst()  // 한도 초과 TX 퇴출
    </motion.text>
    <motion.text x={20} y={106} fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 5: {'}'}
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function SubpoolDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
