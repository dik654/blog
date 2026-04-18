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
  { label: '1. 전처리 & 윈도우 슬라이딩', body: '정규화 → 결측치 처리 → window_size=30으로 X[i], y[i] 생성' },
  { label: '2. 분할 & 배치', body: '시간 순서대로 70/15/15 분할 (셔플 금지)\nbatch shape: (batch, window_size, features)' },
  { label: '3. 학습 & 평가', body: 'MSE loss, Adam lr=1e-3, gradient clipping max_norm=1.0\nRMSE, MAE, MAPE + rolling forecast origin' },
];

export default function TrainingPipelineDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="[1] 데이터 전처리" color={B} delay={0} bold />
              <L y={36} text="raw → 정규화 (StandardScaler / MinMaxScaler)" color={P} delay={d} />
              <L y={51} text="    → 결측치 (forward fill / interpolation)" color={P} delay={d*2} />
              <L y={66} text="    → 계절성 분해 (선택적)" color={P} delay={d*3} />
              <L y={86} text="[2] 윈도우 슬라이딩" color={B} delay={d*4} bold />
              <L y={101} text="window_size = 30   (look-back)" color={W} delay={d*5} />
              <L y={116} text="horizon = 1        (예측 스텝)" color={W} delay={d*6} />
              <L y={136} text="X[i] = data[i : i+30]     // 입력" color={G} delay={d*7} />
              <L y={151} text="y[i] = data[i+30 : i+31]  // 타겟" color={G} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="[3] Train/Val/Test 분할" color={B} delay={0} bold />
              <L y={38} text="시계열은 '시간 순서대로' 분할" color={E} delay={d} bold />
              <L y={53} text="무작위 셔플 금지! (미래 데이터 누출)" color={E} delay={d*2} />
              <L y={68} text="처음 70% train → 15% val → 15% test" color={G} delay={d*3} />
              <L y={93} text="[4] 배치 구성" color={B} delay={d*4} bold />
              <L y={108} text="batch_size = 32 ~ 128" color={W} delay={d*5} />
              <L y={123} text="shape: (batch, window_size, features)" color={P} delay={d*6} />
              <L y={143} text="// 시간 순서 분할 = 시계열의 제1원칙" color={G} delay={d*7} bold />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="[5] 모델 학습" color={B} delay={0} bold />
              <L y={36} text="loss: MSE (회귀) / MAE (이상치 robust)" color={P} delay={d} />
              <L y={51} text="optimizer: Adam (lr=1e-3)" color={P} delay={d*2} />
              <L y={66} text="gradient clipping: max_norm=1.0 (필수)" color={G} delay={d*3} bold />
              <L y={81} text="early stopping: validation loss 기준" color={W} delay={d*4} />
              <L y={101} text="[6] 평가" color={B} delay={d*5} bold />
              <L y={116} text="RMSE, MAE, MAPE (평균 절대 백분율)" color={P} delay={d*6} />
              <L y={131} text="Rolling forecast origin 방식 권장" color={G} delay={d*7} />
              <L y={151} text="// gradient clipping은 LSTM 필수 조건" color={W} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
