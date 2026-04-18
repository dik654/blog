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
  { label: '1. hidden_size & num_layers', body: '소규모: 32~64, 대형: 128~256\n1층: 간단 패턴, 2층: 일반적, 3층+: 과적합 위험' },
  { label: '2. dropout & window_size', body: 'dropout 0.1~0.3 (레이어 간), variational은 시간축\nwindow_size: 데이터 주기성에 맞춤 (30, 365 등)' },
  { label: '3. Bi-LSTM & Stacked LSTM', body: 'Bi-LSTM: NLP 유리, 실시간 예측 불가 (미래 필요)\nStacked: 중간 레이어에 return_sequences=True 필수' },
];

export default function ArchDesignDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="hidden_size 가이드:" color={B} delay={0} bold />
              <L y={36} text="32, 64:    작은 데이터셋 (과적합 방지)" color={G} delay={d} />
              <L y={51} text="128, 256:  대형 데이터셋" color={P} delay={d*2} />
              <L y={71} text="num_layers 가이드:" color={B} delay={d*3} bold />
              <L y={89} text="1층: 간단한 패턴, 빠른 학습" color={G} delay={d*4} />
              <L y={104} text="2층: 일반적 선택 (성능/속도 균형)" color={G} delay={d*5} bold />
              <L y={119} text="3층+: 복잡한 패턴, 과적합 위험 증가" color={W} delay={d*6} />
              <L y={143} text="// 데이터 크기에 비례하여 결정" color={M} delay={d*7} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="dropout: 0.1 ~ 0.3" color={B} delay={0} bold />
              <L y={36} text="레이어 간에만 적용 (시간축 X)" color={M} delay={d} />
              <L y={51} text="variational dropout: 시간축 적용 가능" color={W} delay={d*2} />
              <L y={71} text="window_size: 데이터 주기성에 맞춤" color={B} delay={d*3} bold />
              <L y={89} text="일별 데이터:   30 (한 달) or 365 (1년)" color={P} delay={d*4} />
              <L y={104} text="시간별:        24 or 168 (일주일)" color={P} delay={d*5} />
              <L y={119} text="분 단위:       60 or 1440 (하루)" color={P} delay={d*6} />
              <L y={143} text="// 주기성 파악이 window 설정의 핵심" color={W} delay={d*7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="Bidirectional LSTM (Bi-LSTM):" color={B} delay={0} bold />
              <L y={36} text="forward + backward LSTM을 concat" color={P} delay={d} />
              <L y={51} text="NLP: 유리 (양쪽 문맥)" color={G} delay={d*2} />
              <L y={66} text="실시간 예측: 사용 불가 (미래 필요)" color={E} delay={d*3} bold />
              <L y={81} text="오프라인 분석·이상 탐지에만 활용" color={W} delay={d*4} />
              <L y={101} text="Stacked LSTM 주의:" color={B} delay={d*5} bold />
              <L y={119} text="중간 레이어: return_sequences=True 필수" color={E} delay={d*6} bold />
              <L y={134} text="마지막 레이어만: return_sequences=False" color={G} delay={d*7} />
              <L y={153} text="// 안 지키면 shape mismatch 에러" color={M} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
