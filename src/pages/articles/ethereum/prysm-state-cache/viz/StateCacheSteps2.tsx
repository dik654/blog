import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './StateCacheVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: summary := &StateSummary{'{'}Slot: slot, Root: blockRoot{'}'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: db.SaveStateSummary(ctx, summary)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: // 미저장 슬롯은 (슬롯, 블록 루트)만 기록
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 필요 시 가까운 에폭 상태에서 재생하여 복원
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="요약만 저장" color={C.summary} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: startState := db.StateBySlot(ctx, epochStartSlot)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: for _, blk := range blocks[startSlot:targetSlot] {'{'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     startState, err = transition.ProcessSlots(ctx, startState, blk)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 저장 상태 기점 → 블록 순차 적용 → 목표 상태 계산
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="ReplayBlocks" color={C.replay} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: if state.FinalizedCheckpoint().Epoch &gt; s.hotThreshold {'{'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2:     s.archiveState(ctx, state)  // Cold Archive 전환
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     delete(s.hotCache, root)  // 메모리 해제
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // Finalized 이후 Hot→Cold 전환으로 메모리 확보
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="Cold 아카이브" color={C.cold} />
    </motion.g>
  </g>);
}
