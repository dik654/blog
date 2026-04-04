import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './PC2DetailVizData';
import { CodeViewButton } from '@/components/code';

const REF_KEYS = ['seal-porep', 'seal-porep', 'seal-porep'];
const REF_LABELS = ['칼럼 해시', 'TreeC+TreeR', 'GPU 가속'];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.poseidon}>칼럼 해시 — Poseidon</text>
    <text x={20} y={44} fontSize={10} fill={C.col}>Line 1: let column = labels.iter().map(|l| l[node]).collect()</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.poseidon}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: tree_c_leaf = poseidon::hash(&column)  // 11층 칼럼 해시
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // Poseidon: ZK-friendly 해시 — SHA256보다 회로 비용 낮음
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.tree}>TreeC + TreeR 구축</text>
    <text x={20} y={44} fontSize={10} fill={C.poseidon}>Line 1: tree_c = MerkleTree::new(column_hashes, PoseidonHasher)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.tree}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: tree_r = MerkleTree::new(replica_data, PoseidonHasher)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: comm_r = poseidon(tree_c.root(), tree_r.root())  // 최종 커밋
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={90} h={22} label="comm_r" sub="복제 커밋" color={C.tree} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.gpu}>GPU 가속 — CUDA/OpenCL</text>
    <text x={20} y={44} fontSize={10} fill={C.gpu}>Line 1: gpu_tree = gpu::build_merkle_tree(leaves, kernel)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.gpu}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // GPU: ~15분 vs CPU: ~3시간 — 12x 속도 향상
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 수백만 Poseidon 해시를 커널 내 배치 병렬 처리
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function PC2DetailViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const S = R[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}><S /></svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(REF_KEYS[step])} />
                <span className="text-[10px] text-muted-foreground">{REF_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
