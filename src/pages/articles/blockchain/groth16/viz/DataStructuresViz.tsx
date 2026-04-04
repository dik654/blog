import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { pk: '#6366f1', vk: '#10b981', pf: '#f59e0b' };

const STEPS = [
  { label: 'ProvingKey — 증명자 전용', body: 'ProvingKey {\n  vk: VerifyingKey,           // 검증키 포함\n  alpha_g1: G1,  beta_g1: G1, beta_g2: G2,\n  delta_g1: G1,  delta_g2: G2,\n  a_query: Vec<G1>,           // 변수별 a(τ)·G₁\n  b_g1_query: Vec<G1>,        // b(τ)·G₁\n  b_g2_query: Vec<G2>,        // b(τ)·G₂\n  h_query: Vec<G1>,           // τⁱ/t(τ)·G₁\n  l_query: Vec<G1>,           // private LC·G₁\n}\n// 크기: O(n) — 제약 수에 비례.' },
  { label: 'VerifyingKey — 검증자 전용', body: 'VerifyingKey {\n  alpha_g1: G1,       // [α]₁ = α·G₁\n  beta_g2: G2,        // [β]₂ = β·G₂\n  gamma_g2: G2,       // [γ]₂ = γ·G₂\n  delta_g2: G2,       // [δ]₂ = δ·G₂\n  ic: Vec<G1>,        // 공개 입력 IC 벡터\n}\n// 크기: O(l) — 공개 입력 수에 비례.\n// alpha_beta_gt = e(α,β) 사전 계산 가능.' },
  { label: 'Proof — 최종 증명 (256B)', body: 'Proof {\n  a: G1Affine,  // x: Fq(32B), y: Fq(32B) = 64B\n  b: G2Affine,  // x: Fq2(64B), y: Fq2(64B) = 128B\n  c: G1Affine,  // 64B\n}\n// 총 256 bytes. 회로 크기와 무관한 상수.\n\n// BN254: G1=64B, G2=128B\n// BLS12-381: G1=48B, G2=96B → 192B.' },
];

export default function DataStructuresViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.pk}>ProvingKey</text>
              {['vk: VerifyingKey,',
                'alpha_g1, beta_g1, beta_g2,',
                'delta_g1, delta_g2,',
                'a_query: Vec<G1>,   // n개',
                'b_g1/g2_query: Vec, // n개',
                'h_query: Vec<G1>,   // d개',
                'l_query: Vec<G1>,   // m개 (private)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.pk}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.vk}>VerifyingKey</text>
              {['alpha_g1: G1,  // [α]₁',
                'beta_g2: G2,   // [β]₂',
                'gamma_g2: G2,  // [γ]₂',
                'delta_g2: G2,  // [δ]₂',
                'ic: Vec<G1>,   // 공개 입력 (l+1개)', '',
                '크기: O(l) — 공개 입력 수 비례',
                'alpha_beta_gt = e(α,β) 사전 계산'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.vk}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.pf}>Proof (256B)</text>
              {['Proof {',
                '  a: G1Affine,  // 64B (Fq × 2)',
                '  b: G2Affine,  // 128B (Fq2 × 2)',
                '  c: G1Affine,  // 64B',
                '}', '',
                '// 총 256B — 회로 크기 무관',
                '// BLS12-381: G1=48B → 총 192B'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.pf}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
