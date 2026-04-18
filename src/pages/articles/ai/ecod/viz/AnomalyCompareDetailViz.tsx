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
  { label: '1. 이상 탐지 알고리즘 비교', body: 'ECOD: O(n·d), 매우 높은 해석성, training-free\nIsolation Forest O(n log n), LOF O(n^2), Autoencoder O(n·E)' },
  { label: '2. 사용 사례 6가지', body: '네트워크 보안(DDoS), 금융 사기, 제조 품질\n의료 희귀 질환, IoT 센서, 로그 분석' },
];

export default function AnomalyCompareDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="알고리즘       기반    복잡도     해석성" color={M} delay={0} bold />
              <L y={36} text="Isolation Forest 트리  O(n log n) 중간" color={P} delay={d} />
              <L y={51} text="LOF           거리   O(n²)     높음" color={P} delay={d*2} />
              <L y={66} text="One-Class SVM kernel O(n²~n³)  낮음" color={M} delay={d*3} />
              <L y={81} text="Autoencoder   신경망  O(n·E)    낮음" color={M} delay={d*4} />
              <L y={96} text="ECOD          통계   O(n·d)    매우높음" color={G} delay={d*5} bold />
              <L y={111} text="HBOS          히스토  O(n·d)    높음" color={P} delay={d*6} />
              <L y={131} text="ECOD 장점: training-free, 하이퍼파라미터 0" color={G} delay={d*7} bold />
              <L y={148} text="수학적 기반 명확, 대규모 확장성 우수" color={G} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="주요 사용 사례:" color={B} delay={0} bold />
              <L y={38} text="1. 네트워크 보안 — DDoS, 비정상 트래픽" color={P} delay={d} />
              <L y={53} text="2. 금융 사기 — 신용카드, 자금 세탁" color={P} delay={d*2} />
              <L y={68} text="3. 제조 품질 — 결함 탐지, 공정 이상" color={W} delay={d*3} />
              <L y={83} text="4. 의료 — 희귀 질환, 비정상 심전도" color={W} delay={d*4} />
              <L y={98} text="5. IoT 센서 — 장비 이상, 예방 정비" color={G} delay={d*5} />
              <L y={113} text="6. 로그 분석 — 시스템 오류, 사용자 이상" color={G} delay={d*6} />
              <L y={138} text="// ECOD: 대규모(n>100K)·해석·즉시 사용" color={G} delay={d*7} bold />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
