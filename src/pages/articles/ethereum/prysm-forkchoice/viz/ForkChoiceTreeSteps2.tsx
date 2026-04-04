import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './ForkChoiceTreeVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: parent := s.nodeByRoot[block.ParentRoot]
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: node := &Node{'{'}Slot: block.Slot, Root: root, Parent: parent{'}'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: parent.Children = append(parent.Children, node)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 부모 루트로 기존 노드 탐색 → children에 추가
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="트리 확장" color={C.store} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: s.votes[validatorIdx] = Vote{'{'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2:     CurrentRoot: att.Data.BeaconBlockRoot,
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     NextEpoch: att.Data.Target.Epoch {'}'}
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 검증자 투표 기록 → 에폭 전환 시 weight 재계산
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="votes[idx]" color={C.attest} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: head := s.justifiedNode  // justified에서 출발
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: for len(head.Children) &gt; 0 {'{'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     head = bestChild(head)  // 최대 weight 자식
    </motion.text>
    <motion.text x={10} y={66} {...mono} {...fade(0.35)}>
      Line 4: head.Weight += boostWeight  // Proposer Boost 40%
    </motion.text>
    <motion.text x={10} y={82} {...comment} {...fade(0.4)}>
      Line 5: // LMD-GHOST 탐색 + Proposer Boost → HEAD 결정
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={335} y={82} w={80} h={24} label="HEAD" color={C.head} />
    </motion.g>
  </g>);
}
