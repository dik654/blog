import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { cons: '#6366f1', mem: '#10b981', sync: '#f59e0b', ev: '#ef4444' };

const STEPS = [
  { label: 'MConnection 채널 등록', body: '하나의 TCP 연결 위에 논리 채널을 다중화합니다.' },
  { label: 'Consensus 채널 내부', body: 'Proposal, Vote, Commit 메시지를 전송합니다.' },
  { label: 'Mempool 채널 내부', body: '미확인 TX를 gossip으로 전파합니다.' },
  { label: 'Evidence 채널 내부', body: '이중 서명 등 비잔틴 증거를 전파합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill="var(--foreground)">MConnection.OnStart() — 채널 등록</text>
    <text x={20} y={44} fontSize={10} fill={C.cons}>Line 1: ch := ChannelDescriptor{'{'}ID: 0x20, Priority: 10{'}'}  // Consensus</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.mem}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
      Line 2: ch := ChannelDescriptor{'{'}ID: 0x30, Priority: 5{'}'}  // Mempool
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill={C.sync}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}>
      Line 3: ch := ChannelDescriptor{'{'}ID: 0x40, Priority: 2{'}'}  // BlockSync
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill={C.ev}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}>
      Line 4: ch := ChannelDescriptor{'{'}ID: 0x25, Priority: 7{'}'}  // Evidence
    </motion.text>
    <motion.text x={20} y={125} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}>
      우선순위: Consensus(10) {'>'} Evidence(7) {'>'} Mempool(5) {'>'} BlockSync(2)
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.cons}>Reactor.Receive(0x20) — 합의 메시지</text>
    <text x={20} y={44} fontSize={10} fill={C.cons}>Line 1: msg := MustUnmarshal(bz)  // ProposalMessage | VoteMessage</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.cons}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cs.handleMsg(msgInfo{'{'}Msg: msg, PeerID: src.ID(){'}'})</text>
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 최우선 전송 — 합의 지연 최소화
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={100} h={22} label="Priority 10" sub="최우선" color={C.cons} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.mem}>mempoolReactor.Receive(0x30)</text>
    <text x={20} y={44} fontSize={10} fill={C.mem}>Line 1: txMsg := &TxMessage{'{'}{'}'}; proto.Unmarshal(bz, txMsg)</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.mem}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: err := memR.mempool.CheckTx(txMsg.Tx, nil, txInfo)
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 피어에서 수신 → CheckTx → 유효하면 재전파
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.ev}>evidenceReactor.Receive(0x25)</text>
    <text x={20} y={44} fontSize={10} fill={C.ev}>Line 1: ev := EvidenceFromProto(evi.Evidence)</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.ev}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: err := evR.evpool.AddEvidence(ev)  // 증거 풀에 저장
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // DuplicateVoteEvidence → 슬래싱 근거 데이터
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={100} h={22} label="Priority 7" sub="합의 다음" color={C.ev} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function P2PChannelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
