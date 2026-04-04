import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './GossipsubMeshVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: if err := blocks.VerifyBlockSignature(msg); err != nil {'{'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2:     return pubsub.ValidationReject
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: if msg.Slot &lt; finalized.Slot {'{'}  return pubsub.ValidationIgnore {'}'}
    </motion.text>
    <motion.text x={10} y={66} {...mono} {...fade(0.35)}>
      Line 4: if s.hasSeenProposerIndex(msg.ProposerIndex, msg.Slot) {'{'}
    </motion.text>
    <motion.text x={10} y={82} {...comment} {...fade(0.4)}>
      Line 5: // 서명→슬롯→제안자→이중 제안 확인 → Accept/Reject/Ignore
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={335} y={82} w={80} h={24} label="검증 통과" color="#10b981" />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: for _, peer := range meshPeers[topic] {'{'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2:     gs.sendRPC(peer, msg)  // Accept만 메시 전파
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: if result == ValidationReject {'{'}
    </motion.text>
    <motion.text x={10} y={66} {...mono} {...fade(0.35)}>
      Line 4:     ps.AddPenalty(peer, -1000)  // 피어 감점
    </motion.text>
    <motion.text x={10} y={82} {...comment} {...fade(0.4)}>
      Line 5: // Accept → 메시 전파, Reject → 피어 감점, Ignore → 무시
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={335} y={82} w={80} h={24} label="전파 완료" color={C.fwd} />
    </motion.g>
  </g>);
}
