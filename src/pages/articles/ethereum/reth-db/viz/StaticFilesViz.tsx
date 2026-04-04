import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS, STEP_REFS } from './StaticFilesVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      StaticFileProvider — 고대 데이터 분리
    </text>
    <text x={20} y={42} fontSize={10} fill={C.mdbx}>
      Line 1: // MDBX: #18,999,968 ~ latest (활성 데이터)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.static}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // StaticFile: #0 ~ #18,999,967 (불변 데이터)
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      finalized 이전 불변 데이터를 flat file로 아카이브 (Geth Freezer)
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      3가지 세그먼트: Headers / TX / Receipts
    </text>
    <text x={20} y={42} fontSize={10} fill={C.seg}>
      Line 1: Headers: ~28 GB  // max #18,999,967
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.seg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: Transactions: ~180 GB  // max #18,999,967
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.seg}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: Receipts: ~160 GB  // max #18,999,967
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      블록 번호 = 파일 오프셋 → O(1) 직접 접근
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      분리의 이점
    </text>
    <text x={20} y={42} fontSize={10} fill={C.benefit}>
      Line 1: // DB 크기: ~2TB → ~40GB (MDBX만)
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.benefit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // B+tree 깊이: 4 → 2 (빠른 조회)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.benefit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 순차 읽기: block_num * 508B → O(1) 오프셋
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.benefit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // pruning: 세그먼트별 독립 관리 가능
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function StaticFilesViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && STEP_REFS[step] !== undefined && (
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
