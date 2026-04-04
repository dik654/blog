import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './EngineAPIFlowVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: fcState := &pb.ForkchoiceState{'{'}
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2:     HeadBlockHash: headRoot[:],
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     SafeBlockHash: safeRoot[:],
    </motion.text>
    <motion.text x={10} y={66} {...mono} {...fade(0.35)}>
      Line 4:     FinalizedBlockHash: finRoot[:] {'}'}
    </motion.text>
    <motion.text x={10} y={82} {...comment} {...fade(0.4)}>
      Line 5: // head/safe/finalized 해시 → EL 캐노니컬 체인 갱신
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={335} y={82} w={80} h={24} label="EL 체인 갱신" color={C.fork} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: payloadID, err := s.engine.ForkchoiceUpdated(ctx, fc, attrs)
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: // attrs != nil → EL이 페이로드 빌드 시작
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: payload, err := s.engine.GetPayload(ctx, payloadID)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // FCU로 빌드 시작 → GetPayload로 완성 페이로드 회수
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="payload 회수" color={C.get} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: localValue := localPayload.Value()
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: builderValue := builderBid.Value()
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: if builderValue &gt; localValue * boostFactor {'{'}
    </motion.text>
    <motion.text x={10} y={66} {...mono} {...fade(0.35)}>
      Line 4:     return builderPayload  // MEV-Boost 선택
    </motion.text>
    <motion.text x={10} y={82} {...comment} {...fade(0.4)}>
      Line 5: // 로컬 빌드 vs 릴레이 비드 → 높은 가치 쪽 선택
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={335} y={82} w={80} h={24} label="최고 가치" color={C.mev} />
    </motion.g>
  </g>);
}
