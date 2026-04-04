import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Softmax 미분 (i=j)', body: '∂ŷᵢ/∂oᵢ = ŷᵢ(1 − ŷᵢ) — 같은 클래스: sigmoid와 동일한 형태' },
  { label: 'Softmax 미분 (i≠j)', body: '∂ŷᵢ/∂oⱼ = −ŷᵢ · ŷⱼ — 다른 클래스: 교차 항만 남음' },
  { label: '체인룰 합산', body: 'CE 미분 × Softmax 미분을 k=j, k≠j로 분리하여 합산' },
  { label: '최종 결과: ŷ − y', body: '분자·분모 상쇄 + Σyₖ=1 적용 → 예측에서 정답을 빼면 끝' },
];

const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };

export default function SoftmaxDerivViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: i=j case */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={30} y={15} width={340} height={35} rx={6}
                fill="#3b82f615" stroke="#3b82f6" strokeWidth={1} />
              <text x={200} y={28} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
                i = j
              </text>
              <text x={200} y={42} textAnchor="middle" fontSize={10} fontWeight={600}
                className="fill-foreground">
                ∂ŷᵢ/∂oᵢ = ŷᵢ · (1 − ŷᵢ)
              </text>
              <text x={200} y={70} textAnchor="middle" fontSize={9} className="fill-muted-foreground">
                예: ŷ₁=0.7 → 기울기 = 0.7 × 0.3 = 0.21
              </text>
            </motion.g>
          )}

          {/* Step 1: i≠j case */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={30} y={15} width={340} height={35} rx={6}
                fill="#ef444415" stroke="#ef4444" strokeWidth={1} />
              <text x={200} y={28} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ef4444">
                i ≠ j
              </text>
              <text x={200} y={42} textAnchor="middle" fontSize={10} fontWeight={600}
                className="fill-foreground">
                ∂ŷᵢ/∂oⱼ = −ŷᵢ · ŷⱼ
              </text>
              <text x={200} y={70} textAnchor="middle" fontSize={9} className="fill-muted-foreground">
                예: ŷ₁=0.7, ŷ₂=0.2 → 기울기 = −0.7 × 0.2 = −0.14
              </text>
            </motion.g>
          )}

          {/* Step 2: Chain rule */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={20} y={10} width={360} height={30} rx={6}
                fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1} />
              <text x={200} y={30} textAnchor="middle" fontSize={9} fontWeight={600}
                className="fill-foreground">
                ∂L/∂oⱼ = Σₖ (−yₖ/ŷₖ) · ∂ŷₖ/∂oⱼ
              </text>
              <text x={100} y={58} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>k=j: −yⱼ(1−ŷⱼ)</text>
              <text x={300} y={58} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>k≠j: +Σ yₖ·ŷⱼ</text>
              <text x={200} y={80} textAnchor="middle" fontSize={9} className="fill-muted-foreground">
                두 항을 합치면 분자·분모 상쇄 시작
              </text>
            </motion.g>
          )}

          {/* Step 3: Final result */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
              <rect x={80} y={15} width={240} height={45} rx={8}
                fill="#10b98120" stroke="#10b981" strokeWidth={2} />
              <text x={200} y={35} textAnchor="middle" fontSize={12} fontWeight={800} fill="#10b981">
                ∂L/∂oⱼ = ŷⱼ − yⱼ
              </text>
              <text x={200} y={50} textAnchor="middle" fontSize={9} fill="#10b981">
                예측 − 정답, 그게 전부
              </text>
              <text x={200} y={78} textAnchor="middle" fontSize={9} className="fill-muted-foreground">
                예: ŷ=[0.7, 0.2, 0.1], y=[1, 0, 0] → 기울기=[−0.3, 0.2, 0.1]
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
