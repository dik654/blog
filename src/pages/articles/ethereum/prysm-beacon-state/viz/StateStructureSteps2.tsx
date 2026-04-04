import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './StateStructureVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: dst := &BeaconState{'{'}sharedFieldRefs: src.sharedFieldRefs{'}'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: for f, ref := range src.sharedFieldRefs {'{'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     ref.AddRef()  // 참조 카운트만 증가
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // Copy-on-Write: 실제 슬라이스 복사 없이 참조 공유
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="메모리 절약" color={C.cow} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: if b.dirtyFields[fieldIdx] {'{'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2:     b.recomputeFieldTrie(fieldIdx, elements)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: {'}'}  // 변경 인덱스만 Merkle 서브트리 갱신
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // O(log n) — 전체 트리 재구성 없이 dirty 필드만 반영
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="O(log n)" color={C.hash} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: func UpgradeToAltair(state *BeaconState) {'{'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2:     state.InactivityScores = make([]uint64, numVals)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     state.CurrentSyncCommittee = committee
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // Phase0→Altair→Bellatrix→Capella→Deneb 인플레이스 변환
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="포크 업그레이드" color={C.fork} />
    </motion.g>
  </g>);
}
