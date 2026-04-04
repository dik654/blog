import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './SyncCommitteeVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: headRoot := s.headFetcher.HeadRoot(ctx)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: domain := params.DomainSyncCommittee
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: sig := v.Sign(signingRoot(headRoot, domain))
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 어테스테이션과 별도 도메인으로 헤드 블록 루트 서명
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="DOMAIN_SYNC" color={C.sign} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: for subnetIdx := 0; subnetIdx &lt; 4; subnetIdx++ {'{'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2:     contrib.AggregationBits.SetBitAt(valIdx, true)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     contrib.Signature = bls.AggregateSignatures(sigs)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 4개 서브넷별 비트필드 + BLS aggregate → Contribution
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="BLS 집계" color={C.agg} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: block.Body.SyncAggregate = syncAgg
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: participantCount := syncAgg.SyncCommitteeBits.Count()
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: reward := baseReward * participantCount / totalCommittee
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 블록에 SyncAggregate 포함 → 참여 보상, 불참 패널티
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="보상/패널티" color={C.reward} />
    </motion.g>
  </g>);
}
