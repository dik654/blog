import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS, STEP_REFS } from './BundleStateVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      BundleState 핵심 3개 필드
    </text>
    <text x={20} y={42} fontSize={10} fill={C.state}>
      Line 1: pub state: HashMap&lt;Address, BundleAccount&gt;
    </text>
    <text x={380} y={42} fontSize={10} fill="var(--muted-foreground)">// 3 accounts</text>
    <motion.text x={20} y={58} fontSize={10} fill={C.reverts}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: pub reverts: Vec&lt;Vec&lt;(Address, AccountRevert)&gt;&gt;
    </motion.text>
    <text x={380} y={58} fontSize={10} fill="var(--muted-foreground)">// 2 blocks</text>
    <motion.text x={20} y={74} fontSize={10} fill={C.contracts}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: pub contracts: HashMap&lt;B256, Bytecode&gt;
    </motion.text>
    <text x={380} y={74} fontSize={10} fill="var(--muted-foreground)">// 1 deploy</text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      BundleAccount (0xd8dA..6045)
    </text>
    <text x={20} y={42} fontSize={10} fill={C.account}>
      Line 1: info: AccountInfo {'{'} bal: 30.8 ETH, nonce: 143 {'}'}
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.account}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: original_info: AccountInfo {'{'} bal: 32.1 ETH {'}'}
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.account}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: storage: {'{'} slot[3]: StorageSlot {'{'} prev: 0, cur: 7 {'}'} {'}'}
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.account}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: status: AccountStatus::Changed
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      from_revm() → into_plain_state()
    </text>
    <text x={20} y={42} fontSize={10} fill={C.state}>
      Line 1: let bundle = BundleState::from_revm(revm_output)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // revm 결과 → Reth 타입 변환
    </motion.text>
    <motion.text x={20} y={76} fontSize={10} fill={C.contracts}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: let plain = bundle.into_plain_state()
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.contracts}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
      Line 4: // HashMap → Vec 정렬 → DB 기록 순서에 최적화
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function BundleStateViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && STEP_REFS[step] && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">{STEPS[step].label}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
