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
  { label: '1. 기법별 모델 수·데이터·안정성', body: 'RLHF(4모델) → DPO(2모델) → ORPO(1모델)로 복잡도 감소\n데이터도 pairwise → binary → AI-gen으로 유연화' },
  { label: '2. 각 기법 핵심 요약', body: 'RLHF: 4모델·PPO 불안정 / DPO: RM 제거·classification loss\nCAI: AI 피드백 / ORPO: 1단계 통합 / KTO: 이진 피드백' },
  { label: '3. 진화 방향 4가지', body: '모델 수 감소(4→1), 데이터 유연(binary·AI-gen)\n학습 안정성 개선, 계산 효율 향상' },
];

export default function AlignCompareDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="기법       모델수  데이터     안정성  효율" color={M} delay={0} bold />
              <L y={36} text="RLHF        4     pairwise   낮음   낮음" color={E} delay={d} />
              <L y={51} text="DPO         2     pairwise   중간   중간" color={P} delay={d*2} />
              <L y={66} text="IPO         2     pairwise   중간   중간" color={P} delay={d*3} />
              <L y={81} text="CAI/RLAIF   3-4   AI-gen     낮음   낮음" color={G} delay={d*4} />
              <L y={96} text="ORPO        1     pairwise   높음   높음" color={W} delay={d*5} />
              <L y={111} text="KTO         2     binary     중간   높음" color={B} delay={d*6} />
              <L y={126} text="SimPO       1     pairwise   높음   높음" color={W} delay={d*7} />
              <L y={148} text="// 모델 수 4→1, 안정성·효율 개선 추세" color={G} delay={d*8} bold />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="각 기법 핵심:" color={B} delay={0} bold />
              <L y={38} text="RLHF: Actor+Critic+Reward+Ref, PPO 불안정" color={E} delay={d} />
              <L y={58} text="DPO:  RM 제거, classification loss" color={P} delay={d*2} />
              <L y={73} text="      현재 실무 표준" color={P} delay={d*3} bold />
              <L y={93} text="CAI:  AI 피드백 도입, 확장성 극대화" color={G} delay={d*4} />
              <L y={108} text="      Anthropic Claude의 기반" color={G} delay={d*5} />
              <L y={128} text="ORPO: SFT+정렬 1단계 통합, Ref 불필요" color={W} delay={d*6} />
              <L y={148} text="KTO:  Binary feedback, 행동경제학 영감" color={B} delay={d*7} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="정렬 기법 진화 방향:" color={B} delay={0} bold />
              <L y={43} text="1. 모델 수 감소:  4개 → 2개 → 1개" color={G} delay={d} />
              <L y={63} text="2. 데이터 유연:   pairwise → binary → AI-gen" color={G} delay={d*2} />
              <L y={83} text="3. 학습 안정:     PPO 불안정 → classification" color={G} delay={d*3} />
              <L y={103} text="4. 계산 효율:     GPU 8장 → GPU 1~2장" color={G} delay={d*4} />
              <L y={128} text="// 2024: DPO가 기본, ORPO/KTO가 특수 용도" color={W} delay={d*5} />
              <L y={148} text="// SimPO가 벤치마크 최고 성능" color={P} delay={d*6} bold />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
