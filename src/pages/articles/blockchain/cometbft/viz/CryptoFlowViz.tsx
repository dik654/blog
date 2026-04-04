import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = { sign: '#6366f1', net: '#10b981', verify: '#f59e0b', batch: '#ec4899' };

const STEPS = [
  { label: '서명 생성 내부', body: '밸리데이터가 투표 바이트를 Ed25519로 서명합니다.' },
  { label: '서명 브로드캐스트', body: '서명된 투표를 P2P 네트워크로 전파합니다.' },
  { label: '서명 검증 내부', body: '수신 노드가 공개키로 서명을 검증합니다.' },
  { label: '배치 검증 내부', body: 'Ed25519 배치 검증기로 다중 서명을 한번에 처리합니다.' },
];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.sign}>privVal.SignVote() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.sign}>Line 1: signBytes := VoteSignBytes(chainID, vote)  // 정규화</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.sign}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: sig, err := privKey.Sign(signBytes)  // Ed25519 서명
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: vote.Signature = sig  // 64바이트 서명 첨부
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={92} w={100} h={22} label="Signature" sub="64 bytes" color={C.sign} />
    </motion.g>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.net}>cs.signAddVote() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.net}>Line 1: cs.privValidator.SignVote(chainID, vote)</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.net}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: cs.voteMsg = &VoteMessage{'{'}Vote: vote{'}'}
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: cs.internalMsgQueue {'<'}- msgInfo{'{'}Msg: cs.voteMsg{'}'}  // 내부 + P2P 전파
    </motion.text>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.verify}>vote.Verify() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.verify}>Line 1: pubKey := val.PubKey  // 밸리데이터 셋에서 공개키 조회</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.verify}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: if !pubKey.VerifySignature(signBytes, vote.Signature) {'{'}
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3:   return ErrVoteInvalidSignature  // 캐시 미스 시 매번 검증
    </motion.text>
    <motion.text x={20} y={102} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      Line 4: {'}'}  // 캐시 히트 시 재검증 생략 → 성능 최적화
    </motion.text>
  </g>);
}

function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.batch}>BatchVerifier.Verify() 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.batch}>Line 1: bv := ed25519.NewBatchVerifier(len(sigs))</text>
    <motion.text x={20} y={64} fontSize={10} fill={C.batch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: for i, sig := range sigs {'{'} bv.Add(pubKeys[i], msgs[i], sig) {'}'}
    </motion.text>
    <motion.text x={20} y={84} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: ok := bv.Verify()  // 한번에 검증 — 개별 대비 ~2x 빠름
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={340} y={92} w={120} h={22} label="BatchVerify" sub="~2x 속도 향상" color={C.batch} />
    </motion.g>
  </g>);
}

const R = [Step0, Step1, Step2, Step3];

export default function CryptoFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>;
      }}
    </StepViz>
  );
}
