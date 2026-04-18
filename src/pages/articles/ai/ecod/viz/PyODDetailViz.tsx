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
  { label: '1. PyOD 40+ 알고리즘', body: 'Statistical(ECOD,COPOD), Proximity(KNN,LOF), Tree(IForest)\n통합 API: fit() → predict() → decision_function()' },
  { label: '2. 알고리즘 선택 가이드', body: 'ECOD: n>10K + 해석 | KNN/LOF: 국소 밀도 | IForest: 고차원\nAutoencoder: 이미지/시퀀스 + 복잡 패턴' },
];

export default function PyODDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="PyOD — 40+ 알고리즘 통합:" color={B} delay={0} bold />
              <L y={36} text="Statistical: ECOD, COPOD, HBOS" color={G} delay={d} />
              <L y={51} text="Proximity: KNN, LOF, CBLOF" color={P} delay={d*2} />
              <L y={66} text="Linear: PCA, MCD" color={M} delay={d*3} />
              <L y={81} text="Tree: IForest" color={W} delay={d*4} />
              <L y={96} text="Neural: AE, VAE, SO-GAAL" color={P} delay={d*5} />
              <L y={116} text="통합 API:" color={B} delay={d*6} bold />
              <L y={131} text="clf = Method(contamination=0.1)" color={W} delay={d*7} />
              <L y={146} text="clf.fit(X) → clf.predict(X_test)" color={W} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="알고리즘 선택 가이드:" color={B} delay={0} bold />
              <L y={38} text="ECOD 권장:" color={G} delay={d} bold />
              <L y={53} text="  n>10K + 차원 독립 + 해석 중요 + no-tuning" color={G} delay={d*2} />
              <L y={73} text="KNN/LOF 권장:" color={P} delay={d*3} />
              <L y={88} text="  국소 밀도 변화 + n<10K + 비선형 경계" color={M} delay={d*4} />
              <L y={108} text="Isolation Forest 권장:" color={W} delay={d*5} />
              <L y={123} text="  고차원(d>50) + 빠른 학습 + 범용" color={M} delay={d*6} />
              <L y={143} text="Autoencoder 권장:" color={P} delay={d*7} />
              <L y={153} text="  이미지/시퀀스 + 복잡 패턴 + 대용량" color={M} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
