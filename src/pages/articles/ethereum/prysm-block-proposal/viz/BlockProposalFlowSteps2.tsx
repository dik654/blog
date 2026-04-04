import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './BlockProposalFlowVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: deposits, root := s.depositFetcher.PendingDeposits(ctx)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: eth1Data := s.eth1DataMajorityVote(ctx, state)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: blk.Body.Deposits = deposits[:min(len(deposits), 16)]
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 예치금 수집 + eth1_data 투표 결정 → 블록에 포함
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="최대 16개" color={C.deposit} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: blk.Body.RandaoReveal = randaoReveal
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: blk.Body.Attestations = atts
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: blk.Body.Eth1Data = eth1Data
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // RANDAO + attestations + deposits → BeaconBlock 구조체 조립
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="구조체 완성" color={C.assemble} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: sig, err := v.signBlock(ctx, blk, slot, pubKey)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: signedBlk := &ethpb.SignedBeaconBlock{'{'}Block: blk, Signature: sig{'}'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: s.cfg.p2p.Broadcast(ctx, signedBlk)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // BLS 개인키 서명 → gossipsub으로 네트워크 전파
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="브로드캐스트" color={C.sign} />
    </motion.g>
  </g>);
}
