import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './EvmConfigDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      EvmConfig trait — 체인별 환경 설정 교체
    </text>
    <text x={20} y={44} fontSize={10} fill={C.header}>
      Line 1: trait EvmConfig {'{'}
    </text>
    <motion.text x={40} y={60} fontSize={10} fill={C.header}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2:     fn fill_block_env(&amp;self, env, header)
    </motion.text>
    <motion.text x={40} y={76} fontSize={10} fill={C.header}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3:     fn fill_tx_env(env, tx, sender)
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.header}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 4: {'}'}  // Mainnet / Optimism 구현체 교체
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      fill_block_env() 내부
    </text>
    <text x={20} y={42} fontSize={10} fill={C.block}>
      Line 1: env.number = header.number  // 19,000,001
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: env.coinbase = header.beneficiary  // 0x95222..5CE
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: env.timestamp = header.timestamp  // 1_706_745_600
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: env.basefee = header.base_fee  // 22.3 gwei
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={370} y={80} w={90} h={26} label="BlockEnv" sub="설정 완료" color={C.block} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      fill_tx_env() 내부
    </text>
    <text x={20} y={42} fontSize={10} fill={C.tx}>
      Line 1: env.caller = sender  // 0xd8dA..6045
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.tx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: env.gas_limit = tx.gas_limit()  // 21,000
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.tx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: env.value = tx.value()  // 1.5 ETH
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.tx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: env.nonce = Some(tx.nonce())  // 413
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={370} y={80} w={90} h={26} label="TxEnv" sub="설정 완료" color={C.tx} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      revm Evm 생성 + 실행
    </text>
    <text x={20} y={44} fontSize={10} fill={C.revm}>
      Line 1: let mut evm = Evm::builder()
    </text>
    <motion.text x={40} y={60} fontSize={10} fill={C.revm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2:     .with_db(state_provider)
    </motion.text>
    <motion.text x={40} y={76} fontSize={10} fill={C.revm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3:     .with_env(block_env + tx_env).build()
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill={C.revm} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Line 4: let result = evm.transact()?  // TX 실행 시작
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function EvmConfigDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
