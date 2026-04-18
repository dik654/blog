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
  { label: '1. RLHF → DPO 수학적 유도', body: 'KL 제약 하 최적 정책 → reward 역산 → Bradley-Terry에 대입\n정규화 상수 Z(x) 상쇄가 핵심' },
  { label: '2. Z(x) 상쇄와 최종 Loss', body: 'r(x,y_w) - r(x,y_l) 계산 시 Z(x) 항이 소거\n→ Reward Model 없이 정책 직접 학습 가능' },
  { label: '3. PyTorch 구현', body: 'pi_logratios - ref_logratios → beta 곱 → logsigmoid\n코드 10줄 내외로 구현 가능' },
  { label: '4. DPO 변형들', body: 'IPO: squared loss / cDPO: label smoothing / SimPO: ref-free\n2024 벤치마크: SimPO 22.0%로 최고' },
];

export default function DPODerivationDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <g>
              <L y={18} text="RLHF → DPO 유도:" color={B} delay={0} bold />
              <L y={36} text="RLHF 최적 정책 (KL 제약 하):" color={M} delay={d} />
              <L y={51} text="π*(y|x) = (1/Z(x))·π_ref(y|x)·exp(r(x,y)/β)" color={P} delay={d*2} />
              <L y={71} text="역산으로 reward 추출:" color={M} delay={d*3} />
              <L y={86} text="r(x,y) = β·log(π*/π_ref) + β·log Z(x)" color={P} delay={d*4} />
              <L y={106} text="Bradley-Terry 선호 모델:" color={M} delay={d*5} />
              <L y={121} text="P(y_w ≻ y_l | x) = σ(r(x,y_w) - r(x,y_l))" color={P} delay={d*6} />
              <L y={146} text="// r(x,y)를 BT에 대입하면?" color={W} delay={d*7} />
            </g>
          )}
          {step === 1 && (
            <g>
              <L y={18} text="Reward 차이 계산:" color={B} delay={0} bold />
              <L y={36} text="r(x,y_w) - r(x,y_l)" color={P} delay={d} />
              <L y={51} text="= β·log(π*/π_ref)_w - β·log(π*/π_ref)_l" color={P} delay={d*2} />
              <L y={66} text="  + β·log Z(x) - β·log Z(x)" color={W} delay={d*3} />
              <L y={86} text="    ↑ Z(x) 상쇄! 계산 불필요 ↑" color={G} delay={d*4} bold />
              <L y={106} text="최종 DPO Loss:" color={B} delay={d*5} bold />
              <L y={121} text="L = -E[log σ(β·log(π_θ(y_w)/π_ref(y_w))" color={P} delay={d*6} />
              <L y={136} text="             - β·log(π_θ(y_l)/π_ref(y_l)))]" color={P} delay={d*7} />
              <L y={153} text="// RM 없이 classification loss로 정렬!" color={G} delay={d*8} />
            </g>
          )}
          {step === 2 && (
            <g>
              <L y={18} text="PyTorch 구현:" color={B} delay={0} bold />
              <L y={38} text="def dpo_loss(pol_w, pol_l, ref_w, ref_l, β=0.1):" color={W} delay={d} />
              <L y={53} text="  pi_ratio  = pol_w - pol_l" color={P} delay={d*2} />
              <L y={68} text="  ref_ratio = ref_w - ref_l" color={P} delay={d*3} />
              <L y={83} text="  logits = β * (pi_ratio - ref_ratio)" color={P} delay={d*4} />
              <L y={98} text="  loss = -F.logsigmoid(logits).mean()" color={G} delay={d*5} bold />
              <L y={118} text="// rewards for monitoring:" color={M} delay={d*6} />
              <L y={133} text="chosen_rewards  = β*(pol_w - ref_w)" color={W} delay={d*7} />
              <L y={148} text="rejected_rewards= β*(pol_l - ref_l)" color={W} delay={d*8} />
            </g>
          )}
          {step === 3 && (
            <g>
              <L y={18} text="DPO 파생 기법:" color={B} delay={0} bold />
              <L y={36} text="IPO:   squared loss, overfitting 방지" color={P} delay={d} />
              <L y={51} text="cDPO:  label smoothing 추가" color={P} delay={d*2} />
              <L y={66} text="SimPO: reference model 제거 + length norm" color={G} delay={d*3} bold />
              <L y={81} text="DPOP:  generation quality 보존 term" color={P} delay={d*4} />
              <L y={101} text="AlpacaEval 2.0 비교 (Zephyr-7B):" color={W} delay={d*5} />
              <L y={116} text="DPO: 16.8% | IPO: 17.1% | KTO: 17.8%" color={M} delay={d*6} />
              <L y={131} text="SimPO: 22.0% ← 2024 상반기 최고" color={G} delay={d*7} bold />
              <L y={151} text="// β=0.01~0.5, lr=1e-7, epochs 1~3" color={M} delay={d*8} />
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
