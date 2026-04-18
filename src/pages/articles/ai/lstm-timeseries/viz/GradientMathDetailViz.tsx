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
  { label: '1. RNN 역전파의 기울기 연쇄', body: '∂L/∂h_0 = ∂L/∂h_T × ∏ ∂h_t/∂h_{t-1}\n야코비안의 곱이 T 스텝 동안 누적' },
  { label: '2. 소실 vs 폭발 조건', body: 'ρ(W)×tanh_max < 1 → 소실 (0으로 수렴)\nρ(W)×tanh_max > 1 → 폭발 (무한대로 발산)' },
  { label: '3. 실무에서의 영향', body: 'T=100이면 50스텝 이전 영향력이 10^-10 수준으로 소멸\n장기 의존성 학습이 구조적으로 불가능' },
  { label: '4. LSTM의 해결 방식', body: '∂C_t/∂C_{t-1} = f_t (forget gate)\nadditive update로 기울기 고속도로 형성' },
];

export default function GradientMathDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="RNN 역전파 기울기 계산:" color={B} delay={0} bold />
              <L y={38} text="∂L/∂h_0 = ∂L/∂h_T × ∏(t=1→T) ∂h_t/∂h_{t-1}" color={P} delay={d} />
              <L y={58} text="각 시점의 야코비안(Jacobian):" color={M} delay={d*2} />
              <L y={73} text="∂h_t/∂h_{t-1} = diag(tanh'(z_t)) · W_hh" color={P} delay={d*3} />
              <L y={93} text="tanh'(x) = 1 - tanh²(x) ≤ 1" color={W} delay={d*4} />
              <L y={113} text="스펙트럼 반경 ρ(W) 기준:" color={M} delay={d*5} />
              <L y={128} text="기울기 크기 ≤ ρ(W)^T × (tanh'_max)^T" color={E} delay={d*6} bold />
              <L y={148} text="// T가 커질수록 지수적으로 변화" color={M} delay={d*7} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="T가 커질수록 두 경우 발생:" color={B} delay={0} bold />
              <L y={43} text="1) ρ(W)×tanh_max < 1" color={E} delay={d} />
              <L y={63} text="   → 기울기 소실 (0으로 수렴)" color={E} delay={d*2} bold />
              <L y={88} text="2) ρ(W)×tanh_max > 1" color={W} delay={d*3} />
              <L y={108} text="   → 기울기 폭발 (무한대로 발산)" color={W} delay={d*4} bold />
              <L y={133} text="Xavier 초기화: ρ(W) ≈ 1 근처" color={M} delay={d*5} />
              <L y={148} text="sigmoid/tanh 포화 영역: 미분값 ≪ 1" color={M} delay={d*6} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="실무 영향:" color={B} delay={0} bold />
              <L y={38} text="시퀀스 길이 T = 100 이상이면:" color={M} delay={d} />
              <L y={58} text="50스텝 이전의 영향력 ≈ 10⁻¹⁰" color={E} delay={d*2} bold />
              <L y={78} text="→ 사실상 0 — 장기 의존성 학습 불가" color={E} delay={d*3} />
              <L y={103} text="예: '어제 비가 왔으므로 ... (50단어) ... 우산'" color={M} delay={d*4} />
              <L y={118} text="  → '어제'의 기울기가 '우산'에 전달 안 됨" color={E} delay={d*5} />
              <L y={143} text="// 이것이 RNN의 구조적 한계" color={W} delay={d*6} bold />
            </g>
          )}
          {step === 3 && (
            <g>
              <L y={18} text="LSTM의 해결 방식:" color={G} delay={0} bold />
              <L y={38} text="셀 상태 경로:" color={M} delay={d} />
              <L y={53} text="∂C_t/∂C_{t-1} = f_t  (forget gate 값)" color={G} delay={d*2} bold />
              <L y={73} text="f_t ≈ 1이면 기울기 거의 감쇠 없이 전달" color={G} delay={d*3} />
              <L y={93} text="핵심: additive update 구조" color={B} delay={d*4} />
              <L y={108} text="C_t = f_t·C_{t-1} + i_t·C_tilde" color={P} delay={d*5} />
              <L y={123} text="     └── 보존 ──┘   └── 추가 ──┘" color={M} delay={d*6} />
              <L y={148} text="// 곱셈→덧셈: 기울기 고속도로 형성" color={G} delay={d*7} bold />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
