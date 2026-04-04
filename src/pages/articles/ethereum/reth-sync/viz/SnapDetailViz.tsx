import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './SnapDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      GetAccountRange — 해시 범위 요청
    </text>
    <text x={20} y={42} fontSize={10} fill={C.range}>
      Line 1: let req = GetAccountRange {'{'} start: 0x0000.., end: 0x0FFF.. {'}'}
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.range}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let resp = peer.request(req).await?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.range}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 응답당 ~1MB — 전체 ~250M 계정
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      해시 공간 [start..end] 범위를 피어에 요청
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Merkle Proof 검증
    </text>
    <text x={20} y={42} fontSize={10} fill={C.proof}>
      Line 1: let root = state_root_from_header(block_num)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.proof}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: verify_merkle_proof(resp.accounts, resp.proof, root)?
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      proof 불일치 → 응답 거부 (악의적 피어 차단)
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      GetStorageRanges — 스토리지 다운로드
    </text>
    <text x={20} y={42} fontSize={10} fill={C.store}>
      Line 1: for account in accounts_with_storage {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.store}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     let slots = peer.get_storage_ranges(account)?
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.proof}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     verify_merkle_proof(slots, proof, root)?
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.store}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // 총 ~1.5B 슬롯
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      DB 기록 → 다음 범위 진행
    </text>
    <text x={20} y={42} fontSize={10} fill={C.db}>
      Line 1: provider.write_accounts(verified_accounts)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.db}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: provider.write_storage(verified_slots)?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.next}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: start = resp.last_hash + 1  // 다음 범위로
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      전체 해시 공간 0x0000..0xFFFF 커버할 때까지 반복
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function SnapDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
