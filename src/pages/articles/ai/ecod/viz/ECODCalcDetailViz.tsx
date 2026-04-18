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
  { label: '1. ECDF 계산 (각 차원)', body: 'Feature 1: [1.0,2.0,2.5,3.0,100] → F_1(100)=1.0\nFeature 2: [10,11,12,15,500] → F_2(500)=1.0' },
  { label: '2. 꼬리 점수 계산', body: 'Sample 0: O_left=-log(0.2)=1.609 / O_right=-log(0.8)=0.223\nmax → 합산 → Total O(0) = 3.218' },
  { label: '3. 이상치 판정', body: 'Sample 4 (x=100, y=500): O_right ≈ 매우 큼\nTotal ≫ 나머지 → 이상치로 판정' },
];

export default function ECODCalcDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="데이터: 5 samples × 2 features" color={B} delay={0} bold />
              <L y={36} text="[[1.0,10],[2.0,12],[2.5,11],[3.0,15],[100,500]]" color={M} delay={d} />
              <L y={56} text="Feature 1 ECDF:" color={P} delay={d*2} bold />
              <L y={71} text="F(1.0)=0.2  F(2.0)=0.4  F(2.5)=0.6" color={P} delay={d*3} />
              <L y={86} text="F(3.0)=0.8  F(100)=1.0" color={P} delay={d*4} />
              <L y={106} text="Feature 2 ECDF:" color={W} delay={d*5} bold />
              <L y={121} text="F(10)=0.2  F(11)=0.4  F(12)=0.6" color={W} delay={d*6} />
              <L y={136} text="F(15)=0.8  F(500)=1.0" color={W} delay={d*7} />
              <L y={153} text="// sample 4 (100,500): 양쪽 다 꼬리" color={E} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="Sample 0 (x=1.0, y=10):" color={B} delay={0} bold />
              <L y={38} text="O_left(0,1)  = -log(0.2)   = 1.609" color={P} delay={d} />
              <L y={53} text="O_right(0,1) = -log(1-0.2)  = 0.223" color={P} delay={d*2} />
              <L y={68} text="O_left(0,2)  = -log(0.2)   = 1.609" color={W} delay={d*3} />
              <L y={83} text="O_right(0,2) = -log(1-0.2)  = 0.223" color={W} delay={d*4} />
              <L y={103} text="max_1 = 1.609,  max_2 = 1.609" color={G} delay={d*5} />
              <L y={123} text="Total O(0) = 1.609 + 1.609 = 3.218" color={G} delay={d*6} bold />
              <L y={148} text="// 좌측 꼬리이지만 극단적이지 않음" color={M} delay={d*7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="Sample 4 (x=100, y=500):" color={E} delay={0} bold />
              <L y={38} text="O_left(4,1) = -log(1.0)    = 0.0" color={M} delay={d} />
              <L y={53} text="O_right(4,1)= -log(1-1.0+ε) ≈ 매우 큼" color={E} delay={d*2} bold />
              <L y={73} text="max_1 ≈ 매우 큼" color={E} delay={d*3} />
              <L y={88} text="max_2 ≈ 매우 큼" color={E} delay={d*4} />
              <L y={108} text="Total O(4) = 매우 큼" color={E} delay={d*5} bold />
              <L y={128} text="→ 이상치로 판정" color={E} delay={d*6} bold />
              <L y={148} text="// epsilon clamp 필수 (ε = 1e-7)" color={W} delay={d*7} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
