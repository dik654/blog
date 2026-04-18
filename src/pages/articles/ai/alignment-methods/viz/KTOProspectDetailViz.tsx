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
  { label: '1. 전망이론 비대칭', body: '|v(loss)| > v(gain) — 100달러 잃는 괴로움이 얻는 기쁨의 2.25배\nλ_U = 2.25로 나쁜 응답 억제에 가중' },
  { label: '2. KTO Loss 설계', body: 'Desirable: 1 - σ(β·log_ratio - ref)\nUndesirable: σ(β·log_ratio - ref) - 1, 가중치 2.25배' },
  { label: '3. PyTorch 구현', body: 'log_ratio → rewards → ref_value(batch mean)\ntorch.where로 desirable/undesirable 분기' },
];

export default function KTOProspectDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="Kahneman-Tversky Prospect Theory (1979)" color={B} delay={0} bold />
              <L y={38} text="인간 의사결정의 비대칭:" color={M} delay={d} />
              <L y={53} text="v(gain) ≠ -v(loss)" color={P} delay={d*2} />
              <L y={68} text="|v(loss)| > v(gain)  (loss aversion)" color={E} delay={d*3} bold />
              <L y={88} text="예: 100달러 잃는 괴로움 > 얻는 기쁨" color={M} delay={d*4} />
              <L y={103} text="    → 후자가 2~2.5배 심리적 영향" color={W} delay={d*5} />
              <L y={123} text="Value function (S-curve):" color={B} delay={d*6} />
              <L y={138} text="v(x) = x^α (gain), -λ(-x)^α (loss)" color={P} delay={d*7} />
              <L y={153} text="α = 0.88, λ = 2.25" color={W} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="KTO Loss 설계:" color={B} delay={0} bold />
              <L y={38} text="Desirable (good) responses:" color={G} delay={d} />
              <L y={53} text="  v(x_w) = 1 - σ(β·log_ratio - ref)" color={P} delay={d*2} />
              <L y={73} text="Undesirable (bad) responses:" color={E} delay={d*3} />
              <L y={88} text="  v(x_l) = σ(β·log_ratio - ref) - 1" color={P} delay={d*4} />
              <L y={108} text="L_KTO = λ_D·v(x_w) + λ_U·v(x_l)" color={P} delay={d*5} bold />
              <L y={128} text="λ_D = 1.0   (desirable weight)" color={G} delay={d*6} />
              <L y={143} text="λ_U = 2.25  (undesirable, from KT)" color={E} delay={d*7} bold />
              <L y={153} text="// 나쁜 응답을 2.25배 강하게 억제" color={W} delay={d*8} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="PyTorch 구현:" color={B} delay={0} bold />
              <L y={36} text="log_ratio = policy_logps - reference_logps" color={P} delay={d} />
              <L y={51} text="rewards = beta * log_ratio" color={P} delay={d*2} />
              <L y={66} text="ref_value = rewards.mean()  // batch norm" color={W} delay={d*3} />
              <L y={86} text="values = torch.where(" color={P} delay={d*4} />
              <L y={101} text="  is_desirable," color={G} delay={d*5} />
              <L y={116} text="  1 - sigmoid(rewards - ref_value)," color={G} delay={d*6} />
              <L y={131} text="  sigmoid(rewards - ref_value) - 1" color={E} delay={d*7} />
              <L y={146} text=")" color={P} delay={d*8} />
              <L y={156} text="loss = (weights * values).mean()" color={G} delay={d*9} bold />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
