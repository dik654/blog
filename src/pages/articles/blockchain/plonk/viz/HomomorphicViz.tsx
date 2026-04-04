import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { f: '#6366f1', g: '#10b981', add: '#f59e0b', sc: '#8b5cf6', no: '#ef4444' };

const STEPS = [
  { label: 'C(f) — 다항식 커밋', body: 'f(x) = 3 + 2x + x²\nC(f) = 3·G₁ + 2·[τ]₁ + 1·[τ²]₁\n     = [3 + 2τ + τ²]₁\n     = [f(τ)]₁  // G1 점 하나 = 48B\n\n// τ를 모르지만 SRS로 계산 가능.' },
  { label: 'C(g) — 독립 커밋', body: 'g(x) = 1 + 4x\nC(g) = 1·G₁ + 4·[τ]₁\n     = [1 + 4τ]₁ = [g(τ)]₁\n\n// 같은 SRS 사용. 다른 다항식 → 다른 G1 점.' },
  { label: '가법 동형: C(f) + C(g)', body: 'C(f) + C(g) = [f(τ)]₁ + [g(τ)]₁\n= [f(τ) + g(τ)]₁\n= [(3+2τ+τ²) + (1+4τ)]₁\n= [4 + 6τ + τ²]₁\n= C(f + g)  ✓\n\n// G1 점 덧셈 = 다항식 덧셈의 커밋!' },
  { label: '스칼라 곱: α·C(f)', body: 'α = 5\nα·C(f) = 5·[f(τ)]₁ = [5·f(τ)]₁ = C(5·f)  ✓\n\nPLONK 활용: ν·C(a) + ν²·C(b) + ν³·C(c)\n  = C(ν·a + ν²·b + ν³·c)\n\n// 여러 커밋을 하나로 배치(batch) 가능.' },
  { label: '곱셈 동형은 불가!', body: 'C(f) · C(g) = ?\nG1 점끼리 "곱셈" 연산은 정의 불가.\nG1은 덧셈군 → 곱셈 동형성 없음.\n\n유일한 예외: Pairing\n  e(C(f), C(g)) = e(G₁, G₂)^(f(τ)·g(τ))\n  → GT에서 곱셈 확인 가능.' },
];

export default function HomomorphicViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.f}>C(f) 커밋</text>
              {['f(x) = 3 + 2x + x²',
                'C(f) = 3·G₁ + 2·[τ]₁ + 1·[τ²]₁',
                '     = [f(τ)]₁  // G1 점 1개', '',
                '// τ를 모르지만 SRS로 계산',
                '// MSM: O(n/log n)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.f}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.g}>C(g) 커밋</text>
              {['g(x) = 1 + 4x',
                'C(g) = 1·G₁ + 4·[τ]₁',
                '     = [g(τ)]₁', '',
                '// 같은 SRS, 다른 다항식 → 다른 점'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.g}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.add}>가법 동형</text>
              {['C(f) + C(g) = [f(τ)+g(τ)]₁',
                '= [(3+2τ+τ²)+(1+4τ)]₁',
                '= [4+6τ+τ²]₁',
                '= C(f+g)  ✓', '',
                '// G1 덧셈 = 다항식 덧셈 커밋'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.add}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.sc}>스칼라 곱</text>
              {['5·C(f) = 5·[f(τ)]₁ = C(5·f)  ✓', '',
                'PLONK: ν·C(a) + ν²·C(b) + ν³·C(c)',
                '  = C(ν·a + ν²·b + ν³·c)', '',
                '// 배치(batch) 가능!'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.sc}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.no}>곱셈 동형 불가</text>
              {['C(f) · C(g) = ???',
                'G1: 덧셈군 → 곱셈 연산 없음', '',
                '유일한 예외: Pairing',
                '  e(C(f), C(g)) → GT에서 곱 확인', '',
                '// 이것이 페어링이 필요한 이유'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.no}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
