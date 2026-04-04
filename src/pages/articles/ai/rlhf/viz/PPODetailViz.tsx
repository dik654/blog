import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const d = 0.06;
const R = '#10b981', B = '#3b82f6', W = '#f59e0b', P = '#6366f1', E = '#ef4444';

function Line({ y, text, color, delay = 0, bold }: {
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
  { label: '1. 보상 모델 스코어링', body: '프롬프트 x에 대해 응답 y를 생성하고 보상 모델이 점수를 매김' },
  { label: '2. KL 발산 계산', body: '현재 정책 π_θ와 참조 정책 π_ref의 분포 차이를 수치로 계산' },
  { label: '3. PPO 보상 결합', body: '보상 점수에서 KL 페널티를 빼서 실제 학습 시그널 생성' },
  { label: '4. Clipped Surrogate 계산', body: '정책 비율 r(θ)를 클리핑하여 한 번에 큰 업데이트를 방지' },
  { label: '5. 파라미터 업데이트', body: '클리핑된 목적함수의 기울기로 정책 파라미터를 갱신' },
];

export default function PPODetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <Line y={18} text='x = "요약해줘: ..."   y = "핵심은 ..."' color="var(--muted-foreground)" delay={0} />
              <Line y={38} text="π_θ(y|x)   = 0.035    // 현재 정책의 y 확률" color={B} delay={d} />
              <Line y={53} text="π_ref(y|x)  = 0.028    // SFT 정책의 y 확률" color={P} delay={d * 2} />
              <Line y={73} text="R(x, y)     = 0.82     // 보상 모델 점수" color={R} delay={d * 3} />
              <Line y={93} text="// R > 0.7: 정상 범위 | R < 0.3: 나쁜 응답" color="var(--muted-foreground)" delay={d * 4} />
              <Line y={113} text="// 하지만 R만 최대화하면 보상 해킹 발생" color={E} delay={d * 5} />
              <Line y={128} text="// → KL 페널티로 π_ref에서 너무 멀어지지 못하게" color={W} delay={d * 6} />
            </g>
          )}
          {step === 1 && (
            <g>
              <Line y={18} text="// KL(π_θ ∥ π_ref) 토큰별 계산" color="var(--muted-foreground)" delay={0} />
              <Line y={38} text="token_1: log(0.12 / 0.10) = log(1.20) =  0.182" color={B} delay={d} />
              <Line y={53} text="token_2: log(0.08 / 0.09) = log(0.89) = -0.117" color={B} delay={d * 2} />
              <Line y={68} text="token_3: log(0.15 / 0.11) = log(1.36) =  0.310" color={B} delay={d * 3} />
              <Line y={83} text="token_4: log(0.05 / 0.06) = log(0.83) = -0.186" color={B} delay={d * 4} />
              <Line y={103} text="KL = mean(0.182, -0.117, 0.310, -0.186)" color={P} delay={d * 5} />
              <Line y={118} text="   = 0.047   // 분포 차이 작음 → 정상 범위" color={P} delay={d * 6} bold />
              <Line y={138} text="// KL > 0.5 → 정책 이탈 경고" color="var(--muted-foreground)" delay={d * 7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <Line y={18} text="β = 0.02    // InstructGPT 기본값" color="var(--muted-foreground)" delay={0} />
              <Line y={38} text="R(x, y)  = 0.82         // 보상 점수" color={R} delay={d} />
              <Line y={53} text="KL       = 0.047        // 분포 차이" color={P} delay={d * 2} />
              <Line y={73} text="penalty  = β * KL" color={W} delay={d * 3} />
              <Line y={88} text="         = 0.02 * 0.047 = 0.00094" color={W} delay={d * 4} />
              <Line y={108} text="reward   = R - penalty" color={R} delay={d * 5} />
              <Line y={123} text="         = 0.82 - 0.00094 = 0.8191" color={R} delay={d * 6} bold />
              <Line y={143} text="// 정상 범위 → 페널티 미미 | 이탈 시 급증" color="var(--muted-foreground)" delay={d * 7} />
            </g>
          )}
          {step === 3 && (
            <g>
              <Line y={18} text="// 정책 비율 r(θ)" color="var(--muted-foreground)" delay={0} />
              <Line y={36} text="r(θ) = π_θ(y|x) / π_old(y|x)" color={B} delay={d} />
              <Line y={51} text="     = 0.035 / 0.031 = 1.129" color={B} delay={d * 2} />
              <Line y={71} text="// ε = 0.2 → 허용 범위: [0.8, 1.2]" color="var(--muted-foreground)" delay={d * 3} />
              <Line y={89} text="clip(1.129, 0.8, 1.2)   = 1.129  // 범위 내" color={R} delay={d * 4} />
              <Line y={109} text="A = advantage = 0.8191 - V(x) = 0.8191 - 0.65 = 0.169" color={P} delay={d * 5} />
              <Line y={127} text="L = min(r*A, clip(r)*A)" color={W} delay={d * 6} />
              <Line y={142} text="  = min(1.129*0.169, 1.129*0.169) = 0.1908" color={W} delay={d * 7} bold />
            </g>
          )}
          {step === 4 && (
            <g>
              <Line y={18} text="// 미니배치 평균으로 기울기 계산" color="var(--muted-foreground)" delay={0} />
              <Line y={36} text="L_batch = mean(L₁=0.191, L₂=-0.05, ..., L₈=0.12)" color={W} delay={d} />
              <Line y={51} text="        = 0.083" color={W} delay={d * 2} />
              <Line y={71} text="∇θ L = autograd(L_batch, θ)   // 자동 미분" color={P} delay={d * 3} />
              <Line y={91} text="θ_new = θ + lr * ∇θ L" color={B} delay={d * 4} />
              <Line y={106} text="      = θ + 1e-5 * grad        // 작은 lr" color={B} delay={d * 5} />
              <Line y={128} text="// PPO epochs=4: 같은 배치를 4번 반복 학습" color="var(--muted-foreground)" delay={d * 6} />
              <Line y={143} text="// KL 모니터링 → β 동적 조절 (adaptive)" color="var(--muted-foreground)" delay={d * 7} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
