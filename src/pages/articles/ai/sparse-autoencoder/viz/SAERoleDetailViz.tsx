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
  { label: '1. 문제: Polysemanticity', body: '한 뉴런이 여러 개념에 동시 반응 → 해석 불가\n모델이 뉴런 수보다 많은 개념을 인코딩 (중첩)' },
  { label: '2. SAE 해법: 펼쳐서 분리', body: '작은 dense → 큰 sparse 공간으로 투영\nL1 페널티로 희소성 강제 → 각 dimension = 하나의 개념' },
  { label: '3. 역사적 발전', body: '2014 Word2Vec → 2022 Toy models → 2023 Monosemanticity\n2024 Claude Sonnet 13M features + GPT-4 concepts' },
];

export default function SAERoleDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="문제: Polysemanticity (다의성)" color={B} delay={0} bold />
              <L y={38} text="한 뉴런이 여러 개념에 동시 반응" color={M} delay={d} />
              <L y={53} text="→ 해석 불가" color={M} delay={d*2} />
              <L y={73} text="가설: Superposition (중첩)" color={B} delay={d*3} bold />
              <L y={93} text="뉴런 수 < 학습된 개념 수" color={P} delay={d*4} />
              <L y={108} text="→ 거의 직교하는 방향에 개념 저장" color={P} delay={d*5} />
              <L y={128} text="// 효율적이지만 해석하기 어려움" color={W} delay={d*6} />
              <L y={148} text="// SAE로 '풀어내기(untangle)' 필요" color={G} delay={d*7} bold />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text='SAE 해법: "펼쳐서 분리"' color={G} delay={0} bold />
              <L y={38} text="작은 dense (d=2304)" color={M} delay={d} />
              <L y={53} text="→ 큰 sparse 공간 (D=16,384)" color={P} delay={d*2} />
              <L y={73} text="L1 페널티로 희소성 강제" color={W} delay={d*3} />
              <L y={88} text="→ 각 dimension = 하나의 개념" color={G} delay={d*4} bold />
              <L y={108} text="결과물:" color={B} delay={d*5} />
              <L y={123} text="  Monosemantic features (단일 의미)" color={G} delay={d*6} />
              <L y={138} text="  Interpretable directions" color={G} delay={d*7} />
              <L y={153} text="  인과적 개입 가능 (steering)" color={G} delay={d*8} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="역사적 발전:" color={B} delay={0} bold />
              <L y={38} text="2014  Word2Vec analogy 발견" color={M} delay={d} />
              <L y={53} text="2021  Transformer circuits framework" color={M} delay={d*2} />
              <L y={68} text="2022  Toy models of superposition" color={P} delay={d*3} />
              <L y={83} text="2023  Towards Monosemanticity (첫 SAE)" color={G} delay={d*4} bold />
              <L y={98} text="2024  Claude Sonnet 13M features" color={G} delay={d*5} bold />
              <L y={113} text="2024  GPT-4 concepts (OpenAI)" color={P} delay={d*6} />
              <L y={133} text="영향: 새로운 AI 안전 패러다임" color={W} delay={d*7} />
              <L y={148} text="Feature Steering 상용화 가능" color={W} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
