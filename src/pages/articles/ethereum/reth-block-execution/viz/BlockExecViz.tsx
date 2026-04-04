import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './BlockExecVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      블록 실행이 분리되는 이유
    </text>
    <text x={20} y={44} fontSize={10} fill={C.block}>
      Line 1: // CPU 집약: EVM 실행 (revm)
    </text>
    <motion.text x={20} y={60} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // I/O 집약: DB 기록 (MDBX)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      분리 → 배치 처리 + trait 기반 구현체 교체 가능
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      블록 → TX 추출 → revm 실행
    </text>
    <text x={20} y={42} fontSize={10} fill={C.block}>
      Line 1: let block = provider.sealed_block(19_000_001)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.tx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: let senders = block.senders()  // ecrecover x164
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.revm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: evm_config.fill_block_env(&amp;mut env, &amp;header)
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.revm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 4: evm.transact(tx)?  // 164 TXs × revm
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      상태 변경 → BundleState 수집
    </text>
    <text x={20} y={42} fontSize={10} fill={C.revm}>
      Line 1: let result = evm.transact(tx)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: bundle.apply_transitions(result.state)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // balance, storage, bytecode 변경 누적
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={340} y={72} w={120} h={26}
        label="BundleState" sub="412 accounts" color={C.state} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      BundleState → DB 일괄 기록
    </text>
    <text x={20} y={42} fontSize={10} fill={C.state}>
      Line 1: let bundle = executor.finalize()
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: provider.write_to_storage(bundle)?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // MDBX 배치 커밋 — 1,208 changes
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={340} y={72} w={120} h={26}
        label="MDBX" sub="배치 커밋" color={C.state} />
    </motion.g>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      전체 흐름 요약
    </text>
    <text x={20} y={42} fontSize={10} fill={C.block}>
      Line 1: sealed_block(N)?  // 블록 로드
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.tx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: ecrecover x164  // TX 서명자 복구
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.revm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: evm.transact(tx)?  // EVM 실행
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: bundle.apply_transitions()  // 상태 수집
    </motion.text>
    <motion.text x={20} y={106} fontSize={10} fill={C.state} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 5: write_to_storage(bundle)?  // DB 기록
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function BlockExecViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
