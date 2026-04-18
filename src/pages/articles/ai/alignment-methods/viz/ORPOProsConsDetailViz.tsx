import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const d = 0.06;
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', E = '#ef4444', M = 'var(--muted-foreground)';

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
  { label: '1. ORPO 장점 5가지', body: '1단계 통합, Ref 불필요, 메모리 절반, 시간 40% 단축, 구현 단순' },
  { label: '2. 벤치마크 비교', body: '8B AlpacaEval: DPO 15.2% vs ORPO 15.3% (동등)\n학습 시간: SFT+DPO 8시간 vs ORPO 4시간' },
  { label: '3. 사용 권장 & 피해야 할 상황', body: '빠른 실험·7B~13B → ORPO, 70B+·최고 품질 → DPO\nSimPO, DiscoPOP 등 후속 연구 진행 중' },
];

export default function ORPOProsConsDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="ORPO 장점:" color={G} delay={0} bold />
              <L y={38} text="  1단계 (SFT + 정렬 통합)" color={G} delay={d} />
              <L y={53} text="  Reference model 불필요" color={G} delay={d*2} />
              <L y={68} text="  메모리 절약 (모델 1개)" color={G} delay={d*3} />
              <L y={83} text="  학습 시간 단축 (~40%)" color={G} delay={d*4} />
              <L y={98} text="  구현 단순" color={G} delay={d*5} />
              <L y={118} text="ORPO 단점:" color={E} delay={d*6} bold />
              <L y={133} text="  대형 모델(70B+)에서 DPO보다 약간 낮음" color={E} delay={d*7} />
              <L y={148} text="  λ 민감, SFT-pref 데이터 균형 필요" color={E} delay={d*8} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="벤치마크 비교 (8B, AlpacaEval 2.0):" color={B} delay={0} bold />
              <L y={43} text="Base (SFT only):  9.4%" color={M} delay={d} />
              <L y={63} text="DPO:             15.2%" color={B} delay={d*2} />
              <L y={83} text="ORPO:            15.3%  ← 동등!" color={G} delay={d*3} bold />
              <L y={108} text="학습 시간:" color={W} delay={d*4} />
              <L y={123} text="SFT + DPO:  5h + 3h = 8 hours" color={M} delay={d*5} />
              <L y={143} text="ORPO:       4 hours  ← 50% 절약" color={G} delay={d*6} bold />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="사용 권장:" color={G} delay={0} bold />
              <L y={36} text="  빠른 실험/프로토타이핑" color={G} delay={d} />
              <L y={51} text="  작은~중형 모델 (7B~13B)" color={G} delay={d*2} />
              <L y={66} text="  Resource 제약 환경" color={G} delay={d*3} />
              <L y={86} text="피해야 할 상황:" color={E} delay={d*4} bold />
              <L y={101} text="  대형 모델 (70B+)" color={E} delay={d*5} />
              <L y={116} text="  고품질 최우선 / iterative 필요" color={E} delay={d*6} />
              <L y={136} text="후속 연구:" color={W} delay={d*7} />
              <L y={151} text="SimPO(ref-free+norm) DiscoPOP APO" color={W} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
