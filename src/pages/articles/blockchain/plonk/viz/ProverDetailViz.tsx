import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { r1: '#6366f1', r2: '#10b981', r3: '#f59e0b', r4: '#8b5cf6', r5: '#ec4899' };

const STEPS = [
  { label: 'R1: Wire 블라인딩 + KZG 커밋', body: 'a(X) = aᵢ 보간 + (b₁·X + b₂)·Zₕ(X)   // 블라인딩 2항\n[a]₁ = KZG.commit(a) = Σ aⱼ·[τʲ]₁\n[b]₁, [c]₁ 도 동일.\n출력: [a]₁, [b]₁, [c]₁ → transcript 기록.' },
  { label: 'R2: Z(X) 순열 누적자', body: 'β, γ ← Fiat-Shamir(transcript)\nZ(ω⁰) = 1\nZ(ωⁱ⁺¹) = Z(ωⁱ) · Π (wⱼ+β·σⱼ(ωⁱ)+γ) / (wⱼ+β·ωⁱ·kⱼ+γ)\n[Z]₁ = KZG.commit(Z)\n// Z(ωⁿ) = 1이면 순열 성립 ✓' },
  { label: 'R3: t(X) 몫 다항식', body: 'α ← FS. gate + perm + boundary 제약 결합:\nt(X) = [ qₘ·a·b + qₗ·a + qᵣ·b + qₒ·c + qc    // gate\n       + α·(순열 체크) + α²·(Z(1)=1 강제) ] / Zₕ(X)\ndeg(t) ≈ 3n → tₗₒ, t_mid, t_hi 3등분.' },
  { label: 'R4: ζ 에서 스칼라 평가', body: 'ζ ← FS.\nā = a(ζ), b̄ = b(ζ), c̄ = c(ζ)\nσ̄₁ = σ₁(ζ), σ̄₂ = σ₂(ζ)\nz̄ω = z(ζ·ω)\n// 6개 Fr 스칼라를 검증자에게 전송.' },
  { label: 'R5: 배치 KZG 오프닝', body: 'ν ← FS.\nr(X) = 선형화 다항식 (커밋 값으로 재구성)\nW_ζ = (r + ν·a + ν²·b + ν³·c + ν⁴·σ₁ + ν⁵·σ₂ - eval) / (X-ζ)\nW_ζω = (z - z̄ω) / (X-ζω)\n출력: [W_ζ]₁, [W_ζω]₁ → 증명 완성.' },
];

export default function ProverDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r1}>R1: Wire Commit</text>
              {['a(X) = interp(w_a) + (b₁X+b₂)·Zₕ(X)',
                '[a]₁ = Σ aⱼ·[τʲ]₁        // KZG MSM',
                '[b]₁ = Σ bⱼ·[τʲ]₁',
                '[c]₁ = Σ cⱼ·[τʲ]₁', '',
                'transcript.append([a]₁, [b]₁, [c]₁)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r1}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r2}>R2: Permutation Accumulator</text>
              {['β, γ ← FS(transcript)',
                'Z[0] = 1',
                'Z[i+1] = Z[i]·Π(wⱼ+β·σⱼ+γ)/(wⱼ+β·ωⁱkⱼ+γ)',
                '', '[Z]₁ = KZG.commit(Z)',
                '// Z[n] == 1 ⟺ 순열 정확'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r2}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r3}>R3: Quotient Polynomial</text>
              {['α ← FS',
                'num = qₘ·a·b + qₗ·a + qᵣ·b + qₒ·c + qc',
                '    + α·(perm_check)',
                '    + α²·(Z(1)-1)',
                't(X) = num / Zₕ(X)   // deg ≈ 3n',
                '[tₗ]₁, [tₘ]₁, [tₕ]₁ = 3등분 커밋'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r3}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r4}>R4: 평가값</text>
              {['ζ ← FS', 'ā = a(ζ),  b̄ = b(ζ),  c̄ = c(ζ)',
                'σ̄₁ = σ₁(ζ),  σ̄₂ = σ₂(ζ)',
                'z̄ω = z(ζ·ω)', '',
                '// 6개 Fr → transcript 기록 후 전송'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r4}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r5}>R5: Opening Proofs</text>
              {['ν ← FS',
                'W_ζ = (r+ν·a+ν²·b+...−eval)/(X−ζ)',
                'W_ζω = (z − z̄ω) / (X−ζω)', '',
                '// Proof 완성:',
                '  [a],[b],[c],[Z],[tₗ,tₘ,tₕ],[Wζ],[Wζω]'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r5}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
