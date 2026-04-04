import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { prep: '#6366f1', proc: '#10b981', fin: '#f59e0b', commit: '#8b5cf6' };

const STEPS = [
  { label: 'PrepareProposal 내부', body: '제안자가 멤풀에서 TX를 선택하고 블록을 구성합니다.' },
  { label: 'ProcessProposal 내부', body: '다른 밸리데이터가 제안 블록의 유효성을 검증합니다.' },
  { label: 'FinalizeBlock 내부', body: '합의된 블록을 앱에서 실행하여 상태를 전이합니다.' },
  { label: 'Commit 내부', body: '상태를 디스크에 영구 저장하고 AppHash를 반환합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.prep}>cs.defaultPrepareProposal() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.prep}>Line 1: txs := cs.mempool.ReapMaxBytesMaxGas(maxDataBytes, -1)</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.prep}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: txl := txs.ToSliceOfBytes()  // [][]byte 변환
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: return &abci.PrepareProposalResponse{'{'}Txs: txl{'}'}
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={100} h={22} label="maxDataBytes" sub="제한 적용" color={C.prep} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.proc}>cs.defaultProcessProposal() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.proc}>Line 1: for _, tx := range req.Txs {'{'}</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.proc}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:   if len(tx) {'>'} maxTxBytes {'{'} return REJECT {'}'}
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'}  return &abci.ProcessProposalResponse{'{'}Status: ACCEPT{'}'}
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.fin}>state.ExecBlock() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.fin}>Line 1: abciResponse := proxyApp.FinalizeBlock(req)</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.fin}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: valUpdates := abciResponse.ValidatorUpdates  // 밸리데이터 변경
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: abciResponse.TxResults[i].Code == 0  // 성공 여부 확인
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={100} h={22} label="TxResults[]" sub="성공/실패" color={C.fin} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.commit}>Handshaker.Commit() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.commit}>Line 1: res := proxyApp.Commit(ctx)  // 앱에 커밋 요청</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.commit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: appHash = res.RetainHeight  // 프루닝 높이 결정
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: state.AppHash = appHash  // 다음 블록 헤더.AppHash에 기록
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={100} h={22} label="AppHash" sub="state에 기록" color={C.commit} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function AppLifecycleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
