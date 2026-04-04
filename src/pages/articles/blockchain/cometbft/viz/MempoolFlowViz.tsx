import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { client: '#a855f7', check: '#6366f1', pool: '#10b981', gossip: '#f59e0b', prep: '#8b5cf6', recheck: '#ec4899' };

const STEPS = [
  { label: 'TX 수신 + CheckTx', body: 'RPC로 수신 → AnteHandler로 검증합니다.' },
  { label: '멤풀 저장 + Gossip', body: 'CList에 저장하고 피어에게 전파합니다.' },
  { label: 'PrepareProposal', body: '리더가 멤풀에서 TX를 선택합니다.' },
  { label: 'Re-CheckTx', body: 'Commit 후 남은 TX를 재검증합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.check}>TX 수신 → mempool.CheckTx() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.client}>Line 1: mempool.CheckTx(tx, nil, TxInfo{'{'}SenderID: 0{'}'})  // RPC 수신</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: proxyApp.CheckTxAsync(req)  // AnteHandler: 서명+nonce+fee
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: if resp.Code != 0 {'{'} return ErrRejected {'}'}  // 검증 실패 → 거부
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.pool}>mem.addTx() + broadcastTxRoutine()</text>
    <text x={20} y={44} fontSize={10} fill={C.pool}>Line 1: mem.txs.PushBack(memTx)  // CList O(1) 삽입</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.gossip}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: peer.Send(MempoolChannel, bz)  // 피어별 goroutine 전파
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: mem.txsMap.Store(TxKey(tx), memTx)  // 중복 방지 맵
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.prep}>defaultPrepareProposal() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.prep}>Line 1: txs := mempool.ReapMaxBytesMaxGas(maxBytes, maxGas)</text>
    <motion.text x={20} y={64} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // gas 기준 정렬 후 블록 크기만큼 선택
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.recheck}>mem.recheckTxs() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.recheck}>Line 1: mem.Lock()  // 커밋 중 잠금</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.recheck}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: proxyApp.CheckTxAsync(req)  // 새 상태 기준 재검증
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: if Code != 0 {'{'} mem.removeTx(tx) {'}'}  // 무효 TX 제거
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function MempoolFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
