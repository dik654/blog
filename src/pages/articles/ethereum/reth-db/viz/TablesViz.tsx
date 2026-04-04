import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { C, STEPS, STEP_REFS } from './TablesVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      tables! 매크로 — 전체 스키마 선언
    </text>
    <text x={20} y={42} fontSize={10} fill={C.block}>
      Line 1: tables! {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2:   Headers, Bodies, TX, Receipts,  // 블록
    </motion.text>
    <motion.text x={40} y={74} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3:   PlainAccountState, PlainStorageState,  // 상태
    </motion.text>
    <motion.text x={40} y={90} fontSize={10} fill={C.trie}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 4:   AccountsTrie, StoragesTrie,  // 트라이
    </motion.text>
    <motion.text x={40} y={106} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 5:   AccountChangeSets, StorageChangeSets  // 변경
    </motion.text>
    <motion.text x={20} y={122} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Line 6: {'}'}  // Enum + trait 자동 생성
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      블록 데이터 테이블 (4개)
    </text>
    <text x={20} y={42} fontSize={10} fill={C.block}>
      Line 1: Headers: BlockNumber =&gt; Header
    </text>
    <text x={320} y={42} fontSize={10} fill="var(--muted-foreground)">// 19M → Header</text>
    <motion.text x={20} y={58} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2: BlockBodies: BlockNumber =&gt; Body
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 3: Transactions: TxNumber =&gt; SignedTx
    </motion.text>
    <text x={320} y={74} fontSize={10} fill="var(--muted-foreground)">// 2.4B →</text>
    <motion.text x={20} y={90} fontSize={10} fill={C.block}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 4: Receipts: TxNumber =&gt; Receipt
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      상태 테이블 — DupSort 활용
    </text>
    <text x={20} y={42} fontSize={10} fill={C.state}>
      Line 1: PlainAccountState: Address =&gt; Account
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: PlainStorageState: Address =&gt; (U256, U256)
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      DupSort: 같은 Address 아래 수천 슬롯을 정렬 저장
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Trie &amp; ChangeSet 테이블
    </text>
    <text x={20} y={42} fontSize={10} fill={C.trie}>
      Line 1: AccountsTrie: Nibbles =&gt; BranchNodeCompact
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.trie}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2: StoragesTrie: B256 =&gt; StorageTrieEntry
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
      Line 3: AccountChangeSets: (Block, Addr) =&gt; before_val
    </motion.text>
    <motion.text x={20} y={94} fontSize={10} fill={C.change}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 4: StorageChangeSets: (Block, Addr) =&gt; (slot, prev)
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function TablesViz({ onOpenCode }: {
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
