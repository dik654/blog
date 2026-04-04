import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { r1: '#6366f1', r2: '#10b981', r3: '#f59e0b', r4: '#8b5cf6', r5: '#ec4899' };

const STEPS = [
  { label: 'R1: a(X), b(X), c(X) 커밋', body: 'witness 보간 → 블라인딩 항 추가:\na(X) = Σ aᵢ·Lᵢ(X) + (b₁X+b₂)·Zₕ(X)\nKZG: [a]₁ = Σ coeff_j·[τʲ]₁\ntranscript ← [a]₁ ∥ [b]₁ ∥ [c]₁' },
  { label: 'R2: copy constraint 순열 검사', body: 'β, γ ← FS(transcript)\nZ(X): grand product 누적자\n  Z(1) = 1\n  Z(ωⁱ⁺¹) = Z(ωⁱ) · frac(wires, perms)\nZ(ωⁿ) = 1 ⟺ 순열 성립\n[Z]₁ = KZG.commit(Z)' },
  { label: 'R3: 제약 결합 → 몫 t(X)', body: 'α ← FS\nt(X) = [gate_constraint(X)\n      + α·perm_constraint(X)\n      + α²·(Z(X)-1)·L₁(X)] / Zₕ(X)\ndeg(t) ≈ 3n → [tₗ]₁, [tₘ]₁, [tₕ]₁' },
  { label: 'R4: ζ 에서 6개 스칼라 평가', body: 'ζ ← FS\nā=a(ζ), b̄=b(ζ), c̄=c(ζ)    // wire 값\nσ̄₁=σ₁(ζ), σ̄₂=σ₂(ζ)        // 순열 값\nz̄ω=z(ζω)                     // 시프트된 Z\n→ 6개 Fr 전송' },
  { label: 'R5: 배치 오프닝 증명', body: 'ν ← FS\n선형화: r(X) = 커밋에서 ζ 평가 분리\nW_ζ  = (r+ν·a+ν²b+...−eval) / (X−ζ)\nW_ζω = (z − z̄ω) / (X−ζω)\nProof = 7 G1 + 7 Fr ≈ 704B' },
];

export default function PLONKRoundsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {[
            { c: C.r1, lines: ['a(X) = interp(wₐ) + blind·Zₕ(X)', '[a]₁ = MSM(coeffs, SRS)', 'transcript ← [a]₁∥[b]₁∥[c]₁'] },
            { c: C.r2, lines: ['β, γ ← FS(transcript)', 'Z[0]=1, Z[i+1]=Z[i]·Π(frac)', '[Z]₁ = KZG.commit(Z)', '// Z[n]==1 → copy OK'] },
            { c: C.r3, lines: ['α ← FS', 'num = gate + α·perm + α²·boundary', 't(X) = num / Zₕ(X)', '[tₗ],[tₘ],[tₕ] = split(t, 3n)'] },
            { c: C.r4, lines: ['ζ ← FS', 'ā=a(ζ), b̄=b(ζ), c̄=c(ζ)', 'σ̄₁=σ₁(ζ), σ̄₂=σ₂(ζ), z̄ω=z(ζω)', '// 6개 Fr 스칼라 전송'] },
            { c: C.r5, lines: ['ν ← FS', 'W_ζ = (r+ν·a+ν²·b+...)/（X−ζ)', 'W_ζω = (z−z̄ω)/(X−ζω)', 'Proof: 7G1+7Fr ≈ 704B'] },
          ].map((block, i) => (
            step === i && (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={20} y={18} fontSize={10} fontWeight={600} fill={block.c}>
                  Round {i + 1}
                </text>
                {block.lines.map((t, j) => (
                  <motion.text key={j} x={20} y={38 + j * 16} fontSize={10}
                    fontFamily="monospace" fill={block.c}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: j * 0.06 }}>{t}</motion.text>
                ))}
              </motion.g>
            )
          ))}
        </svg>
      )}
    </StepViz>
  );
}
