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
  { label: '1. 평가 지표 4가지', body: 'ROC-AUC (threshold 독립), PR-AUC (불균형 유리)\nPrecision@K (검토 자원 제한), F1 (조화평균)' },
  { label: '2. 실무 체크리스트 & 앙상블', body: '전처리 → 학습 → 평가 → 배포 4단계\n여러 모델 점수 평균으로 앙상블 권장' },
];

export default function EvalDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="이상 탐지 평가 지표:" color={B} delay={0} bold />
              <L y={38} text="1. ROC-AUC — threshold 독립, 0.5~1.0" color={P} delay={d} />
              <L y={53} text="2. PR-AUC — 불균형(<5% 이상치)에 유리" color={P} delay={d*2} />
              <L y={68} text="3. Precision@K — 상위 K개 정밀도" color={W} delay={d*3} />
              <L y={83} text="   실무에서 중요 (검토 자원 제한)" color={W} delay={d*4} />
              <L y={98} text="4. F1-score — Precision·Recall 조화평균" color={P} delay={d*5} />
              <L y={123} text="// 이상치 비율 < 5%: PR-AUC가 더 신뢰" color={G} delay={d*6} bold />
              <L y={143} text="// Precision@K: '상위 100개 중 진짜?'" color={W} delay={d*7} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="실무 체크리스트:" color={B} delay={0} bold />
              <L y={36} text="[전처리] 스케일링, Categorical→One-hot" color={P} delay={d} />
              <L y={51} text="[학습]   contamination 추정, validation" color={P} delay={d*2} />
              <L y={66} text="[평가]   다양한 임계값, 앙상블" color={P} delay={d*3} />
              <L y={81} text="[배포]   드리프트 모니터링, 재학습" color={P} delay={d*4} />
              <L y={101} text="앙상블 패턴:" color={G} delay={d*5} bold />
              <L y={116} text="clfs = [ECOD(), IForest(), KNN()]" color={W} delay={d*6} />
              <L y={131} text="scores = mean(clf.decision_function)" color={W} delay={d*7} />
              <L y={151} text="// 단일 모델보다 앙상블이 더 robust" color={G} delay={d*8} bold />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
