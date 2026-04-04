import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './BLSSignFlowVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: msgPoint := blst.HashToCurve(msg, dst)  // G2 매핑
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: sig := new(blst.P2Affine).Sign(sk, msgPoint)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: return bls.SignatureFromBytes(sig.Compress())
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // hash-to-curve → 스칼라 곱 sk*H(msg) → 96B 서명
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="sig ∈ G2" color={C.sign} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: aggPk := bls.AggregatePublicKeys(pks)  // pk 합산
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: ok := aggPk.FastAggregateVerify(sigs, msg)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: // e(aggPk, H(msg)) == e(G1, aggSig) → 패어링 1회
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 동일 메시지 → pk 합산 → 수천 서명을 단일 검증
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="패어링 1회" color={C.verify} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: rand := randomScalars(len(sigs))  // rogue-key 방어
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: lhs := multiPairing(pks, msgs, rand)
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: rhs := batchSigCheck(sigs, rand)
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 서로 다른 (pk, msg) 쌍 → 랜덤 계수 → 한 번에 검증
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="배치 검증" color={C.batch} />
    </motion.g>
  </g>);
}
