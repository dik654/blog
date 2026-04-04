import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { r: '#6366f1', q: '#10b981', s: '#f59e0b', p: '#ec4899', v: '#ef4444' };

const STEPS = [
  { label: '① 회로 정의 → R1CS', body: '계산 문제를 곱셈 게이트로 분해.\n예: x³ + x + 5 = y\n  t₁ = x * x       → A·w ⊙ B·w = C·w\n  t₂ = t₁ * x\n  y  = t₂ + x + 5  → 3개 제약.' },
  { label: '② R1CS → QAP 변환', body: 'IFFT로 Lagrange 보간:\n  aⱼ(x), bⱼ(x), cⱼ(x) 다항식 복원.\nQAP: A(x)·B(x) - C(x) = h(x)·t(x)\n  t(x) = xⁿ - 1  (vanishing polynomial).' },
  { label: '③ Trusted Setup (SRS)', body: 'τ, α, β, γ, δ ← Fr (비밀)\nSRS = {[τⁱ]₁, [τⁱ]₂, [α]₁, [β]₁₂, ...}\nPK(증명자) / VK(검증자) 분리.\nMPC 세레모니: 1-of-N 신뢰 모델.' },
  { label: '④ Prove → (A, B, C)', body: 'A = [α]₁ + MSM(w, a_query) + r·[δ]₁\nB = [β]₂ + MSM(w, b_query) + s·[δ]₂\nC = MSM(w_priv, l_q) + MSM(h, h_q) + blind\n→ Proof = (A∈G1, B∈G2, C∈G1) = 256B.' },
  { label: '⑤ Verify → O(1)', body: 'IC = ic[0] + Σ sⱼ·ic[j]  // 공개 입력 MSM\ncheck: e(A, B) ==\n  e(α, β) · e(IC, γ) · e(C, δ)\n→ 페어링 3회, ~4ms, 온체인 ~280k gas.' },
];

export default function Groth16PipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {[
            { c: C.r, lines: ['// x³ + x + 5 = y', 't₁ = x * x      → 제약 1', 't₂ = t₁ * x     → 제약 2', 'y  = t₂ + x + 5 → 제약 3', '', 'A·w ⊙ B·w = C·w  (3개)'] },
            { c: C.q, lines: ['aⱼ(x) = IFFT(A[:,j])', 'A(x) = Σ wⱼ·aⱼ(x), B(x), C(x)', 'h(x) = (A·B − C) / t(x)', '', 't(x) = xⁿ − 1'] },
            { c: C.s, lines: ['τ,α,β,γ,δ ← Fr', 'SRS = {[τⁱ]₁, [α]₁, [β]₂, ...}', 'PK = (VK, a_q, b_q, h_q, l_q)', 'VK = (α_g1, β_g2, γ_g2, δ_g2, ic)', 'MPC: 1-of-N 신뢰'] },
            { c: C.p, lines: ['A = [α]₁ + MSM(w, a_q) + r·[δ]₁', 'B = [β]₂ + MSM(w, b_q) + s·[δ]₂', 'C = MSM(w_priv, l_q) + MSM(h, h_q)', '  + s·A + r·B₁ − rs·[δ]₁', 'Proof = (A, B, C) = 256B'] },
            { c: C.v, lines: ['IC = ic[0] + Σ sⱼ·ic[j]', 'e(A, B) == e(α,β)·e(IC,γ)·e(C,δ)?', '', '페어링 3회, ~4ms', 'EVM: ~280k gas (precompile)'] },
          ].map((block, i) => (
            step === i && (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={20} y={18} fontSize={10} fontWeight={600} fill={block.c}>
                  Step {i + 1}
                </text>
                {block.lines.map((t, j) => (
                  <motion.text key={j} x={20} y={38 + j * 16} fontSize={10}
                    fontFamily="monospace" fill={block.c}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: j * 0.05 }}>{t}</motion.text>
                ))}
              </motion.g>
            )
          ))}
        </svg>
      )}
    </StepViz>
  );
}
