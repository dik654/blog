import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { fs: '#6366f1', pre: '#10b981', f: '#f59e0b', e: '#8b5cf6', pair: '#ef4444' };

const STEPS = [
  { label: '① Fiat-Shamir 챌린지 재생', body: 'β, γ ← FS([a],[b],[c])\nα ← FS([Z]₁)\nζ ← FS([tₗ],[tₘ],[tₕ])\nν ← FS(ā,b̄,c̄,σ̄₁,σ̄₂,z̄ω)\nu ← FS([Wζ],[Wζω])\n// 증명자와 동일한 순서로 도출 → 결정론적.' },
  { label: '② 도메인 값 사전 계산', body: 'Zₕ(ζ) = ζⁿ - 1\nL₁(ζ) = (ζⁿ - 1) / (n·(ζ - 1))\nζⁿ = ζ·ζ·...·ζ  (n번 제곱)\n// n = 도메인 크기, O(log n) 연산.' },
  { label: '③ 선형화 커밋 [F]₁ 재구성', body: '[F]₁ = r̄·[qₘ]₁ + ā·[qₗ]₁ + b̄·[qᵣ]₁\n     + c̄·[qₒ]₁ + [qc]₁\n     + α·(순열 선형화 항)\n     + α²·L₁(ζ)·[Z]₁\n     + ν·[a]₁ + ν²·[b]₁ + ... // 배치' },
  { label: '④ 평가 커밋 [E]₁', body: '[E]₁ = (r̄ + ν·ā + ν²·b̄ + ν³·c̄\n       + ν⁴·σ̄₁ + ν⁵·σ̄₂ + u·z̄ω) · G₁\n// 모든 평가값을 하나의 G1 점으로 결합.' },
  { label: '⑤ Pairing 검증 — O(1)', body: 'LHS = [Wζ] + u·[Wζω]\nRHS = ζ·[Wζ] + u·ζω·[Wζω] + [F] - [E]\n\ne(LHS, [τ]₂) == e(RHS, G₂) ?\n// 페어링 2회. 성립 → accept.' },
];

export default function VerifierDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.fs}>FS 챌린지 재생</text>
              {['β, γ ← FS([a]₁, [b]₁, [c]₁)',
                'α    ← FS([Z]₁)',
                'ζ    ← FS([tₗ]₁, [tₘ]₁, [tₕ]₁)',
                'ν    ← FS(ā, b̄, c̄, σ̄₁, σ̄₂, z̄ω)',
                'u    ← FS([Wζ]₁, [Wζω]₁)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.fs}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.pre}>도메인 사전 계산</text>
              {['Zₕ(ζ) = ζⁿ − 1',
                'L₁(ζ) = (ζⁿ − 1) / (n·(ζ − 1))',
                'PI(ζ) = Σ pᵢ · Lᵢ(ζ)  // 공개 입력', '',
                '// O(log n) 거듭제곱 + O(l) MSM'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.pre}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.f}>[F]₁ 선형화</text>
              {['[F]₁ = r̄·[qₘ] + ā·[qₗ] + b̄·[qᵣ]',
                '     + c̄·[qₒ] + [qc]',
                '     + α·(perm 선형화)',
                '     + α²·L₁(ζ)·[Z]₁',
                '     + Σ νⁱ·[commit_i]₁'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.f}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.e}>[E]₁ 평가 커밋</text>
              {['scalar = r̄ + ν·ā + ν²·b̄ + ν³·c̄',
                '       + ν⁴·σ̄₁ + ν⁵·σ̄₂ + u·z̄ω',
                '[E]₁ = scalar · G₁', '',
                '// 단일 스칼라 곱 O(1)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.e}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.pair}>Pairing 검증</text>
              {['LHS = [Wζ] + u·[Wζω]',
                'RHS = ζ·[Wζ] + uζω·[Wζω] + [F] − [E]', '',
                'e(LHS, [τ]₂) == e(RHS, G₂) ?', '',
                '✓ → accept  (페어링 2회, O(1))'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.pair}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
