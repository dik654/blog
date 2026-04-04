import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './NotificationDetailVizData';

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      Pipeline → ExExNotification 생성
    </text>
    <text x={20} y={42} fontSize={10} fill={C.pipe}>
      Line 1: let chain = Arc::new(executed_chain)  // 실행 결과
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.mgr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let notif = ExExNotification::ChainCommitted(chain)
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
      Arc 참조 → clone 시 데이터 복사 없이 참조 카운트만 증가
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ExExManager fan-out
    </text>
    <text x={20} y={42} fontSize={10} fill={C.mgr}>
      Line 1: for exex in &amp;self.exexes {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.mgr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2:     exex.sender.send(notif.clone())?  // Arc clone
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.mgr}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
      Line 3: {'}'}  // ExEx₀, ExEx₁, ExEx₂ 각각 독립 채널
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      한 ExEx가 느려도 다른 ExEx에 영향 없음
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ChainCommitted 처리
    </text>
    <text x={20} y={42} fontSize={10} fill={C.commit}>
      Line 1: match notification {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.commit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
      Line 2:   ChainCommitted(chain) =&gt; {'{'}
    </motion.text>
    <motion.text x={60} y={74} fontSize={10} fill={C.commit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
      Line 3:     for block in chain.blocks() {'{'}  // TX/로그 순회
    </motion.text>
    <motion.text x={80} y={90} fontSize={10} fill={C.pipe}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 4:       indexer.index(block)?  // DB 기록
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      ChainReverted 처리 (reorg)
    </text>
    <text x={20} y={42} fontSize={10} fill={C.revert}>
      Line 1:   ChainReverted(chain) =&gt; {'{'}
    </text>
    <motion.text x={40} y={58} fontSize={10} fill={C.revert}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:     indexer.rollback(chain.blocks())?  // 롤백
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.revert}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:   {'}'}
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill={C.commit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      노드와 ExEx가 동시에 reorg 반영 → 일관성 자동 유지
    </motion.text>
  </g>);
}

function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">
      FinishedHeight 보고
    </text>
    <text x={20} y={42} fontSize={10} fill={C.prune}>
      Line 1: exex.send(FinishedHeight(20_100))  // ExEx₀
    </text>
    <motion.text x={20} y={58} fontSize={10} fill={C.prune}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: exex.send(FinishedHeight(20_098))  // ExEx₁
    </motion.text>
    <motion.text x={20} y={74} fontSize={10} fill={C.prune}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let min_height = min(20100, 20098)  // = 20,098
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      min_height 이하 블록 데이터 프루닝 허용
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3, Step4];

export default function NotificationDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
