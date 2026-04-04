import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './PayloadVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      CL → ForkchoiceUpdated
    </text>
    <text x={20} y={42} fontSize={10} fill={C.cl}>
      Line 1: // Beacon Node가 새 슬롯 제안자로 선정
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.cl}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: engine_api.forkchoice_updated(
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.cl}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      Line 3:   head_hash, safe_hash, finalized_hash, attrs)
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      EL: canonical 갱신 + 빌드 시작
    </text>
    <text x={20} y={42} fontSize={10} fill={C.engine}>
      Line 1: find_canonical_header(head_hash)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.engine}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: update_canonical_chain(head)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.builder}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: let id = builder.send_new_payload(head, attrs)
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.engine}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 4: return PayloadStatus {'{'} payload_id: id {'}'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      PayloadBuilder: TX 선택
    </text>
    <text x={20} y={42} fontSize={10} fill={C.builder}>
      Line 1: let txs = pool.best_transactions_with_attributes()
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.builder}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // effective_tip 기준 정렬, ~4,200 pending 중
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.builder}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // base_fee: 14.2 Gwei 이상만 대상
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      TX 실행 + 가스 추적
    </text>
    <text x={20} y={42} fontSize={10} fill={C.builder}>
      Line 1: for tx in txs {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.builder}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:   evm.transact(&amp;tx)?  // revm 실행
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.builder}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:   cumulative_gas += result.gas_used
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.builder}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // 29.8M / 30M gas
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      GetPayload → 완성된 블록 반환
    </text>
    <text x={20} y={42} fontSize={10} fill={C.payload}>
      Line 1: let payload = BuiltPayload {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.payload}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:   txs: 182, block_value: 0.0847 ETH
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.payload}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'};
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.payload}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: return (ExecutionPayload, BlobsBundle, 0.0847)
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={340} y={96} w={120} h={26}
        label="Payload" sub="CL이 MEV와 비교" color={C.payload} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function PayloadViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
