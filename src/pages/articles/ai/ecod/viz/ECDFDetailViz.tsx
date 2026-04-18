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
  { label: '1. ECDF 정의', body: 'F_n(x) = (1/n)·Σ I(X_i ≤ x) — x보다 작거나 같은 비율\n비모수적, 계단 함수, n→∞ 시 실제 CDF에 수렴' },
  { label: '2. 수치 예시', body: '데이터 [1,3,3,5,7,9,100] → F(100)=1.00 → 우측 꼬리\nx=100 → 매우 이상 / x=5 → 중앙 → 정상' },
  { label: '3. -log 변환 & 다차원 확장', body: 'p=0.001 → score=6.9, p=0.5 → score=0.7\n각 차원 max(O_left, O_right) → 합산' },
];

export default function ECDFDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="ECDF (Empirical CDF):" color={B} delay={0} bold />
              <L y={38} text='F_n(x) = (1/n) · Σ I(X_i ≤ x)' color={P} delay={d} />
              <L y={53} text='"x보다 작거나 같은 관측값의 비율"' color={M} delay={d*2} />
              <L y={73} text="특성:" color={W} delay={d*3} />
              <L y={88} text="  비모수적 (분포 가정 없음)" color={G} delay={d*4} />
              <L y={103} text="  계단 함수 (step function)" color={G} delay={d*5} />
              <L y={118} text="  n → ∞일 때 실제 CDF에 수렴" color={G} delay={d*6} />
              <L y={143} text="// 어떤 분포든 적용 가능" color={W} delay={d*7} bold />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="수치 예시 (1차원):" color={B} delay={0} bold />
              <L y={36} text="데이터: [1, 3, 3, 5, 7, 9, 100]" color={M} delay={d} />
              <L y={56} text="F(1)=0.14  F(3)=0.43  F(5)=0.57" color={P} delay={d*2} />
              <L y={71} text="F(7)=0.71  F(9)=0.86  F(100)=1.00" color={P} delay={d*3} />
              <L y={91} text="Tail Probability로 이상 점수:" color={W} delay={d*4} bold />
              <L y={106} text="x=100 → F=1.00 → 우측 꼬리 ≈ 0" color={E} delay={d*5} bold />
              <L y={121} text="→ 매우 이상" color={E} delay={d*6} />
              <L y={141} text="x=5 → F=0.57 → 중앙 근처 → 정상" color={G} delay={d*7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="-log(p) 변환:" color={B} delay={0} bold />
              <L y={36} text="p=0.001  → score=6.9  (극단)" color={E} delay={d} bold />
              <L y={51} text="p=0.01   → score=4.6" color={W} delay={d*2} />
              <L y={66} text="p=0.1    → score=2.3" color={P} delay={d*3} />
              <L y={81} text="p=0.5    → score=0.7  (정상)" color={G} delay={d*4} />
              <L y={101} text="→ 꼬리일수록 급격히 증가" color={W} delay={d*5} bold />
              <L y={121} text="다차원 확장:" color={B} delay={d*6} />
              <L y={136} text="Σ_j max(O_left, O_right)" color={P} delay={d*7} />
              <L y={151} text="각 차원에서 가장 극단적 → 독립 합산" color={M} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
