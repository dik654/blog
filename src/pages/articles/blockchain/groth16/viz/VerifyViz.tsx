import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { ic: '#f59e0b', lhs: '#6366f1', rhs: '#10b981', ok: '#10b981' };

const STEPS = [
  { label: '① IC 벡터 합산 — 공개 입력 결합', body: 'IC_sum = ic[0] + s₁·ic[1] + s₂·ic[2] + ...\n예: 공개 입력 s₁=35 → IC_sum = ic[0] + 35·ic[1]\nMSM O(l), l = 공개 입력 수. 검증자의 유일한 O(l) 연산.' },
  { label: '② LHS: e(A, B) 페어링', body: 'LHS = e(A, B)\n= optimal_ate(A ∈ G1, B ∈ G2)\n= miller_loop(A, B) → final_exp\n→ GT 원소 (Fp12 = 12개 Fp 좌표)' },
  { label: '③ RHS: 3개 페어링 곱', body: 'RHS = e(α, β)        // VK에 미리 계산 저장\n    · e(IC_sum, γ)    // 공개 입력 검증\n    · e(C, δ)          // 비공개 witness 검증\ne(α,β)는 캐시 → 실제 페어링 2회만 실행.' },
  { label: '④ LHS == RHS → Accept', body: 'LHS_gt == RHS_gt ?\nFp12 원소 12개 좌표 비교.\n성립 → accept (증명 유효)\n~4ms (BN254), 온체인 ~280k gas.' },
];

export default function VerifyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* IC sum */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.3 }} transition={sp}>
            <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.ic}>IC 합산</text>
            <text x={20} y={34} fontSize={10} fontFamily="monospace" fill={C.ic}>
              IC_sum = ic[0]
            </text>
            <text x={20} y={48} fontSize={10} fontFamily="monospace" fill={C.ic}>
              {'       '}+ s₁·ic[1] + s₂·ic[2] + ...
            </text>
            <text x={20} y={62} fontSize={9} fill={C.ic} opacity={0.6}>
              // MSM(public_inputs, ic[1..]) 수행
            </text>
          </motion.g>
          {/* LHS */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 1 ? 1 : 0.3 }} transition={sp}>
              <text x={20} y={86} fontSize={10} fontWeight={600} fill={C.lhs}>LHS (증명자 측)</text>
              <text x={20} y={102} fontSize={10} fontFamily="monospace" fill={C.lhs}>
                LHS = e(A, B)
              </text>
              <text x={20} y={116} fontSize={10} fontFamily="monospace" fill={C.lhs} opacity={0.6}>
                {'    '}= miller(A, B) → final_exp → GT
              </text>
            </motion.g>
          )}
          {/* RHS */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 2 ? 1 : 0.3 }} transition={sp}>
              <text x={260} y={18} fontSize={10} fontWeight={600} fill={C.rhs}>RHS (검증자 측)</text>
              <text x={260} y={34} fontSize={10} fontFamily="monospace" fill={C.rhs}>
                RHS = vk.alpha_beta_gt
              </text>
              <text x={260} y={48} fontSize={10} fontFamily="monospace" fill={C.rhs}>
                {'    '}· e(IC_sum, [γ]₂)
              </text>
              <text x={260} y={62} fontSize={10} fontFamily="monospace" fill={C.rhs}>
                {'    '}· e(C, [δ]₂)
              </text>
              <text x={260} y={76} fontSize={9} fill={C.rhs} opacity={0.6}>
                // e(α,β) 캐시 → 페어링 2회
              </text>
            </motion.g>
          )}
          {/* Final check */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={260} y={95} width={210} height={52} rx={5}
                fill={`${C.ok}12`} stroke={C.ok} strokeWidth={1.2} />
              <text x={365} y={114} textAnchor="middle" fontSize={10} fontWeight={600}
                fontFamily="monospace" fill={C.ok}>LHS_gt == RHS_gt ?</text>
              <text x={365} y={132} textAnchor="middle" fontSize={10} fill={C.ok}>
                Fp12 비교 → accept (~4ms)
              </text>
              <text x={365} y={144} textAnchor="middle" fontSize={9} fill={C.ok} opacity={0.6}>
                EVM: ~280k gas (precompile)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
