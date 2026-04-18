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
  { label: 'Forward Propagation 수식', body: 'z = W·a + b (선형 변환) → a = activation(z) (비선형)\n이 쌍이 MLP의 최소 반복 단위' },
];

export default function ForwardPropDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="l번째 층의 계산 (벡터화):" color={B} delay={0} bold />
              <L y={43} text="z^(l) = W^(l) · a^(l-1) + b^(l)" color={P} delay={d} />
              <L y={58} text="  // 선형 변환" color={M} delay={d*2} />
              <L y={78} text="a^(l) = activation(z^(l))" color={G} delay={d*3} />
              <L y={93} text="  // 비선형 활성화" color={M} delay={d*4} />
              <L y={118} text="W^(l): [다음_층_크기 × 현재_층_크기]" color={W} delay={d*5} />
              <L y={133} text="b^(l): 편향 벡터" color={W} delay={d*6} />
              <L y={148} text="a^(0) = 입력 x" color={W} delay={d*7} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
