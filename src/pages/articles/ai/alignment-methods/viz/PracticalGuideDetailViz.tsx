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
  { label: '1. 상황별 선택 가이드', body: 'Research → DPO, 빠른 반복 → ORPO, thumbs 데이터 → KTO\n인간 라벨 불가 → CAI/RLAIF, 최고 성능 → RLHF' },
  { label: '2. Hybrid + 평가 지표', body: 'SFT → DPO → RLHF iterative, Self-play, Online DPO\nMT-Bench, AlpacaEval 2.0, Arena, HH-RLHF' },
  { label: '3. 2024 오픈소스 현황', body: 'LLaMA-3-Instruct, Zephyr-7B, Mistral-Instruct: DPO 채택\nQwen2-Chat: DPO + PPO hybrid' },
];

export default function PracticalGuideDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="언제 무엇을?" color={B} delay={0} bold />
              <L y={38} text="Research/Benchmark:     → DPO (reproducible)" color={P} delay={d} />
              <L y={53} text="Production 빠른 반복:   → ORPO (1 step)" color={W} delay={d*2} />
              <L y={68} text="thumbs-up/down 데이터:  → KTO (binary)" color={B} delay={d*3} />
              <L y={83} text="인간 라벨 불가:         → CAI / RLAIF" color={G} delay={d*4} />
              <L y={98} text="최고 성능 + 자원 충분:  → RLHF" color={P} delay={d*5} />
              <L y={118} text="대형 모델 (70B+):       → DPO 또는 RLHF" color={P} delay={d*6} />
              <L y={138} text="// ORPO는 70B+에서 성능 저하 관측됨" color={M} delay={d*7} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="Hybrid Approaches (2024):" color={B} delay={0} bold />
              <L y={36} text="SFT → DPO → RLHF (iterative)" color={P} delay={d} />
              <L y={51} text="SPPO (Self-Play Preference Optimization)" color={P} delay={d*2} />
              <L y={66} text="Iterative DPO with on-policy data" color={P} delay={d*3} />
              <L y={81} text="Online DPO (real-time updates)" color={P} delay={d*4} />
              <L y={101} text="평가 지표:" color={W} delay={d*5} bold />
              <L y={116} text="MT-Bench(다중 턴)  AlpacaEval(명령)" color={W} delay={d*6} />
              <L y={131} text="Arena(실사용자)    HH-RLHF(H+H)" color={W} delay={d*7} />
              <L y={146} text="MMLU(지식)         TruthfulQA(사실)" color={W} delay={d*8} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="2024 오픈소스 현황:" color={B} delay={0} bold />
              <L y={38} text="LLaMA-3-Instruct:  DPO" color={G} delay={d} />
              <L y={53} text="Zephyr-7B:         DPO" color={G} delay={d*2} />
              <L y={68} text="Tulu-2:            DPO variants" color={G} delay={d*3} />
              <L y={83} text="Mistral-Instruct:  DPO" color={G} delay={d*4} />
              <L y={98} text="Qwen2-Chat:        DPO + PPO hybrid" color={P} delay={d*5} />
              <L y={123} text="// DPO가 사실상 표준" color={G} delay={d*6} bold />
              <L y={148} text="// 2025: iterative DPO + RLAIF 조합 증가" color={W} delay={d*7} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
