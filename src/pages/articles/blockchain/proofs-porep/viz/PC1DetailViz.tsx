import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './PC1DetailVizData';
import { CodeViewButton } from '@/components/code';

const REF_KEYS = ['seal-porep', 'seal-porep', 'seal-porep'];
const REF_LABELS = ['DRG 그래프', 'SHA256 레이블', '11레이어 반복'];

function Step0() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.drg}>DRG 그래프 — 부모 노드 선택</text>
    <text x={20} y={44} fontSize={10} fill={C.drg}>Line 1: drg_parents = bucket_sample(node_idx, 6)  // DRG 6개</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.exp}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: exp_parents = feistel_permute(node_idx, 8)  // Expander 8개
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: all_parents = drg.chain(exp)  // 총 14개 부모 레이블 → SHA256 입력
    </motion.text>
  </g>);
}

function Step1() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.sha}>SHA256 레이블링 — 순차 전용</text>
    <text x={20} y={44} fontSize={10} fill={C.sha}>Line 1: let input = [replica_id, parents_data].concat()</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.sha}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: labels[i] = sha256::hash(&input)  // 32바이트 출력
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill={C.seq}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 부모 완료 후에야 자식 계산 → 병렬화 불가
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="순차 전용" sub="CPU 바운드" color={C.seq} />
    </motion.g>
  </g>);
}

function Step2() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.node}>11레이어 반복 생성</text>
    <text x={20} y={44} fontSize={10} fill={C.node}>Line 1: for layer in 1..=LAYERS {'{'} // LAYERS = 11</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.node}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2:   generate_labels(graph, replica_id, layer)  // 순차 생성
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: {'}'}  // 총 44억 SHA256 연산 — 32GiB 기준 ~3시간
    </motion.text>
  </g>);
}

const R = [Step0, Step1, Step2];

export default function PC1DetailViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
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
