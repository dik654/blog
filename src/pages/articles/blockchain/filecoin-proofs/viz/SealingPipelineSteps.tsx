import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';

const C = { data: '#6366f1', pc1: '#f59e0b', pc2: '#10b981', seed: '#6b7280', c1: '#8b5cf6', c2: '#ec4899', chain: '#0ea5e9' };

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.data}>데이터 준비 — mmap 매핑</text>
    <text x={20} y={44} fontSize={10} fill={C.data}>Line 1: let nodes = sector_size / NODE_SIZE  // ~10억 개</text>
    <motion.text x={20} y={62} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: let data = mmap::MmapMut::map_mut(&file)
    </motion.text>
  </g>);
}
export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.pc1}>PC1: SDR 인코딩 → PC2: Merkle</text>
    <text x={20} y={44} fontSize={10} fill={C.pc1}>Line 1: labels = generate_labels(graph, 11)  // SDR CPU 3-5h</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.pc2}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: comm_r = poseidon(tree_c.root(), tree_r.root())  // GPU ~15분
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // PC1 순차 전용 | PC2 GPU 가속
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={90} h={22} label="comm_r" sub="복제 커밋" color={C.pc2} />
    </motion.g>
  </g>);
}
export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.seed}>WaitSeed → C1 챌린지</text>
    <text x={20} y={44} fontSize={10} fill={C.seed}>Line 1: seed = chain.GetRandomness(epoch + 150)  // ~75분 대기</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.c1}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: challenges = derive_challenges(seed, sector_id)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: paths = extract_merkle_paths(trees, challenges)
    </motion.text>
  </g>);
}
export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.c2}>C2: Groth16 → 온체인 검증</text>
    <text x={20} y={44} fontSize={10} fill={C.c2}>Line 1: proof = bellperson::groth16::prove(circuit, paths)  // 192B</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: groth16::verify(vk, proof, inputs)  // Pairing ~10ms
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 검증 성공 → 섹터 활성화, 파워 인정
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="Active" sub="파워 인정" color={C.chain} />
    </motion.g>
  </g>);
}
