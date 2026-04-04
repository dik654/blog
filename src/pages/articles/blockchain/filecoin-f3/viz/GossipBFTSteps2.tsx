import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './GossipBFTVizData';

export function StepPrepareCommit() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.f3}>PREPARE → COMMIT 내부</text>
    <text x={20} y={44} fontSize={10} fill={C.f3}>Line 1: r.phase = PREPARE  // BLS 서명 수집</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.f3}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: r.broadcast(PrepareVote{'{'}Sig: bls.Sign(tipset){'}'})
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: r.phase = COMMIT  // 2/3+ 파워 → 되돌릴 수 없음
    </motion.text>
  </g>);
}

export function StepDecide() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.f3}>DECIDE → 인증서 발행</text>
    <text x={20} y={44} fontSize={10} fill={C.cert}>Line 1: cert := buildCertificate(commitVotes)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.cert}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: certStore.Put(cert)  // 영구 저장
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // reorg 불가 — 7.5시간 → 수 분으로 단축
    </motion.text>
    <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
      <DataBox x={340} y={68} w={110} h={22} label="Certificate" sub="확정 인증서" color={C.cert} />
    </motion.g>
  </g>);
}

export function StepGossipSub() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.f3}>GossipSub 메시지 복잡도</text>
    <text x={20} y={44} fontSize={10} fill={C.vote}>Line 1: // 전통 PBFT: O(n*n) 메시지 복잡도</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.vote}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: // GossipSub: O(n*log(n)) — 수백 SP 참여 가능
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      Line 3: // 쿼럼 기준: 노드 수가 아닌 스토리지 파워(bytes)
    </motion.text>
  </g>);
}
