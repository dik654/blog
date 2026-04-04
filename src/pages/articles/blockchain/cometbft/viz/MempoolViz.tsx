import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { tx: '#6366f1', check: '#10b981', pool: '#8b5cf6', recheck: '#ef4444' };

const STEPS = [
  { label: 'TX 수신 — CheckTx 진입', body: '클라이언트가 TX를 전송하면 CheckTx로 진입합니다.' },
  { label: 'CheckTx — AnteHandler', body: 'AnteHandler가 서명, nonce, fee를 확인합니다.' },
  { label: '멤풀 저장 + Gossip', body: '유효한 TX가 CList에 추가되고 피어에게 전파됩니다.' },
  { label: 'Recheck — 커밋 후 재검증', body: '새 블록 커밋 시 남은 TX를 재검증합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.tx}>mempool.CheckTx() 진입</text>
    <text x={20} y={44} fontSize={10} fill={C.tx}>Line 1: txSize := len(tx)  // 바이트 크기 확인</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.tx}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: if txSize {'>'} mem.config.MaxTxBytes {'{'} return ErrTxTooLarge {'}'}
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: if mem.Size() {'>'}= mem.config.Size {'{'} return ErrMempoolIsFull {'}'}
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={110} h={22} label="기본 1MB" sub="MaxTxBytes" color={C.tx} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.check}>AnteHandler 검증 체인</text>
    <text x={20} y={44} fontSize={10} fill={C.check}>Line 1: SetUpContextDecorator(gasLimit)  // 가스 미터 설정</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: SigVerificationDecorator(pubKey, sig)  // 서명 검증
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: DeductFeeDecorator(fee)  // 수수료 차감 가능 여부
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: IncrementSequenceDecorator()  // nonce 순서 확인
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.pool}>mem.addTx() + broadcastTxRoutine()</text>
    <text x={20} y={44} fontSize={10} fill={C.pool}>Line 1: mem.txs.PushBack(memTx)  // CList O(1) 삽입</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.pool}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: mem.notifyTxsAvailable()  // 블록 생성 트리거
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: peer.Send(MempoolChannel, txBytes)  // 모든 피어에게 push
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={110} h={22} label="Gossip push" sub="피어별 goroutine" color={C.pool} />
    </motion.g>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.recheck}>mem.recheckTxs() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.recheck}>Line 1: mem.recheckCursor = mem.txs.Front()</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.recheck}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: proxyApp.CheckTxAsync(req)  // 새 상태 기준 비동기 검증
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.recheck}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: if res.Code != 0 {'{'} mem.removeTx(tx) {'}'}  // 무효 TX 제거
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: // Commit Lock 해제 후 recheckTxs → 멤풀 정합성 유지
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function MempoolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
