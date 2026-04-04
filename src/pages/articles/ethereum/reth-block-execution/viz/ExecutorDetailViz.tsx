import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './ExecutorDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      execute_and_verify_one() 내부
    </text>
    <text x={20} y={42} fontSize={10} fill={C.trait}>
      Line 1: let block = sealed_block(19_000_001)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.trait}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: for tx in block.body.transactions {'{'} // 164 TXs
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3:     evm.transact(tx)?  // revm 실행
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.trait}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 4: {'}'}  // Output: 412 account changes
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={320} y={70} w={90} h={26} label="Output" sub="412 changes" color={C.state} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      BatchExecutor — 여러 블록 누적 실행
    </text>
    <text x={20} y={42} fontSize={10} fill={C.batch}>
      Line 1: let executor = BatchExecutor::new(state_provider)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.batch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: for block_num in 19_000_001..=19_000_003 {'{'}
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.trait}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3:     self.execute_and_verify_one(&amp;block)?
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.batch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 4: {'}'}  // BundleState에 1,208 changes 누적
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      BundleState 내부 필드
    </text>
    <text x={20} y={42} fontSize={10} fill={C.state}>
      Line 1: state: HashMap&lt;Address, BundleAccount&gt;
    </text>
    <text x={350} y={42} fontSize={10} fill="var(--muted-foreground)">// 1,208 accounts</text>
    <motion.text x={20} y={58} fontSize={10} fill={C.batch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: contracts: HashMap&lt;B256, Bytecode&gt;
    </motion.text>
    <text x={350} y={58} fontSize={10} fill="var(--muted-foreground)">// 3 deploys</text>
    <motion.text x={20} y={74} fontSize={10} fill={C.db}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: reverts: Vec&lt;Vec&lt;(Address, AccountRevert)&gt;&gt;
    </motion.text>
    <text x={350} y={74} fontSize={10} fill="var(--muted-foreground)">// 3 blocks</text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      reorg 시 reverts를 역순 적용하여 상태 복원
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      finalize() → DB 기록
    </text>
    <text x={20} y={42} fontSize={10} fill={C.batch}>
      Line 1: let bundle = executor.finalize()  // self 소비
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: bundle.state.len() == 1208  // BundleState 반환
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.db}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: provider.write_to_storage(bundle)?  // MDBX 일괄 기록
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={320} y={82} w={90} h={26} label="MDBX" sub="일괄 커밋" color={C.db} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ExecutorDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
