import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './FinalityFlowVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: totalBal := helpers.TotalActiveBalance(state)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: if targetBalance*3 &gt;= totalBal*2 {'{'}  // 2/3 달성
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     state.SetCurrentJustifiedCheckpoint(cp)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 타겟 투표 비율 ≥ 2/3 → justified (아직 가역)
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="Justified" color={C.just} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: prevJust := state.PreviousJustifiedCheckpoint()
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: currJust := state.CurrentJustifiedCheckpoint()
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: if prevJust.Epoch+1 == currJust.Epoch {'{'}  // 연속 2 에폭
    </motion.text>
    <motion.text x={10} y={66} {...mono} {...fade(0.35)}>
      Line 4:     state.SetFinalizedCheckpoint(prevJust)  // 불가역
    </motion.text>
    <motion.text x={10} y={82} {...comment} {...fade(0.4)}>
      Line 5: // 연속 justified → finalized (슬래싱 없이 되돌릴 수 없음)
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={335} y={82} w={80} h={24} label="Finalized" color={C.final} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: finalizedRoot := state.FinalizedCheckpoint().Root
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: s.store.PruneNodes(ctx, finalizedRoot)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: // finalized 아래 모든 비-캐노니컬 포크 노드 삭제
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 메모리 확보 — 포크 트리에서 불필요한 분기 제거
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="Prune 완료" color={C.prune} />
    </motion.g>
  </g>);
}
