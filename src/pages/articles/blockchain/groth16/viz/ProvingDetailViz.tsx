import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { w: '#6366f1', a: '#10b981', b: '#f59e0b', c: '#ec4899', p: '#8b5cf6' };

const STEPS = [
  { label: 'Witness 할당 (SynthesisMode::Prove)', body: 'w = [1, pub₁, ..., priv₁, ...]\n예: x²=y 회로에서 x=3 → w = [1, 3, 9]\nfull_assignment 벡터에 값 할당.' },
  { label: 'A 계산 — G1 MSM', body: 'A = [α]₁                        // VK alpha\n  + Σⱼ wⱼ · a_query[j]          // Pippenger MSM\n  + r · [δ]₁                     // 블라인딩\n\n예: A = α·G₁ + 1·aq[0] + 3·aq[1] + 9·aq[2] + r·δ·G₁' },
  { label: 'B 계산 — G2+G1 병렬 MSM', body: 'B₂ = [β]₂ + Σⱼ wⱼ·bq₂[j] + s·[δ]₂   // G2\nB₁ = [β]₁ + Σⱼ wⱼ·bq₁[j] + s·[δ]₁   // G1\n\nrayon::join(|| msm_g2, || msm_g1)\nG1 결과는 C 블라인딩에 사용.' },
  { label: 'C 계산 — 3개 MSM 합산', body: 'C = Σ w_priv[j] · l_query[j]     // private LC\n  + Σ hᵢ · h_query[i]             // 몫 다항식\n  + s·A + r·B₁ - r·s·[δ]₁         // 블라인딩\n\nh = (A_poly·B_poly - C_poly) / Z(x) via 코셋 FFT' },
  { label: 'Proof = (A, B₂, C)', body: 'Proof {\n  a: A,   // G1Affine (x: Fq, y: Fq) = 64B\n  b: B₂,  // G2Affine (x: Fq2, y: Fq2) = 128B\n  c: C,   // G1Affine = 64B\n}           // 총 256 bytes, O(1) 크기' },
];

export default function ProvingDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.w}>Witness 할당</text>
              {['// x² = y, x=3', 'w[0] = 1          // constant',
                'w[1] = 3          // public input x',
                'w[2] = 9          // private output y',
                '', 'full_assignment = [1, 3, 9]'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.w}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.a}>A 원소 (G1)</text>
              {['r ← rand(Fr)     // 블라인딩 인수',
                'A = [α]₁', '  + 1·aq[0] + 3·aq[1] + 9·aq[2]',
                '  + r·[δ]₁', '',
                '// Pippenger: window=15, O(n/log n)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.a}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.b}>B 원소 (G2 + G1)</text>
              {['s ← rand(Fr)', 'rayon::join(', '  || B₂ = [β]₂ + MSM(w, bq₂) + s·[δ]₂',
                '  || B₁ = [β]₁ + MSM(w, bq₁) + s·[δ]₁', ')', '',
                '// B₁은 C의 블라인딩 항에서 사용'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.b}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.c}>C 원소 (합산)</text>
              {['C = MSM(w_priv, l_query)      // private',
                '  + MSM(h_coeffs, h_query)    // 몫 h(x)',
                '  + s·A + r·B₁ - r·s·[δ]₁    // blind', '',
                '// h 계산: IFFT → coset_fft → 점별곱 → IFFT'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.c}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.p}>Proof 출력</text>
              {['Proof {', '  a: G1Affine,  // 64B  (Fq × 2)',
                '  b: G2Affine,  // 128B (Fq2 × 2)',
                '  c: G1Affine,  // 64B', '}', '',
                '// 총 256B, 회로 10⁶ 게이트도 동일'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.p}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
