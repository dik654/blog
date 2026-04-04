import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './BlockProcessingVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: votes := state.Eth1DataVotes()
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: if eth1util.AreEth1DataEqual(vote, block.Eth1Data) {'{'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     voteCount++  // 과반 일치 시 eth1Data 반영
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // eth1_data_votes 과반 합의 → 예치금 루트 결정
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="depositRoot" color={C.eth1} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: ProcessAttestations(ctx, state, block.Body.Attestations)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: ProcessDeposits(ctx, state, block.Body.Deposits)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: ProcessVoluntaryExits(ctx, state, block.Body.VoluntaryExits)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // attestation → deposit → exit → slashing 순차 실행
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="ops 순차 처리" color={C.ops} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: payload := block.Body.ExecutionPayload
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: result, err := s.engine.NewPayload(ctx, payload, versionedHashes)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: if result.Status == pb.PayloadStatus_INVALID {'{'}
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // Engine API로 EL에 페이로드 전달, VALID/INVALID 반환
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="EL 검증" color={C.exec} />
    </motion.g>
  </g>);
}
