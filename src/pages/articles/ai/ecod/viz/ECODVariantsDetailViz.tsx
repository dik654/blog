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
  { label: '1. 수치 안정성', body: 'F(x)=0 또는 1 → -log(0) = inf\nF_safe = max(min(F, 1-eps), eps), eps=1e-7' },
  { label: '2. ECOD 변형 & 장단점', body: 'ECOD+: skewness 자동 / COPOD: 상관관계 고려\n장점: training-free / 단점: 차원 독립 가정' },
];

export default function ECODVariantsDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="수치 안정성:" color={B} delay={0} bold />
              <L y={38} text="F(x) = 0 또는 1일 때 -log(0) = ∞" color={E} delay={d} />
              <L y={53} text="해결: F_safe = max(min(F, 1-ε), ε)" color={G} delay={d*2} bold />
              <L y={68} text="  ε = 1e-7" color={G} delay={d*3} />
              <L y={88} text="상수 열 (constant feature):" color={W} delay={d*4} />
              <L y={103} text="모든 값이 같으면 ECDF = step(x)" color={M} delay={d*5} />
              <L y={118} text="해결: 해당 차원 제외 또는 0 점수" color={W} delay={d*6} />
              <L y={143} text="// epsilon clamp은 구현 필수 사항" color={G} delay={d*7} bold />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="ECOD 변형:" color={B} delay={0} bold />
              <L y={36} text="ECOD+ (Auto-Skew): tail 방향 자동 결정" color={P} delay={d} />
              <L y={51} text="COPOD: 차원 간 상관관계 고려 (copula)" color={P} delay={d*2} />
              <L y={66} text="HBOS: 히스토그램 기반 (더 빠름)" color={P} delay={d*3} />
              <L y={81} text="LODA: 온라인 학습, 랜덤 projection" color={P} delay={d*4} />
              <L y={101} text="장점: training-free, hyper-free, 해석 가능" color={G} delay={d*5} bold />
              <L y={121} text="단점:" color={E} delay={d*6} bold />
              <L y={136} text="차원 독립 가정, 비선형 구조 어려움" color={E} delay={d*7} />
              <L y={151} text="국소 밀도 변화 감지 못함 → LOF가 유리" color={E} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
