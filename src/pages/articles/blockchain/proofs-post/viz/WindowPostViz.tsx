import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './WindowPostVizData';
import { CodeViewButton } from '@/components/code';

const REF_KEYS = ['post-main', 'post-main', 'post-main'];
const REF_LABELS = ['데드라인 구조', '파티션 증명', '온체인 검증'];

function StepDeadlines() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.deadline}>데드라인 구조 — 24시간 주기</text>
    <text x={20} y={44} fontSize={10} fill={C.deadline}>Line 1: const DEADLINES = 48  // 각 30분 간격</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.deadline}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: current_dl = (epoch - proving_start) / WPoStChallengePeriod
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 섹터들이 48개 데드라인에 균등 분배
    </motion.text>
  </g>);
}

function StepPartitions() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.part}>파티션별 증명 생성</text>
    <text x={20} y={44} fontSize={10} fill={C.part}>Line 1: partitions = deadline.partitions()  // 최대 2349 섹터/파티션</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.proof}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: for p in partitions {'{'} proof = generate_post(p.sectors) {'}'}
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // GPU 병렬 — 파티션별 독립 Groth16 증명
    </motion.text>
  </g>);
}

function StepSubmit() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.proof}>온체인 제출 + 검증</text>
    <text x={20} y={44} fontSize={10} fill={C.proof}>Line 1: snark = groth16::prove(wpost_circuit, challenges)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.deadline}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: submit_window_post(deadline_idx, proofs)  // 온체인 제출
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 성공 → 파워 유지, 실패 → Fault 처리
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="파워 유지" sub="or Fault" color={C.part} />
    </motion.g>
  </g>);
}

const R = [StepDeadlines, StepPartitions, StepSubmit];

export default function WindowPostViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
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
