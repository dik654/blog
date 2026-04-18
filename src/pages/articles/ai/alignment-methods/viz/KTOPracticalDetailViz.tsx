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
  { label: '1. 데이터 유연성 & 불균형', body: 'Thumbs up/down, 평점, click 데이터 직접 활용\nGood:Bad = 1:10 이어도 weight로 균형 조정' },
  { label: '2. 성능 비교 & 효율', body: 'LLaMA-7B: KTO(100%) 7.3 vs DPO(100%) 7.2\nKTO(50%) 7.1 — 절반 데이터로 DPO 수준' },
  { label: '3. 사용 시나리오', body: 'ChatGPT-style thumbs, recommendation, A/B test\nPairwise ranking이 이미 있으면 DPO가 유리' },
];

export default function KTOPracticalDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="데이터 형태 유연성:" color={B} delay={0} bold />
              <L y={36} text="  Thumbs up/down (좋아요/싫어요)" color={G} delay={d} />
              <L y={51} text="  평점 (5점 → 3점 이상 = good)" color={G} delay={d*2} />
              <L y={66} text="  Click/no-click" color={G} delay={d*3} />
              <L y={81} text="  기존 프로덕션 데이터 직접 활용" color={G} delay={d*4} bold />
              <L y={101} text="불균형 데이터 처리:" color={W} delay={d*5} />
              <L y={116} text="  Good:Bad = 1:10 이어도 OK" color={W} delay={d*6} />
              <L y={131} text="  Weight로 균형 조정" color={W} delay={d*7} />
              <L y={146} text="  DPO는 1:1 pair 필수 ← 제약" color={E} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="성능 비교 (LLaMA-7B, Anthropic HH):" color={B} delay={0} bold />
              <L y={43} text="방법      Data     MT-Bench" color={M} delay={d} />
              <L y={63} text="SFT only  100%      6.1" color={M} delay={d*2} />
              <L y={78} text="DPO       100%      7.2" color={P} delay={d*3} />
              <L y={93} text="KTO       100%      7.3" color={G} delay={d*4} bold />
              <L y={108} text="KTO        50%      7.1  ← 효율!" color={G} delay={d*5} bold />
              <L y={128} text="// 데이터 25% 적어도 동등 성능" color={W} delay={d*6} />
              <L y={148} text="// Noisy labels에도 강건" color={G} delay={d*7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="적합한 시나리오:" color={G} delay={0} bold />
              <L y={38} text="  ChatGPT-style thumbs feedback" color={G} delay={d} />
              <L y={53} text="  Recommendation systems" color={G} delay={d*2} />
              <L y={68} text="  Customer review → quality signal" color={G} delay={d*3} />
              <L y={83} text="  A/B test results" color={G} delay={d*4} />
              <L y={103} text="제한 사례:" color={E} delay={d*5} bold />
              <L y={118} text="  Pairwise ranking이 이미 있음 → DPO" color={E} delay={d*6} />
              <L y={133} text="  Subtle quality 차이 (같은 좋음)" color={E} delay={d*7} />
              <L y={153} text="// from trl import KTOTrainer" color={W} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
