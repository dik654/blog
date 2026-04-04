import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C, STEPS } from './LifecycleVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Blob TX 풀 진입 — 검증 흐름
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pool}>
      Line 1: validate_stateless(tx)?  // 포크, 크기, 개수
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: validate_blob_sidecar(sidecar)?  // KZG 검증
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.finalize}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: blob_store.insert(tx_hash, sidecar)  // 저장
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.finalize}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: pool.add_transaction(tx)  // TX 본체만 풀에 유지
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      블록 포함 + BlobStoreCanonTracker
    </text>
    <text x={20} y={42} fontSize={10} fill={C.chain}>
      Line 1: fn add_new_chain_blocks(blocks) {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     for tx in block.txs.filter(|t| t.is_eip4844()) {'{'}
    </motion.text>
    <motion.text x={60} y={74} fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:         tracker.insert(block_num, tx.hash)
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'} {'}'}  // BTreeMap&lt;BlockNumber, Vec&lt;B256&gt;&gt;
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Finalization 정리
    </text>
    <text x={20} y={42} fontSize={10} fill={C.finalize}>
      Line 1: fn on_finalized_block(block_num) {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.finalize}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     let txs = tracker.take_until(block_num)
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.finalize}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     blob_store.delete_all(txs)  // 목록에 추가
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.finalize}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4:     blob_store.cleanup()  // 백그라운드 삭제
    </motion.text>
    <motion.text x={20} y={106} fontSize={10} fill={C.finalize}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 5: {'}'}
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Re-org 재주입
    </text>
    <text x={20} y={42} fontSize={10} fill={C.reorg}>
      Line 1: // 체인 재구성 시 제거된 블록의 blob TX
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.pool}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let blob = tx.take_blob()  // Missing 상태로 전환
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: if blob_store.contains(tx_hash) {'{'}
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4:     // 이미 저장됨 → KZG 재검증 생략
    </motion.text>
    <motion.text x={20} y={106} fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 5: {'}'}  // 풀에 재주입
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function LifecycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
