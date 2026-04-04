import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './P2PStackVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: s.pubsub.Join("/eth2/" + forkDigest + "/beacon_block/ssz_snappy")
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: s.pubsub.Join("/eth2/" + forkDigest + "/attestation/ssz_snappy")
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: s.pubsub.Join("/eth2/" + forkDigest + "/sync_committee/ssz_snappy")
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 연결 후 GossipSub 1.1 메시에 토픽별 참여
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="메시 조인" color={C.mesh} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: topicScore := params.TopicWeight * meshTime
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: ipPenalty := params.IPColocationWeight * ipCount
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: total := topicScore + ipPenalty + behaviourPenalty
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // Topic Score + IP Colocation + Behaviour → 합산 점수
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="합산: +1.4" color={C.score} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: func (g *ConnGater) InterceptPeerDial(pid) bool {'{'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2:     score := g.scorer.Score(pid)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     return score &gt;= minScore  // -10 미만이면 차단
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 점수 미달 차단 + 인바운드 Rate Limit → Eclipse 방어
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="차단/수락" color={C.gate} />
    </motion.g>
  </g>);
}
