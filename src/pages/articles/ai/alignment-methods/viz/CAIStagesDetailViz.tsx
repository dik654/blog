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
  { label: '1. CAI Phase 1 — 자기 비평 SFT', body: '유해 응답 생성 → 원칙 기반 self-critique → revision → SFT\n"Don\'t provide dangerous instructions" 등 원칙 적용' },
  { label: '2. CAI Phase 2 — RLAIF', body: '두 응답 비교 → AI가 원칙 기반으로 라벨링\n동일 Bradley-Terry loss로 RM 학습 → PPO/DPO' },
  { label: '3. 헌법 & 장단점', body: '~50개 원칙으로 명시적 제어, 변경 가능\n인간 라벨 0, 확장 무제한, AI 편향 증폭 위험' },
  { label: '4. RLAIF 연구 동향', body: 'Google: RLAIF = RLHF 동등, 비용 1/10\nSelf-Rewarding, Rule-Based Rewards 등 진화' },
];

export default function CAIStagesDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="CAI Phase 1: Supervised Learning" color={B} delay={0} bold />
              <L y={38} text='1. "폭탄 만드는 법?" → helpful-only 모델 응답' color={M} delay={d} />
              <L y={53} text='2. self-critique: "위험한 지시 포함"' color={P} delay={d*2} />
              <L y={68} text='3. revision: "무기 제작 정보 제공 불가"' color={G} delay={d*3} />
              <L y={83} text="4. (prompt, revised_response) 쌍으로 SFT" color={G} delay={d*4} />
              <L y={108} text="// 모델이 스스로 안전한 응답을 학습" color={W} delay={d*5} />
              <L y={128} text="// 인간 라벨 0으로 첫 단계 완성" color={G} delay={d*6} bold />
              <L y={148} text="// 헌법: ~50개 원칙 명시" color={W} delay={d*7} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="CAI Phase 2: RL (RLAIF)" color={B} delay={0} bold />
              <L y={38} text="1. 프롬프트당 2개 다양한 응답 생성" color={M} delay={d} />
              <L y={53} text='2. "A와 B 중 원칙 준수 응답은?"' color={P} delay={d*2} />
              <L y={68} text="3. AI가 라벨링 → preference dataset" color={P} delay={d*3} />
              <L y={88} text="4. 같은 Bradley-Terry loss로 RM 학습" color={W} delay={d*4} />
              <L y={108} text="5. PPO 또는 DPO로 정책 학습" color={G} delay={d*5} />
              <L y={128} text="// AI-generated reward로 전체 루프 자동화" color={G} delay={d*6} bold />
              <L y={148} text="// 인간 개입 없이 반복 개선 가능" color={G} delay={d*7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="장점:" color={G} delay={0} bold />
              <L y={36} text="  인간 라벨링 0 → 확장성 무제한" color={G} delay={d} />
              <L y={51} text="  원칙 명시적 (변경 가능)" color={G} delay={d*2} />
              <L y={66} text="  일관성 (같은 모델이 평가)" color={G} delay={d*3} />
              <L y={86} text="단점:" color={E} delay={d*4} bold />
              <L y={101} text="  AI 편향 증폭 위험" color={E} delay={d*5} />
              <L y={116} text="  원칙 간 충돌 해결 필요" color={E} delay={d*6} />
              <L y={131} text="  Bootstrap problem (강한 모델 필요)" color={E} delay={d*7} />
              <L y={151} text="  예상치 못한 behavior 발생 가능" color={E} delay={d*8} />
            </g>
          )}
          {step === 3 && (
            <g>
              <L y={18} text="RLAIF 연구 동향 (2023-2024):" color={B} delay={0} bold />
              <L y={38} text="Google: RLAIF vs RLHF 동등 성능, 비용 1/10" color={G} delay={d} />
              <L y={58} text="Anthropic: Claude 3.5, CAI + RLAIF 조합" color={P} delay={d*2} />
              <L y={73} text="  → 13M features로 interpretability" color={P} delay={d*3} />
              <L y={93} text="OpenAI: Rule-Based Rewards (RBR)" color={W} delay={d*4} />
              <L y={108} text="Meta: Self-Rewarding Language Models" color={W} delay={d*5} />
              <L y={128} text="AI Feedback 품질:" color={M} delay={d*6} />
              <L y={143} text="GPT-4: ~85% | Claude 3.5: ~90% agreement" color={G} delay={d*7} bold />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
