import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './DBLayerVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      MDBX 테이블 레이아웃
    </text>
    <text x={20} y={42} fontSize={10} fill={C.header}>
      Line 1: tables! {'{'} Headers, Bodies, TX, Receipts,
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     PlainAccountState, PlainStorageState,
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.cursor}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:     AccountsTrie, StoragesTrie,
    </motion.text>
    <motion.text x={20} y={90} fontSize={10} fill={C.static}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // Key/Value 타입 안전하게 선언
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      tables! 매크로 — 컴파일 시 타입 검사
    </text>
    <text x={20} y={42} fontSize={10} fill={C.header}>
      Line 1: Headers: BlockNumber =&gt; Header
    </text>
    <text x={350} y={42} fontSize={10} fill="var(--muted-foreground)">// 19M → Header</text>
    <motion.text x={20} y={58} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: PlainAccountState: Address =&gt; Account
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      잘못된 타입 → 컴파일 에러 (Geth는 런타임 에러)
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Cursor — seek → walk_range 순차 순회
    </text>
    <text x={20} y={42} fontSize={10} fill={C.state}>
      Line 1: let cursor = tx.cursor(PlainAccountState)?
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cursor.seek_exact(0xd8dA..)?  // O(log n)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.state}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: cursor.walk_range(start..end)?  // 리프 연속 읽기
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      StaticFile 경계 — finalized 이전은 flat file
    </text>
    <text x={20} y={42} fontSize={10} fill={C.static}>
      Line 1: // finalized 경계: #18,999,968
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.static}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: StaticFiles: #0 ~ #18,999,967 (flat file)
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.header}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: MDBX: #18,999,968 ~ latest (B+tree)
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      DB 크기 감소 → B+tree 얕아짐 → 조회 성능 향상
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function DBLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
