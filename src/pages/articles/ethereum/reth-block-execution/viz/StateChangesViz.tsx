import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './StateChangesVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      BundleAccount 구조체 내부
    </text>
    <text x={20} y={42} fontSize={10} fill={C.balance}>
      Line 1: pub info: Option&lt;AccountInfo&gt;  // balance + nonce
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.storage}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: pub storage: HashMap&lt;U256, StorageSlot&gt;
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.deploy}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: pub status: AccountStatus  // Changed | Created | Destroyed
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      revm 실행 후 계정별로 하나씩 생성되어 BundleState.state에 수집
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      잔액/nonce 변경 기록
    </text>
    <text x={20} y={42} fontSize={10} fill={C.balance}>
      Line 1: let info_before = AccountInfo {'{'}
    </text>
    <text x={40} y={56} fontSize={10} fill={C.balance}>
      balance: 10_000_000_000, nonce: 5 {'}'}
    </text>
    <motion.text x={20} y={74} fontSize={10} fill={C.balance}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: let info_after = AccountInfo {'{'}
    </motion.text>
    <motion.text x={40} y={88} fontSize={10} fill={C.balance}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      balance: 8_000_000_000, nonce: 6 {'}'}
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={350} y={68} w={110} h={26} label="info = after" sub="2 ETH 감소" color={C.balance} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      스토리지 + 컨트랙트 변경
    </text>
    <text x={20} y={42} fontSize={10} fill={C.storage}>
      Line 1: // SSTORE 실행
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.storage}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: storage.insert(slot_3, StorageSlot {'{'}
    </motion.text>
    <motion.text x={40} y={72} fontSize={10} fill={C.storage}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
      previous_or_original: 0, present: 7 {'}'})
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.deploy}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // CREATE2 → contracts.insert(code_hash, bytecode)
    </motion.text>
    <motion.text x={20} y={110} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
      storage map과 contracts HashMap에 각각 기록
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      reverts — 블록별 되돌리기 저장
    </text>
    <text x={20} y={42} fontSize={10} fill={C.destroy}>
      Line 1: reverts.push(vec![
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.destroy}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:   (0xd8dA.., AccountRevert {'{'}
    </motion.text>
    <motion.text x={60} y={72} fontSize={10} fill={C.destroy}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      account: Some(info_before), storage: {'{'}slot_3: 0{'}'} {'}'})
    </motion.text>
    <motion.text x={20} y={88} fontSize={10} fill={C.destroy}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 3: ]);  // Block #1, #2, #3 각각 하나씩
    </motion.text>
    <motion.text x={20} y={110} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      reorg 시 reverts를 역순 적용 → 변경 전 상태 복원
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function StateChangesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
