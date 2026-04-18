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
  { label: '1. RLAIF 주요 연구', body: 'Google(RLAIF=RLHF), Anthropic(CAI+RLAIF), OpenAI(RBR), Meta(Self-Rewarding)' },
  { label: '2. AI 피드백 품질 & 실무 패턴', body: 'GPT-4 ~85%, Claude 3.5 ~90% agreement\n초기 인간 seed → AI bulk → 인간 QC → 반복' },
];

export default function RLAIFTrendDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="RLAIF 주요 연구:" color={B} delay={0} bold />
              <L y={38} text="Google (2023): RLAIF vs RLHF 동등" color={G} delay={d} />
              <L y={53} text="  AI labels 품질 검증, 비용 1/10" color={G} delay={d*2} />
              <L y={73} text="Anthropic: Claude 3.5 (CAI + RLAIF)" color={P} delay={d*3} />
              <L y={88} text="  13M features, interpretability 선도" color={P} delay={d*4} />
              <L y={108} text="OpenAI: Rule-Based Rewards (RBR)" color={W} delay={d*5} />
              <L y={123} text="  명시적 규칙, safe→unsafe 스펙트럼" color={W} delay={d*6} />
              <L y={143} text="Meta: Self-Rewarding Language Models" color={P} delay={d*7} />
              <L y={153} text="  Self-play 반복, 인간 수준 초과 가능" color={P} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="AI Feedback 품질:" color={B} delay={0} bold />
              <L y={38} text="GPT-4 judge:   ~85% agreement with humans" color={P} delay={d} />
              <L y={53} text="Claude 3.5:    ~90% agreement" color={G} delay={d*2} bold />
              <L y={73} text="한계: 같은 편향 공유, OOD 취약" color={E} delay={d*3} />
              <L y={93} text="실무 패턴:" color={W} delay={d*4} bold />
              <L y={108} text="1. 초기: 인간 라벨 (좋은 seed)" color={W} delay={d*5} />
              <L y={123} text="2. 확장: AI 라벨 (bulk)" color={W} delay={d*6} />
              <L y={138} text="3. 검증: 인간 샘플링 (QC)" color={W} delay={d*7} />
              <L y={153} text="4. 반복: iterative improvement" color={G} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
