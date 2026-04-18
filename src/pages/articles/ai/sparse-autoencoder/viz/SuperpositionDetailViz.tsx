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
  { label: '1. 중첩 가설 — 관찰과 수학', body: '뉴런 수 N < 개념 수 M → 거의 직교 방향에 인코딩\nd차원에서 정확히 직교: d개, 거의 직교: 지수적 많이' },
  { label: '2. Sparsity와 Feature 시각화', body: '각 입력이 소수 feature만 활성화 → 충돌 확률 낮음\nBefore SAE: 의미 불명 / After SAE: "Golden Gate Bridge"' },
  { label: '3. 중첩의 이점과 비용', body: '이점: 효율적 표현, Generalization\n비용: 해석 어려움(SAE 해결), Feature 간 간섭' },
];

export default function SuperpositionDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="Superposition 가설 (Elhage 2022)" color={B} delay={0} bold />
              <L y={38} text="관찰: 한 뉴런이 관련 없는 개념에 동시 반응" color={M} delay={d} />
              <L y={53} text='"gypsum board", "Oscar Wilde", "stock prices"' color={E} delay={d*2} />
              <L y={73} text="가설: 뉴런 수 N < 학습 개념 수 M" color={P} delay={d*3} bold />
              <L y={88} text="→ 거의 직교 방향에 M개 개념 인코딩" color={P} delay={d*4} />
              <L y={108} text="수학적 직관:" color={W} delay={d*5} />
              <L y={123} text="d차원: 정확히 직교 = d개" color={M} delay={d*6} />
              <L y={138} text="거의 직교(각도<ε): 지수적 많이 가능!" color={G} delay={d*7} bold />
              <L y={153} text="// Johnson-Lindenstrauss lemma" color={M} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="Sparsity와 Superposition:" color={B} delay={0} bold />
              <L y={36} text="각 입력이 소수의 feature만 활성화" color={G} delay={d} />
              <L y={51} text="→ 충돌 확률 낮음 → 안전한 중첩" color={G} delay={d*2} />
              <L y={71} text="Feature 시각화 비교:" color={W} delay={d*3} bold />
              <L y={89} text="Before SAE (뉴런 1234):" color={E} delay={d*4} />
              <L y={104} text='  "Golden Gate...", "quarterly earnings..."' color={E} delay={d*5} />
              <L y={119} text="  → 의미 불명" color={E} delay={d*6} />
              <L y={134} text="After SAE (feature 5678):" color={G} delay={d*7} />
              <L y={149} text='  "Golden Gate Bridge" 전부 → 단일 개념!' color={G} delay={d*8} bold />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="중첩의 이점:" color={G} delay={0} bold />
              <L y={38} text="  제한된 파라미터로 많은 개념 표현" color={G} delay={d} />
              <L y={53} text="  효율적 학습" color={G} delay={d*2} />
              <L y={68} text="  Generalization 촉진" color={G} delay={d*3} />
              <L y={88} text="중첩의 비용:" color={E} delay={d*4} bold />
              <L y={108} text="  해석 어려움 (SAE로 해결)" color={E} delay={d*5} />
              <L y={123} text="  Interference (충돌)" color={E} delay={d*6} />
              <L y={138} text="  Feature 간 간섭" color={E} delay={d*7} />
              <L y={153} text="// SAE가 이 비용을 역공학적으로 해소" color={W} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
