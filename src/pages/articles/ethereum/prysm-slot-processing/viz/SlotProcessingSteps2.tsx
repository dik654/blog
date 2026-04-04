import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './SlotProcessingVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: nextSlot := state.Slot() + 1
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: if slots.IsEpochStart(nextSlot) {'{'}  // (slot+1) % 32 == 0
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     // 에폭 경계: 슬롯 4832 = 32 * 151
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 에폭 경계 체크 — 32슬롯마다 에폭 전환 트리거
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="에폭 경계" color={C.epoch} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: state, err = ProcessEpochPrecompute(ctx, state)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: ProcessRewardsAndPenalties(state, balance)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: ProcessRegistryUpdates(ctx, state)
    </motion.text>
    <motion.text x={10} y={66} {...mono} {...fade(0.35)}>
      Line 4: ProcessFinalUpdates(ctx, state)
    </motion.text>
    <motion.text x={10} y={82} {...comment} {...fade(0.4)}>
      Line 5: // 보상/패널티 → 레지스트리 갱신 → 최종화 — 에폭 전환
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={335} y={82} w={80} h={24} label="에폭 완료" color={C.epoch} />
    </motion.g>
  </g>);
}
