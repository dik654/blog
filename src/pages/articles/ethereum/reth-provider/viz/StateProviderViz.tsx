import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { C, STEPS, STEP_REFS } from './StateProviderVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      StateProvider trait — 3개 메서드
    </text>
    <text x={20} y={42} fontSize={10} fill={C.trait}>
      Line 1: fn account(addr) -&gt; Option&lt;Account&gt;
    </text>
    <text x={320} y={42} fontSize={10} fill="var(--muted-foreground)">// 0xd8dA → bal,nonce</text>
    <motion.text x={20} y={58} fontSize={10} fill={C.trait}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: fn storage(addr, key) -&gt; Option&lt;U256&gt;
    </motion.text>
    <text x={320} y={58} fontSize={10} fill="var(--muted-foreground)">// (USDT,3) → 42</text>
    <motion.text x={20} y={74} fontSize={10} fill={C.trait}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: fn bytecode_by_hash(h) -&gt; Option&lt;Bytecode&gt;
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      LatestStateProviderRef 구현
    </text>
    <text x={20} y={42} fontSize={10} fill={C.latest}>
      Line 1: fn account(addr) {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.latest}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     self.tx.get(PlainAccountState, addr)?
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.latest}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'}
    </motion.text>
    <motion.text x={20} y={92} fontSize={10} fill={C.mdbx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Line 4: // MDBX tx + StaticFile 조합 — DupSort 키 활용
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      구현체 교체 — 동일 인터페이스
    </text>
    <text x={20} y={42} fontSize={10} fill={C.latest}>
      Line 1: impl StateProvider for LatestStateProviderRef  // 실 DB
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.mdbx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: impl StateProvider for HistoricalStateProvider  // ChangeSet
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.static}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: impl StateProvider for MockProvider  // 테스트용
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      모두 StateProvider trait 구현 → 동일 인터페이스
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function StateProviderViz({ onOpenCode }: {
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
