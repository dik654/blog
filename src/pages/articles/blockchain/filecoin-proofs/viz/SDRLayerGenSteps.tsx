import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';

const C = { node: '#6366f1', drg: '#10b981', exp: '#f59e0b', sha: '#ec4899', seq: '#ef4444' };

export function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.node}>섹터 분할 — 32바이트 노드</text>
    <text x={20} y={44} fontSize={10} fill={C.node}>Line 1: let node_count = sector_size / 32  // ~10억 노드</text>
    <motion.text x={20} y={62} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      Line 2: let data = mmap(sector_path, node_count * 32)  // mmap 매핑
    </motion.text>
  </g>);
}
export function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.sha}>replica_id 생성</text>
    <text x={20} y={44} fontSize={10} fill={C.sha}>Line 1: let input = [prover_id, sector_id, ticket, comm_d].concat()</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.sha}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let replica_id = sha256::hash(&input)  // 고유 식별자
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 동일 데이터도 섹터마다 다른 replica_id
    </motion.text>
  </g>);
}
export function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.drg}>부모 노드 선택 — DRG + Expander</text>
    <text x={20} y={44} fontSize={10} fill={C.drg}>Line 1: drg_parents = bucket_sample(node_idx, 6)  // 규칙적 6개</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.exp}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: exp_parents = feistel_permute(node_idx, 8)  // Feistel 8개
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: all_parents = [drg_parents, exp_parents]  // 총 14개
    </motion.text>
  </g>);
}
export function Step3() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.sha}>SHA256 레이블링 — 순차 전용</text>
    <text x={20} y={44} fontSize={10} fill={C.sha}>Line 1: let input = [replica_id, parent_labels].concat()</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.sha}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: labels[node] = sha256::hash(&input)  // 순차 해싱
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill={C.seq}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 부모 완료 후 자식 가능 → 병렬화 불가
    </motion.text>
  </g>);
}
export function Step4() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.node}>11레이어 반복 + XOR 인코딩</text>
    <text x={20} y={44} fontSize={10} fill={C.node}>Line 1: for layer in 1..=11 {'{'} generate_labels(graph, layer) {'}'}</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.node}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: replica[i] = data[i] ^ labels[10][i]  // XOR 인코딩
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 44억 SHA256 — 32GiB 기준 ~3시간
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="replica" sub="봉인 완료" color={C.node} />
    </motion.g>
  </g>);
}
