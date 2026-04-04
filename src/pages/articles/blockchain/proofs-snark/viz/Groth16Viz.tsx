import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './Groth16VizData';
import { CodeViewButton } from '@/components/code';

const REF_KEYS = ['snark-prover', 'snark-prover', 'snark-prover'];
const REF_LABELS = ['R1CS→QAP', '증명 생성', '검증 방정식'];

function StepR1CS() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.r1cs}>R1CS → QAP 변환</text>
    <text x={20} y={44} fontSize={10} fill={C.r1cs}>Line 1: let (a, b, c) = r1cs.to_matrices()  // 제약 행렬</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.qap}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let polys = lagrange_interpolate(a, b, c)  // 다항식 보간
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // R1CS: A*s . B*s = C*s → QAP 다항식으로 변환
    </motion.text>
  </g>);
}

function StepProof() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.proof}>증명 구조 — A, B, C</text>
    <text x={20} y={44} fontSize={10} fill={C.proof}>Line 1: let a = msm(pk.a_g1, witness)  // G1 점 (48 bytes)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.proof}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: let b = msm(pk.b_g2, witness)  // G2 점 (96 bytes)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill={C.proof}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: let c = msm(pk.c_g1, witness)  // G1 점 (48 bytes)
    </motion.text>
    <motion.text x={20} y={98} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
      총 192바이트 (BLS12-381 압축)
    </motion.text>
  </g>);
}

function StepVerify() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.pair}>검증 방정식 — Pairing</text>
    <text x={20} y={44} fontSize={10} fill={C.pair}>Line 1: lhs = pairing(proof.a, proof.b)  // e(A, B)</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.pair}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: rhs = e(vk.alpha, vk.beta) * e(input_acc, vk.gamma) * e(proof.c, vk.delta)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: assert!(lhs == rhs)  // ~10ms 온체인 검증
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="~10ms" sub="온체인 검증" color={C.qap} />
    </motion.g>
  </g>);
}

const R = [StepR1CS, StepProof, StepVerify];

export default function Groth16Viz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
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
