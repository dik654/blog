import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { setup: '#8b5cf6', cm: '#3b82f6', open: '#10b981', vfy: '#ef4444' };

const STEPS = [
  { label: 'Trusted Setup — SRS 생성', body: 'β ← Fr (비밀 평가점)\npowers_of_g1 = [G₁, β·G₁, β²·G₁, ..., βᵈ·G₁]\npowers_of_g2 = [G₂, β·G₂]\n\n// d = 최대 다항식 차수.\n// β 삭제 후 SRS만 남김 (universal).' },
  { label: 'Commit — p(x) → G1 점', body: 'p(x) = c₀ + c₁x + c₂x² + ... + cₙxⁿ\n\nC = MSM(coeffs, powers_of_g1)\n  = c₀·G₁ + c₁·β·G₁ + c₂·β²·G₁ + ...\n  = [p(β)]₁  // G1 점 1개 = 48B (BLS12-381)\n\n바인딩: 다른 p\'(x)로 같은 C 불가 (DLog 가정).' },
  { label: 'Open — witness 다항식 계산', body: '주장: p(z) = v  (z 에서 값 v)\n\nw(x) = (p(x) - v) / (x - z)  // 인수정리\nW = MSM(w_coeffs, powers_of_g1)  // [w(β)]₁\n\n// w가 다항식 ⟺ (x-z) | (p(x)-v) ⟺ p(z)=v.\n// 증명 크기: G1 점 1개 = 48B (상수).' },
  { label: 'Verify — Pairing Check O(1)', body: 'e(C - v·G₁,  G₂)\n  == e(W,  β·G₂ - z·G₂) ?\n\n풀어쓰면:\n  e([p(β)-v]₁, [1]₂) == e([w(β)]₁, [β-z]₂)\n  p(β)-v == w(β)·(β-z)  ← 인수정리!\n\n// 페어링 2회. 회로/다항식 크기와 무관.\n// BLS12-381 기준 ~2ms.' },
];

export default function KZG10FlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.setup}>Trusted Setup</text>
              {['β ← rand(Fr)',
                'SRS_G1 = [G₁, β·G₁, ..., βᵈ·G₁]',
                'SRS_G2 = [G₂, β·G₂]', '',
                '// d = max polynomial degree',
                '// β 삭제 → universal SRS'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.setup}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.cm}>Commit</text>
              {['p(x) = c₀ + c₁x + ... + cₙxⁿ',
                'C = MSM(coeffs, SRS_G1)',
                '  = c₀·G₁ + c₁·βG₁ + ... + cₙ·βⁿG₁',
                '  = [p(β)]₁  // 48 bytes', '',
                '// 바인딩: DLog 가정으로 유일성'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.cm}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.open}>Open (인수정리)</text>
              {['주장: p(z) = v',
                'w(x) = (p(x) − v) / (x − z)',
                'W = MSM(w_coeffs, SRS_G1) = [w(β)]₁', '',
                'w 다항식 ⟺ p(z) = v',
                '증명 크기: G1 점 1개 = 48B (상수)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.open}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.vfy}>Verify (Pairing)</text>
              {['e(C − v·G₁, G₂) == e(W, β·G₂ − z·G₂)?',
                '', '풀어쓰면:',
                '  p(β)−v == w(β)·(β−z)', '',
                '// 인수정리 등식 → 페어링 2회 O(1)',
                '// BLS12-381 기준 ~2ms'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.vfy}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
