import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { w: '#6366f1', msm: '#10b981', bl: '#8b5cf6', out: '#ec4899' };

const STEPS = [
  { label: '① Witness 할당', body: 'w = [1, x₁, x₂, ..., wₘ]. 공개 입력 + 비밀 witness를 하나의 벡터로.' },
  { label: '② A 원소 계산 (G1 MSM)', body: 'A = [α]₁ + Σⱼ wⱼ·a_query[j] + r·[δ]₁\n= α·G₁ + w₀·a₀·G₁ + w₁·a₁·G₁ + ... + r·δ·G₁\nPippenger MSM: O(n/log n) 곡선 덧셈.' },
  { label: '③ B 원소 계산 (G2 + G1 이중)', body: 'B_g2 = [β]₂ + Σⱼ wⱼ·b_query_g2[j] + s·[δ]₂\nB_g1 = [β]₁ + Σⱼ wⱼ·b_query_g1[j] + s·[δ]₁\nrayon::join으로 G1, G2 MSM 병렬 실행.' },
  { label: '④ C 원소 계산 (3개 MSM 합산)', body: 'C = Σ wⱼ·l_query[j]         // private LC\n  + Σ hᵢ·h_query[i]          // h(x) 몫\n  + s·A + r·B_g1 - r·s·[δ]₁  // 블라인딩 항' },
  { label: '⑤ Proof 출력 = (A, B, C)', body: 'A ∈ G1 = 64 bytes (x, y 각 32B)\nB ∈ G2 = 128 bytes (x, y 각 Fp2 = 64B)\nC ∈ G1 = 64 bytes\n총 256 bytes. 회로 크기와 무관한 상수.' },
];

export default function ProveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Witness vector */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.3 }} transition={sp}>
            <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.w}>Witness 벡터</text>
            <text x={20} y={34} fontSize={10} fontFamily="monospace" fill={C.w}>
              w = [1, x_pub, ..., w_priv]
            </text>
          </motion.g>
          {/* A computation */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 1 ? 1 : 0.3 }} transition={sp}>
              <text x={20} y={54} fontSize={10} fontWeight={600} fill={C.msm}>A 계산 (MSM)</text>
              <text x={20} y={70} fontSize={10} fontFamily="monospace" fill={C.msm}>
                A = [α]₁ + Σ wⱼ·a_q[j] + r·[δ]₁
              </text>
              <text x={20} y={84} fontSize={10} fontFamily="monospace" fill={C.msm} opacity={0.6}>
                {'  '}= α·G₁ + MSM(w, a_query) + r·δ·G₁
              </text>
            </motion.g>
          )}
          {/* B computation */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 2 ? 1 : 0.3 }} transition={sp}>
              <text x={260} y={18} fontSize={10} fontWeight={600} fill="#f59e0b">B 계산 (이중 MSM)</text>
              <text x={260} y={34} fontSize={10} fontFamily="monospace" fill="#f59e0b">
                B₂ = [β]₂ + MSM(w, b_q₂) + s·[δ]₂
              </text>
              <text x={260} y={50} fontSize={10} fontFamily="monospace" fill="#f59e0b">
                B₁ = [β]₁ + MSM(w, b_q₁) + s·[δ]₁
              </text>
              <text x={260} y={64} fontSize={9} fill="#f59e0b" opacity={0.5}>
                // G1, G2 병렬: rayon::join
              </text>
            </motion.g>
          )}
          {/* C computation */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 3 ? 1 : 0.3 }} transition={sp}>
              <text x={20} y={104} fontSize={10} fontWeight={600} fill={C.bl}>C 계산 (합산)</text>
              <text x={20} y={120} fontSize={10} fontFamily="monospace" fill={C.bl}>
                C = MSM(w_priv, l_q) + MSM(h, h_q)
              </text>
              <text x={20} y={134} fontSize={10} fontFamily="monospace" fill={C.bl}>
                {'  '}+ s·A + r·B₁ - r·s·[δ]₁
              </text>
            </motion.g>
          )}
          {/* Output */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={260} y={90} width={210} height={60} rx={5}
                fill={`${C.out}10`} stroke={C.out} strokeWidth={1.2} />
              <text x={365} y={108} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.out}>
                Proof = (A, B, C)
              </text>
              <text x={365} y={124} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={C.out}>
                A∈G1: 64B, B∈G2: 128B
              </text>
              <text x={365} y={140} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={C.out}>
                C∈G1: 64B → 총 256 bytes
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
