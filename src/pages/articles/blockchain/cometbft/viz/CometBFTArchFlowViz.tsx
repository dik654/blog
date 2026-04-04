import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { app: '#6366f1', abci: '#ec4899', cons: '#10b981', p2p: '#f59e0b' };

const STEPS = [
  { label: 'P2P Layer — MConnection', body: 'TCP 연결 위 다중 채널로 TX/블록을 전파합니다.' },
  { label: 'Consensus — 합의 엔진', body: 'Propose → Prevote → Precommit → Commit 라운드입니다.' },
  { label: 'ABCI — 앱 인터페이스', body: '4개 연결로 합의 엔진과 앱을 연결합니다.' },
  { label: 'TX 상승 흐름', body: 'TX가 P2P → 합의 → ABCI → 앱 순서로 처리됩니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.p2p}>p2p.MConnection.Start() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.p2p}>Line 1: go c.sendRoutine()  // 송신 goroutine</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.p2p}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: go c.recvRoutine()  // 수신 goroutine
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 채널 우선순위: Consensus {'>'} Evidence {'>'} Mempool {'>'} BlockSync
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={340} y={92} w={120} h={22} label="PacketMsg" sub="채널별 분리" color={C.p2p} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.cons}>cs.enterPropose() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.cons}>Line 1: if cs.isProposer() {'{'} cs.decideProposal(height, round) {'}'}</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.cons}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cs.enterPrevote(height, round)  // 타이머 시작
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // +2/3 prevote → enterPrecommit → +2/3 precommit → enterCommit
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={340} y={92} w={120} h={22} label="즉시 최종성" sub="포크 없음" color={C.cons} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.abci}>proxyApp — 4개 ABCI 연결</text>
    <text x={20} y={44} fontSize={10} fill={C.abci}>Line 1: conns.consensus = newConn(appAddr)  // 블록 실행</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.abci}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: conns.mempool = newConn(appAddr)  // CheckTx
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.abci}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: conns.snapshot = newConn(appAddr)  // 상태 동기화
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: conns.query = newConn(appAddr)  // 읽기 전용 쿼리
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.cons}>TX 수신 → 앱 실행 흐름</text>
    <text x={20} y={44} fontSize={10} fill={C.p2p}>Line 1: p2p.Receive(chID, peerID, msgBytes)  // P2P 수신</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.cons}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cs.addProposalBlockPart(msg)  // 합의 블록 조립
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.abci}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: proxyApp.FinalizeBlock(req)  // ABCI 앱 실행
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill={C.app}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: app.runTx(tx)  // 비즈니스 로직 상태 전이
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function CometBFTArchFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
