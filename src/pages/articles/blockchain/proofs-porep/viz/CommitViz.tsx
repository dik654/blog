import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './CommitVizData';
import { CodeViewButton } from '@/components/code';

const REF_KEYS = ['seal-porep', 'seal-porep', 'seal-porep'];
const REF_LABELS = ['InteractiveSeed', 'Merkle 경로', 'Groth16'];

function StepSeed() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.seed}>InteractiveSeed — 체인 랜덤</text>
    <text x={20} y={44} fontSize={10} fill={C.seed}>Line 1: seed = chain.get_randomness(epoch + 150)  // 150에폭 후</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.merkle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: challenges = derive_challenges(seed, sector_id, count)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 사전 계산 방지 — 봉인 후 랜덤 챌린지
    </motion.text>
  </g>);
}

function StepMerkle() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.merkle}>Merkle 경로 추출</text>
    <text x={20} y={44} fontSize={10} fill={C.merkle}>Line 1: path_r = tree_r.gen_proof(challenge_idx)  // TreeR 경로</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.merkle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: path_c = tree_c.gen_proof(challenge_idx)  // TreeC 경로
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // siblings + root → public input으로 회로에 전달
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="경로 증거" sub="public input" color={C.groth} />
    </motion.g>
  </g>);
}

function StepGroth() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.groth}>Groth16 GPU 증명 생성</text>
    <text x={20} y={44} fontSize={10} fill={C.gpu}>Line 1: proof = bellperson::groth16::prove(params, circuit)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.groth}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // proof = (A: G1, B: G2, C: G1) — 총 192바이트
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: groth16::verify(vk, proof, inputs)  // Pairing ~10ms 검증
    </motion.text>
  </g>);
}

const R = [StepSeed, StepMerkle, StepGroth];

export default function CommitViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
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
