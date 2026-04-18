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

const STEPS_LOSS = [
  { label: '1. ORPO 손실 = SFT + Odds Ratio', body: 'L_ORPO = L_SFT + λ·L_OR\nSFT로 chosen 학습 + OR로 rejected 대비 대조' },
  { label: '2. Odds Ratio 수학', body: 'odds = P/(1-P), log odds ∈ (-∞, ∞)\n극단 확률에서도 수치 안정, gradient smooth' },
  { label: '3. λ 튜닝 & 구현', body: 'λ = 0.1~1.0, 너무 크면 SFT 약화\nsft_loss + beta * or_loss 형태' },
];

export default function ORPOLossDetailViz() {
  return (
    <StepViz steps={STEPS_LOSS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="ORPO Loss:" color={B} delay={0} bold />
              <L y={36} text="L_ORPO = L_SFT + λ · L_OR" color={P} delay={d} />
              <L y={56} text="L_SFT = -log π_θ(y_w | x)" color={G} delay={d*2} />
              <L y={71} text="  → 선호된 응답의 확률 최대화" color={M} delay={d*3} />
              <L y={91} text="L_OR = -log σ(log(odds_w / odds_l))" color={W} delay={d*4} />
              <L y={106} text="  odds_w = π_θ(y_w)/(1 - π_θ(y_w))" color={W} delay={d*5} />
              <L y={121} text="  odds_l = π_θ(y_l)/(1 - π_θ(y_l))" color={W} delay={d*6} />
              <L y={146} text="// 하나의 loss로 SFT + 정렬 통합" color={G} delay={d*7} bold />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="왜 Odds Ratio?" color={B} delay={0} bold />
              <L y={38} text="Probability: P ∈ [0, 1], linear scale" color={M} delay={d} />
              <L y={53} text="Odds: P/(1-P) ∈ [0, ∞), log scale 대칭" color={P} delay={d*2} />
              <L y={68} text="Log Odds: log(P/(1-P)) ∈ (-∞, ∞)" color={G} delay={d*3} bold />
              <L y={88} text="→ 극단 확률에서도 수치 안정" color={G} delay={d*4} />
              <L y={103} text="→ gradient가 smooth" color={G} delay={d*5} />
              <L y={123} text="해석:" color={W} delay={d*6} />
              <L y={138} text="  첫 항: chosen 응답 학습 (SFT)" color={W} delay={d*7} />
              <L y={153} text="  둘째 항: rejected 대비 대조 학습" color={W} delay={d*8} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="λ 튜닝:" color={B} delay={0} bold />
              <L y={36} text="λ = 0.1 ~ 1.0 범위" color={W} delay={d} />
              <L y={51} text="너무 크면: SFT 약화, 정렬만 강함" color={E} delay={d*2} />
              <L y={66} text="너무 작으면: 정렬 약함, SFT만" color={E} delay={d*3} />
              <L y={86} text="PyTorch 구현:" color={B} delay={d*4} bold />
              <L y={101} text="sft_loss = -policy_chosen_logps.mean()" color={P} delay={d*5} />
              <L y={116} text="log_odds = chosen_logits - rejected_logits" color={P} delay={d*6} />
              <L y={131} text="or_loss = -logsigmoid(log_odds).mean()" color={P} delay={d*7} />
              <L y={151} text="return sft_loss + beta * or_loss" color={G} delay={d*8} bold />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
