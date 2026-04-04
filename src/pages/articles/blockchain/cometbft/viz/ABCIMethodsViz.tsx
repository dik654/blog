import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { check: '#6366f1', prep: '#10b981', proc: '#f59e0b', fin: '#8b5cf6', commit: '#ec4899' };

const STEPS = [
  { label: 'CheckTx 내부', body: '멤풀 진입 시 TX 유효성만 확인합니다.' },
  { label: 'PrepareProposal 내부', body: 'ABCI 2.0 — 앱이 블록에 포함할 TX를 선택합니다.' },
  { label: 'ProcessProposal 내부', body: '다른 검증자의 블록 제안을 수락/거절합니다.' },
  { label: 'FinalizeBlock + Commit', body: '상태 전이 후 app_hash를 반환합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.check}>CheckTx() — AnteHandler 실행</text>
    <text x={20} y={42} fontSize={10} fill={C.check}>Line 1: ctx := app.checkState.ctx.WithTxBytes(tx)</text>
    <motion.text x={20} y={60} fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: gasCtx := ctx.WithGasMeter(sdk.NewGasMeter(maxGas))
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: anteCtx, err := anteHandler(gasCtx, decodedTx, false)
    </motion.text>
    <motion.text x={20} y={96} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // simulate=false — 가스/서명/nonce만 검증, 상태 미변경
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.prep}>PrepareProposal() 내부</text>
    <text x={20} y={42} fontSize={10} fill={C.prep}>Line 1: maxBytes := req.MaxTxBytes  // 블록 사이즈 제한</text>
    <motion.text x={20} y={60} fontSize={10} fill={C.prep}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: txs := mempool.ReapMaxBytesMaxGas(maxBytes, -1)
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: return PrepareProposalResponse{'{'}Txs: txs{'}'}  // 앱 재정렬
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={340} y={88} w={110} h={22} label="Txs[]" sub="정렬된 TX" color={C.prep} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.proc}>ProcessProposal() 내부</text>
    <text x={20} y={42} fontSize={10} fill={C.proc}>Line 1: for _, tx := range req.Txs {'{'}</text>
    <motion.text x={20} y={60} fontSize={10} fill={C.proc}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:   if err := validateTx(tx); err != nil {'{'} return REJECT {'}'}
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'}  return ProcessProposalResponse{'{'}Status: ACCEPT{'}'}
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={88} w={100} h={22} label="ACCEPT" sub="→ Prevote" color={C.proc} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.fin}>FinalizeBlock() + Commit() 내부</text>
    <text x={20} y={42} fontSize={10} fill={C.fin}>Line 1: app.deliverTx(tx)  // TX별 상태 전이</text>
    <motion.text x={20} y={60} fontSize={10} fill={C.commit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: commitID := app.cms.Commit()  // IAVL 루트 커밋
    </motion.text>
    <motion.text x={20} y={78} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // commitID.Hash = app_hash → 다음 블록 헤더에 포함
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={88} w={100} h={22} label="app_hash" sub="32 bytes" color={C.commit} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function ABCIMethodsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
