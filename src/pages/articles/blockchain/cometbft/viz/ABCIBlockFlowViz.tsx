import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { prep: '#10b981', proc: '#f59e0b', fin: '#8b5cf6', commit: '#ec4899', core: '#6366f1' };

const STEPS = [
  { label: 'PrepareProposal 내부', body: '리더가 멤풀 TX를 선별하여 블록 제안을 구성합니다.' },
  { label: 'ProcessProposal 내부', body: '검증자가 제안 블록의 유효성을 검증합니다.' },
  { label: 'FinalizeBlock 내부', body: 'ABCI 2.0 통합 콜백 — 상태 전이를 수행합니다.' },
  { label: 'Commit 내부', body: '상태를 디스크에 확정하고 app_hash를 반환합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.prep}>PrepareProposal() 내부</text>
    <text x={20} y={42} fontSize={10} fill={C.prep}>Line 1: txs := env.Mempool.ReapMaxBytesMaxGas(maxBytes, maxGas)</text>
    <motion.text x={20} y={60} fontSize={10} fill={C.prep}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: resp := app.PrepareProposal(req)  // 앱이 TX 순서 재정렬
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: proposal.Txs = resp.Txs  // 리더가 최종 블록 구성
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={340} y={68} w={120} h={24} label="BlockProposal" sub="txs + header" color={C.prep} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.proc}>ProcessProposal() 내부</text>
    <text x={20} y={42} fontSize={10} fill={C.proc}>Line 1: resp := app.ProcessProposal(req)  // 앱에 유효성 위임</text>
    <motion.text x={20} y={60} fontSize={10} fill={C.proc}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: if resp.Status == REJECT {'{'} return errBlockRejected {'}'}
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // ACCEPT → Prevote 투표 진행, REJECT → nil 투표
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={350} y={68} w={100} h={24} label="ACCEPT" sub="or REJECT" color={C.proc} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.fin}>FinalizeBlock() 내부</text>
    <text x={20} y={42} fontSize={10} fill={C.fin}>Line 1: resp := app.FinalizeBlock(req)  // BeginBlock+DeliverTx+EndBlock 통합</text>
    <motion.text x={20} y={60} fontSize={10} fill={C.fin}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: for _, tx := range req.Txs {'{'} execResult := runTx(tx) {'}'}
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: resp.ValidatorUpdates = getUpdates()  // 밸리데이터 변경 반영
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={350} y={68} w={110} h={24} label="ExecResults[]" sub="TX 결과 배열" color={C.fin} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.commit}>Commit() 내부</text>
    <text x={20} y={42} fontSize={10} fill={C.commit}>Line 1: appHash := multiStore.Commit()  // IAVL 트리 디스크 기록</text>
    <motion.text x={20} y={60} fontSize={10} fill={C.commit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: retainHeight := app.GetRetainHeight()  // 프루닝 높이
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: return CommitResponse{'{'}RetainHeight: retainHeight{'}'}
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={350} y={68} w={110} h={24} label="app_hash" sub="다음 헤더 포함" color={C.commit} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ABCIBlockFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
