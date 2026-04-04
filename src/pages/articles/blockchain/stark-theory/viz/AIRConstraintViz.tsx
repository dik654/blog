import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { t: '#6366f1', bd: '#f59e0b', tr: '#10b981', q: '#8b5cf6' };

const STEPS = [
  { label: 'AIR 제약 구조', body: '피보나치: 레지스터 (a, b), 전이: a\'=b, b\'=a+b\n\n경계 제약 + 전이 제약으로 실행 추적 검증.\n제약을 다항식으로 인코딩 → 몫 존재 여부로 검증.' },
  { label: '경계 제약 (Boundary)', body: 'B₁(x) = a(x) - 1,  evaluated at x = ω⁰\nB₂(x) = b(x) - 1,  evaluated at x = ω⁰\nB₃(x) = b(x) - 5,  evaluated at x = ω³\n\n// 초기값 a₀=b₀=1, 출력값 b₃=5 강제.\n// 경계점에서 0이어야 함 → (x-ωⁱ)로 나눔.' },
  { label: '전이 제약 (Transition)', body: 'T₁(x) = a(ω·x) - b(x)       // a\'= b\nT₂(x) = b(ω·x) - a(x) - b(x) // b\'= a+b\n\n검증 (행 0 → 행 1):\n  a(ω¹) - b(ω⁰) = 1 - 1 = 0 ✓\n  b(ω¹) - a(ω⁰) - b(ω⁰) = 2 - 1 - 1 = 0 ✓\n// 모든 ω⁰,...,ωⁿ⁻² 에서 0이어야 함.' },
  { label: '몫 다항식 Q(x)', body: 'C(x) = α₁·T₁(x) + α₂·T₂(x) + α₃·B₁ + ...\nZ_H(x) = xⁿ - 1  // vanishing polynomial\n\nQ(x) = C(x) / Z_H(x)\n// Q가 다항식 ⟺ C가 모든 단위근에서 0\n// ⟺ 모든 제약이 만족됨.\n// FRI로 Q의 저차 성질(low-degree) 검증.' },
];

export default function AIRConstraintViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.t}>AIR 제약</text>
              {['레지스터: (a, b)',
                '전이: a\' = b,  b\' = a + b', '',
                'Trace:',
                '  (1,1) → (1,2) → (2,3) → (3,5)', '',
                '제약 = 경계(Boundary) + 전이(Transition)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.t}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.bd}>경계 제약</text>
              {['B₁(x) = a(x) − 1  at x = ω⁰   // a₀=1',
                'B₂(x) = b(x) − 1  at x = ω⁰   // b₀=1',
                'B₃(x) = b(x) − 5  at x = ω³   // b₃=5', '',
                '// 경계점에서 0이어야 함:',
                '// B₁(ω⁰) = a(ω⁰) − 1 = 1 − 1 = 0 ✓'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.bd}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.tr}>전이 제약</text>
              {['T₁(x) = a(ω·x) − b(x)',
                'T₂(x) = b(ω·x) − a(x) − b(x)', '',
                '행 0→1: T₁(ω⁰) = a(ω¹)−b(ω⁰) = 1−1 = 0 ✓',
                '        T₂(ω⁰) = b(ω¹)−a(ω⁰)−b(ω⁰)',
                '               = 2−1−1 = 0 ✓'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.tr}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.q}>몫 다항식 Q(x)</text>
              {['C(x) = α₁·T₁ + α₂·T₂ + α₃·B₁ + ...',
                'Z_H(x) = xⁿ − 1', '',
                'Q(x) = C(x) / Z_H(x)',
                '// Q 다항식 ⟺ 제약 충족',
                '// FRI로 deg(Q) ≤ d 검증'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.q}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
