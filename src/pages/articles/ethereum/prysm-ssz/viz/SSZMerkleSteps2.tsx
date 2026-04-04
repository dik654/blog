import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './SSZMerkleVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const mono = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--foreground)' } as const;
const comment = { fontFamily: 'monospace', fontSize: 10, fill: 'var(--muted-foreground)' } as const;

export function Step3() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: off1 := binary.LittleEndian.Uint32(buf[0:4])  // off=12
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: off2 := binary.LittleEndian.Uint32(buf[4:8])  // off=28
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3: field1 := UnmarshalSSZ(buf[off1:off2])
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 고정부에서 오프셋 수집 → 각 구간 역직렬화
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="필드 복원" color={C.unmarshal} />
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: chunks := packChunks(data, 32)  // 32B 청크 분할
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: for i := len(chunks)/2 - 1; i &gt;= 0; i-- {'{'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     tree[i] = sha256(tree[2*i+1] || tree[2*i+2])
    </motion.text>
    <motion.text x={10} y={66} {...comment} {...fade(0.4)}>
      Line 4: // 리프 → 내부 노드 → Root — 이진 Merkle 트리 구성
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={310} y={72} w={100} h={24} label="Root 32B" color={C.merkle} />
    </motion.g>
  </g>);
}

export function Step5() {
  return (<g>
    <motion.text x={10} y={18} {...mono} {...fade(0.1)}>
      Line 1: genIdx := (1 &lt;&lt; depth) + leafIndex  // BFS 인덱스
    </motion.text>
    <motion.text x={10} y={34} {...mono} {...fade(0.2)}>
      Line 2: for genIdx &gt; 1 {'{'}
    </motion.text>
    <motion.text x={10} y={50} {...mono} {...fade(0.3)}>
      Line 3:     proof = append(proof, tree[genIdx^1])  // 형제 노드
    </motion.text>
    <motion.text x={10} y={66} {...mono} {...fade(0.35)}>
      Line 4:     genIdx /= 2  // 부모로 이동
    </motion.text>
    <motion.text x={10} y={82} {...comment} {...fade(0.4)}>
      Line 5: // Generalized Index → 증명 경로 형제 수집 (라이트 클라이언트)
    </motion.text>
    <motion.g {...fade(0.5)}>
      <DataBox x={335} y={82} w={80} h={24} label="Merkle 증명" color={C.proof} />
    </motion.g>
  </g>);
}
