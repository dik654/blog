import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';
import { C, STEPS } from './GPUVizData';
import { CodeViewButton } from '@/components/code';

const REF_KEYS = ['snark-prover', 'snark-prover', 'snark-prover'];
const REF_LABELS = ['MSM 커널', 'NTT 커널', '하이브리드 모드'];

function StepMSM() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.msm}>MSM GPU 커널 — 증명 시간 70~80%</text>
    <text x={20} y={44} fontSize={10} fill={C.gpu}>Line 1: let result = gpu::msm(bases, scalars)  // Multi-Scalar Multiply</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.gpu}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // CUDA/OpenCL 커널 — 수천 스레드 동시 점 연산
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // CPU 대비 10~50x 속도 향상 (GPU 메모리에 의존)
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={350} y={68} w={100} h={22} label="10~50x" sub="속도 향상" color={C.gpu} />
    </motion.g>
  </g>);
}

function StepNTT() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.ntt}>NTT GPU 커널 — 유한체 FFT</text>
    <text x={20} y={44} fontSize={10} fill={C.ntt}>Line 1: let evals = gpu::ntt(coeffs, omega)  // 다항식 평가</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.ntt}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // QAP 다항식을 평가 형태로 변환 (배치 처리)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // 버터플라이 패턴 — GPU 메모리 대역폭 활용
    </motion.text>
  </g>);
}

function StepHybrid() {
  return (<g>
    <text x={20} y={22} fontSize={11} fontWeight={600} fill={C.gpu}>하이브리드 모드 — GPU+CPU</text>
    <text x={20} y={44} fontSize={10} fill={C.gpu}>Line 1: env::set("BELLMAN_CPU_UTILIZATION", "0.5")  // CPU 50%</text>
    <motion.text x={20} y={62} fontSize={10} fill={C.msm}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
      Line 2: // GPU: MSM + NTT (VRAM 수 GB 필요)
    </motion.text>
    <motion.text x={20} y={80} fontSize={10} fill={C.cpu}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      Line 3: // CPU: 나머지 연산 + VRAM 부족 시 분할 전송
    </motion.text>
  </g>);
}

const R = [StepMSM, StepNTT, StepHybrid];

export default function GPUViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
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
