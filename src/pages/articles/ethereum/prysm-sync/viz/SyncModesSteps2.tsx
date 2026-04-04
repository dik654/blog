import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './SyncModesVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: resp, err := client.GetFinalizedState(ctx, ckptURL)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: state := stateutil.UnmarshalSSZ(resp.Body)  // ~300MB
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: db.SaveState(ctx, state, finRoot)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 체크포인트 직접 DL → 수 분 완료 (초기 동기화 수 일 대비)
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="수 분 완료" color={C.ckpt} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: current := checkpointSlot
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: for current &gt; 0 {'{'}  // 역방향 순회
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     batch := peer.BlocksByRange(current-64, current)
    </motion.text>
    <motion.text x={10} y={66} {...mono} {...fade(0.35)}>
      Line 4:     db.SaveBlocks(ctx, batch)  // 상태 전환 없이 저장만
    </motion.text>
    <motion.text x={10} y={82} {...comment} {...fade(0.4)}>
      Line 5: // Backfill: 체크포인트 이전 블록을 역방향 채우기 (빠름)
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={335} y={82} w={80} h={24} label="역방향 저장" color={C.back} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: sub := s.cfg.p2p.SubscribeToTopic(blockTopic)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: for msg := range sub.Messages() {'{'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     blk := s.validateAndProcess(ctx, msg)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // Regular Sync: GossipSub 실시간 블록 수신·검증·처리
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="실시간 동기화" color={C.reg} />
    </motion.g>
  </g>);
}
