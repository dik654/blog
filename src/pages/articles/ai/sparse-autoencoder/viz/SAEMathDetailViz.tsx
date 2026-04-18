import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const d = 0.06;
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', E = '#ef4444', M = 'var(--muted-foreground)';

function L({ y, text, color, delay = 0, bold }: {
  y: number; text: string; color: string; delay?: number; bold?: boolean;
}) {
  return (
    <motion.text x={18} y={y} fontSize={10} fontFamily="monospace" fill={color}
      fontWeight={bold ? 700 : 400}
      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}>
      {text}
    </motion.text>
  );
}

const STEPS = [
  { label: '1. SAE 수학적 정의', body: 'Encoder: f = ReLU(W_enc·x + b)\nDecoder: x_hat = W_dec·f + b\nL = ||x - x_hat||^2 + lambda·||f||_1' },
  { label: '2. 핵심 제약 & 변형', body: 'Expansion 8~64배, L0 = 50~200/16K\nTop-K SAE (정확히 k개 활성화), Gated SAE' },
  { label: '3. 학습 파이프라인', body: 'Activation 수집 → SAE 초기화 → 학습 → 평가\nDead features, Shrinkage, Absorption 문제 해결' },
];

export default function SAEMathDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="SAE 수학적 정의:" color={B} delay={0} bold />
              <L y={36} text="입력: x ∈ R^d (residual stream)" color={M} delay={d} />
              <L y={51} text="  예: Gemma 2B, d = 2304" color={M} delay={d*2} />
              <L y={71} text="Encoder: f = ReLU(W_enc · x + b_enc)" color={P} delay={d*3} />
              <L y={86} text="  f ∈ R^D, D >> d (예: D = 16,384)" color={P} delay={d*4} />
              <L y={106} text="Decoder: x_hat = W_dec · f + b_dec" color={W} delay={d*5} />
              <L y={126} text="Loss: ||x - x_hat||^2 + lambda·||f||_1" color={G} delay={d*6} bold />
              <L y={146} text="       reconstruction + L1 sparsity" color={M} delay={d*7} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="핵심 제약:" color={B} delay={0} bold />
              <L y={36} text="1. Expansion: D > d (보통 8~64배)" color={P} delay={d} />
              <L y={51} text="   더 많은 '공간' → 개념 분리" color={M} delay={d*2} />
              <L y={71} text="2. Sparsity: L0 ≈ 50~200 (16K 중)" color={W} delay={d*3} />
              <L y={86} text="   과잉 희소 → 정보 손실" color={E} delay={d*4} />
              <L y={101} text="   부족 희소 → 다의성 유지" color={E} delay={d*5} />
              <L y={121} text="변형 (2024):" color={G} delay={d*6} bold />
              <L y={136} text="Top-K: 정확히 k개 활성화 보장" color={G} delay={d*7} />
              <L y={151} text="Gated: binary gate, dead features 감소" color={G} delay={d*8} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="학습 파이프라인:" color={B} delay={0} bold />
              <L y={36} text="1. Activation 수집 (100M tokens × d)" color={M} delay={d} />
              <L y={51} text="2. SAE 초기화 (W_dec = W_enc.T 또는 norm)" color={M} delay={d*2} />
              <L y={66} text="3. recon_loss + lambda*sparsity_loss" color={P} delay={d*3} />
              <L y={86} text="주요 문제:" color={E} delay={d*4} bold />
              <L y={101} text="Dead Features: 절대 활성화 안 됨" color={E} delay={d*5} />
              <L y={116} text="Shrinkage: L1이 0으로 당김" color={E} delay={d*6} />
              <L y={131} text="Absorption: 작은 feature가 흡수됨" color={E} delay={d*7} />
              <L y={151} text="성공: L2<0.1, L0≈50~200, Alive>90%" color={G} delay={d*8} bold />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
