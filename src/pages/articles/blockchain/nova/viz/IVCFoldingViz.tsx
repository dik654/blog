import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { pp: '#a855f7', rs: '#3b82f6', f1: '#10b981', fn: '#ec4899', comp: '#6366f1' };

const STEPS = [
  { label: 'PublicParams 셋업', body: 'pp = setup(F)  // StepCircuit F\n  r1cs_shape = F.to_r1cs()  // 제약 구조\n  ck = commit_key(shape.num_vars)  // Pedersen 키\n\n  // F_aug = F + NIFS.verify (augmented circuit)\n  // F_aug.r1cs_shape → primary / secondary' },
  { label: 'RecursiveSNARK 초기화', body: 'z₀ = initial_state  // 예: [0]\nU₁ = trivial_instance  // u=0, E=0, comm=default\nW₁ = trivial_witness\n\nrs = RecursiveSNARK {\n  r_U: U₁,  r_W: W₁,\n  z_i: z₀,  i: 0\n}' },
  { label: 'Step 1: 첫 번째 폴딩', body: 'z₁ = F(z₀)  // StepCircuit 실행\nU₂ = (comm_W₂, E₂=0, u₂=1, x₂)  // fresh\n\nT = cross_term(r_U, U₂, r_W, W₂)\ncomm_T = Pedersen.commit(T)\nr ← FS(comm_T)\n\nr_U\' = r_U + r·U₂   // 폴딩된 인스턴스\nr_W\' = r_W + r·W₂   // 폴딩된 witness' },
  { label: 'Step N: 재귀 폴딩', body: 'for i in 1..N:\n  zᵢ = F(zᵢ₋₁)\n  Uᵢ = fresh_instance(zᵢ)\n  T = cross_term(r_U, Uᵢ, r_W, Wᵢ)\n  r ← FS(Pedersen(T))\n  r_U = r_U + r·Uᵢ   // O(1) 크기 유지\n  r_W = r_W + r·Wᵢ\n\n// 재귀 깊이 N과 무관한 O(1) 누적 인스턴스.' },
  { label: 'CompressedSNARK (Spartan)', body: 'cs = CompressedSNARK::prove(pp, rs)\n  // Spartan으로 RelaxedR1CS 만족 증명\n  // Sumcheck → polynomial commitment\n\n증명 크기: ~수 KB (vs SNARK: 수백 B)\n검증: O(log n) — 재귀 단계 수와 무관.\n\nverify(cs, pp, z₀, zₙ)  // O(log n)' },
];

export default function IVCFoldingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.pp}>PublicParams</text>
              {['pp = setup(F)',
                '  shape = F.to_r1cs()',
                '  ck = commit_key(num_vars)', '',
                '  F_aug = F + NIFS.verify',
                '  // augmented circuit으로 재귀 검증 내재화'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.pp}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.rs}>RecursiveSNARK 초기화</text>
              {['z₀ = [0]  // 초기 상태',
                'r_U = trivial(u=0, E=0)',
                'r_W = trivial_witness', '',
                'rs = { r_U, r_W, z₀, i=0 }'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.rs}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.f1}>Step 1: 첫 폴딩</text>
              {['z₁ = F(z₀)',
                'U₂ = fresh(z₁)  // u₂=1, E₂=0',
                'T = cross_term(r_U, U₂)',
                'r ← FS(Pedersen(T))', '',
                'r_U\' = r_U + r·U₂  // 폴딩',
                'r_W\' = r_W + r·W₂'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.f1}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.fn}>Step N: 재귀</text>
              {['for i in 1..N:',
                '  zᵢ = F(zᵢ₋₁)',
                '  T = cross_term(r_U, Uᵢ)',
                '  r ← FS(Pedersen(T))',
                '  r_U = r_U + r·Uᵢ  // O(1) 유지',
                '  r_W = r_W + r·Wᵢ'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.fn}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.comp}>CompressedSNARK</text>
              {['cs = CompressedSNARK::prove(pp, rs)',
                '  // Spartan sumcheck + polycommit', '',
                '증명 크기: ~수 KB',
                '검증: O(log n)', '',
                'verify(cs, pp, z₀, zₙ)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.comp}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
