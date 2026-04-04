import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { iop: '#6366f1', mt: '#10b981', fs: '#f59e0b', out: '#3b82f6' };

const STEPS = [
  { label: 'BCS 변환 개요', body: 'IOP (Interactive Oracle Proofs) → zkSNARK 변환.\n\nIOP: Prover가 "오라클" 제공, Verifier가 질의.\n문제: 상호작용 필요 → 블록체인 불가.\nBCS: 오라클 → 머클 트리, 질의 → Fiat-Shamir.' },
  { label: '① 오라클 → 머클 커밋', body: 'Round i: Prover가 오라클 πᵢ 생성\n  πᵢ = [f(ω⁰), f(ω¹), ..., f(ωⁿ⁻¹)]\n\nMerkle Tree 구성:\n  leaf[j] = H(πᵢ[j])  // 각 평가값 해시\n  root_i = MerkleRoot(leaves)\n\nProver → Verifier: root_i 전송 (32B).' },
  { label: '② Fiat-Shamir 챌린지 생성', body: 'state₀ = H("BCS" ∥ instance)\nstate₁ = H(state₀ ∥ root₁)   // 라운드 1 후\nstate₂ = H(state₁ ∥ root₂)   // 라운드 2 후\n...\n\ncₖ = stateₖ mod |query_domain|\n// 해시 체인으로 결정론적 질의 위치 결정.\n// Verifier도 동일하게 재현.' },
  { label: '③ 증명 출력', body: 'proof = {\n  roots: [root₁, root₂, ...],      // 머클 루트\n  answers: [πᵢ[cⱼ], ...],          // 질의 응답\n  paths: [merkle_path(cⱼ), ...],   // 머클 경로\n}\n\n검증: root == MerkleVerify(answer, path, c) ?\n  + IOP 검증 로직(다항식 체크 등).\n\n// 증명 크기: O(λ · k · log n) — k=질의 수.' },
];

export default function BCSFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.iop}>BCS 변환</text>
              {['IOP → zkSNARK (비상호작용)', '',
                'IOP: 오라클 + 질의 → 상호작용',
                'BCS: 오라클 → Merkle Tree',
                '     질의 → Fiat-Shamir 해시', '',
                '// Ben-Sasson, Chiesa, Spooner (2016)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.iop}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.mt}>머클 커밋</text>
              {['πᵢ = [f(ω⁰), f(ω¹), ..., f(ωⁿ⁻¹)]',
                'leaf[j] = H(πᵢ[j])',
                'root_i = MerkleRoot(leaves)', '',
                'Prover → Verifier: root_i (32B)',
                '// 오라클 전체 대신 루트만 전송'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.mt}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.fs}>Fiat-Shamir 질의</text>
              {['s₀ = H("BCS" ∥ instance)',
                's₁ = H(s₀ ∥ root₁)',
                's₂ = H(s₁ ∥ root₂)', '',
                'cₖ = sₖ mod |domain|  // 질의 위치',
                '// 해시 체인 → 결정론적'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.fs}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.out}>증명 출력</text>
              {['proof = {',
                '  roots: [root₁, root₂, ...]',
                '  answers: [πᵢ[cⱼ], ...]',
                '  paths: [merkle_path(cⱼ), ...]',
                '}', '',
                '크기: O(λ · k · log n)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.out}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
