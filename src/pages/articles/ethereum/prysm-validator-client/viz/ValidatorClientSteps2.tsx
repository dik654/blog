import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './ValidatorClientVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: go v.ProposeBlock(ctx, slot, pubKey)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: go v.SubmitAttestation(ctx, slot, pubKey)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: go v.SubmitSyncCommitteeMessage(ctx, slot, pubKey)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 역할별 병렬 go func 실행 — 동시 처리
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="병렬 실행" color={C.exec} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: slashable := v.db.CheckSlashableAttestation(pubKey, data)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: if slashable {'{'}  return errSlashable  {'}'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: sig, err := v.keyManager.Sign(ctx, signingRoot)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 이중 투표 확인 → 통과 시 BLS 서명 생성
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="슬래싱 방지" color={C.sign} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: signedBlk := &ethpb.SignedBeaconBlock{'{'}Block: blk, Signature: sig{'}'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: _, err := v.beaconClient.ProposeBlock(ctx, signedBlk)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: // gRPC → Beacon Node → GossipSub 브로드캐스트
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 서명된 블록/어테스테이션을 비콘 노드에 제출
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="gRPC 전송" color={C.submit} />
    </motion.g>
  </g>);
}
