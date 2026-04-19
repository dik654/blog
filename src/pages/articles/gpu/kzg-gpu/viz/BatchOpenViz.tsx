import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox } from '@/components/viz/boxes';

const COL_INPUT = '#0ea5e9';
const COL_LIN = '#10b981';
const COL_DIV = '#f59e0b';
const COL_OUT = '#8b5cf6';

const STEPS = [
  { label: '입력: k개 다항식 p₁..pₖ과 평가값 v₁..vₖ (모두 같은 점 z에서)' },
  { label: 'Fiat-Shamir: 챌린지 γ를 verifier로부터 추출' },
  { label: 'h(x) = p₁(x) + γ·p₂(x) + … + γ^(k-1)·pₖ(x) — GPU 벡터 연산 O(k·n)' },
  { label: 'q(x) = (h(x) - w) / (x - z), w = Σ γⁱvᵢ — GPU synthetic division' },
  { label: 'π = Commit(q) — MSM 1회로 k개 다항식의 증명을 G1 점 1개로 압축!' },
];

export default function BatchOpenViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* k polynomials */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <text x={20} y={14} fontSize={10} fontWeight={700} fill={COL_INPUT}>입력: k개 다항식</text>
            {[1, 2, 3, 4].map((i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: step >= 0 ? 1 : 0.22, x: 0 }}
                transition={{ duration: 0.25, delay: (i - 1) * 0.05 }}
              >
                <DataBox x={20 + (i - 1) * 90} y={20} w={80} h={26} label={`p_${i}(x)`} color={COL_INPUT} />
                <text x={60 + (i - 1) * 90} y={58} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">v_{i}</text>
              </motion.g>
            ))}
            <text x={400} y={36} fontSize={11} fill="var(--muted-foreground)">…</text>
          </motion.g>

          {/* Gamma challenge */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <DataBox x={170} y={68} w={140} h={26} label="γ (Fiat-Shamir 챌린지)" color={COL_LIN} outlined />
            </motion.g>
          )}

          {/* Linear combination */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 2 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <ActionBox x={20} y={108} w={440} h={42}
              label="h(x) = p₁(x) + γ·p₂(x) + γ²·p₃(x) + … + γ^(k-1)·pₖ(x)"
              sub="GPU 벡터 연산: 계수별 스칼라곱 + 덧셈, O(k·n)"
              color={COL_LIN} />
          </motion.g>

          {/* Division */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 3 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <DataBox x={20} y={166} w={130} h={30} label="h(x) - w" color={COL_DIV} />
            <ActionBox x={160} y={164} w={150} h={34}
              label="÷ (x - z)" sub="synthetic division" color={COL_DIV} />
            <DataBox x={320} y={166} w={140} h={30} label="q(x): 몫 다항식" color={COL_DIV} outlined />
          </motion.g>

          {/* Final MSM and π */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 4 ? 1 : 0.22 }}
            transition={{ duration: 0.3 }}>
            <ActionBox x={20} y={216} w={140} h={36} label="GPU MSM" sub="단 1회" color={COL_OUT} />
            <DataBox x={170} y={220} w={120} h={28} label="π (G1 점 1개)" color={COL_OUT} outlined />
            {step >= 4 && (
              <motion.text x={300} y={236} fontSize={9} fontWeight={600} fill={COL_OUT}
                initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                k개 다항식 → 증명 1개 (압축률 k:1)
              </motion.text>
            )}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
