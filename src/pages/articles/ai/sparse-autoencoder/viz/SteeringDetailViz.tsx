import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const d = 0.06;
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', M = 'var(--muted-foreground)';

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
  { label: '1. Golden Gate Claude 실험', body: '"Golden Gate Bridge" feature를 clamp\n어떤 주제든 Golden Gate Bridge로 연결하는 모델' },
  { label: '2. 응용 4가지', body: 'Safety(위험 억제), Personality(톤 조절)\nBias(편향 억제), Debugging(failure 추적)' },
  { label: '3. GemmaScope & 과제', body: 'Gemma 2 9B + 400 SAEs, 모든 레이어\nfeature 수천만 카탈로그, 자동 labeling, robustness' },
];

export default function SteeringDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text='"Golden Gate Claude" (Anthropic 2024)' color={B} delay={0} bold />
              <L y={38} text='"Golden Gate Bridge" feature를 높게 clamp" ' color={P} delay={d} />
              <L y={58} text='User: "How do I bake cookies?"' color={M} delay={d*2} />
              <L y={73} text='Claude: "...rival the beauty of the' color={W} delay={d*3} />
              <L y={88} text='  Golden Gate Bridge..."' color={W} delay={d*4} />
              <L y={108} text='User: "What is 2+2?"' color={M} delay={d*5} />
              <L y={123} text='Claude: "4, which happens to be the' color={W} delay={d*6} />
              <L y={138} text='  number of cables of the Bridge..."' color={W} delay={d*7} />
              <L y={153} text="// Feature가 인과적 역할 증명" color={G} delay={d*8} bold />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="Feature Steering 응용:" color={B} delay={0} bold />
              <L y={38} text="1. Safety — 위험 feature 억제" color={G} delay={d} />
              <L y={53} text="   기만 탐지 & 차단, harmful output 방지" color={M} delay={d*2} />
              <L y={73} text="2. Personality — 톤/스타일 강화" color={P} delay={d*3} />
              <L y={88} text="   creativity vs precision 조절" color={M} delay={d*4} />
              <L y={108} text="3. Bias — 편향 feature 찾아 억제" color={W} delay={d*5} />
              <L y={123} text="   fairness 개선, representation balance" color={M} delay={d*6} />
              <L y={143} text="4. Debugging — feature 추적으로 원인 분석" color={P} delay={d*7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="GemmaScope (Google DeepMind 2024):" color={B} delay={0} bold />
              <L y={38} text="Gemma 2 9B + 400 SAEs" color={P} delay={d} />
              <L y={53} text="모든 layer, 모든 resolution" color={P} delay={d*2} />
              <L y={68} text="공개 데이터셋 → 연구자 활용 가능" color={G} delay={d*3} />
              <L y={93} text="과제:" color={W} delay={d*4} bold />
              <L y={108} text="  Feature 전체 카탈로그 (수천만)" color={W} delay={d*5} />
              <L y={123} text="  자동 labeling 시스템" color={W} delay={d*6} />
              <L y={138} text="  Adversarial features robustness" color={W} delay={d*7} />
              <L y={153} text="  Real-time steering 가능성" color={W} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
