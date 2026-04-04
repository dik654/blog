import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { ml: '#6b7280', e1: '#6366f1', e2: '#10b981', hard: '#f59e0b' };

const STEPS = [
  { label: 'Miller Loop 결과: f ∈ Fp12*', body: 'f = miller_loop(P, Q)  // Fp12 원소\nf = (c0, c1) where ci ∈ Fp6\n\n아직 GT 부분군이 아님 → Final Exp 필요.\n전체 지수: (p¹² - 1) / r' },
  { label: 'Easy Part 1: f^(p⁶-1)', body: 'p⁶승 = conjugate(f)  // Fp12에서 c1 부호 반전\nf₁ = conjugate(f) · f⁻¹\n\n= (c0, -c1) · inv(c0, c1)\n// inv: Fp6 역원 1회. 총 비용: inv + mul 각 1회.\n// 결과: f₁^(p⁶) = f₁⁻¹ (유니타리 성질 획득).' },
  { label: 'Easy Part 2: f₁^(p²+1)', body: 'f₂ = frobenius_square(f₁) · f₁\n\np²승 = Frobenius²: 각 Fp2 계수에 상수 곱.\n// Fp2 원소 6개의 계수 재배열.\n// 비용: Fp 곱셈 ~6회 → "거의 무료".\n결과: f₂^(p⁶-1)(p²+1) = 유니타리 원소.' },
  { label: 'Hard Part: f₂^((p⁴-p²+1)/r)', body: '지수 ≈ 761 bits (BN254).\n\nu = 4965661367071055426 (BN 파라미터)\n\n분해: addition chain 사용:\n  a = f₂^u, b = a^u, c = b · conj(a)\n  ... (약 12단계 Fp12 곱셈 + Frobenius)\n\n최종: e(P,Q) ∈ GT ⊂ Fp12*  // r차 부분군.' },
];

export default function FinalExpViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.ml}>Miller Loop 결과</text>
              {['f = miller_loop(P, Q)  // ∈ Fp12',
                'f = (c0, c1),  ci ∈ Fp6', '',
                '전체 지수: (p¹² − 1) / r',
                '= (p⁶−1) · (p²+1) · (p⁴−p²+1)/r',
                '// 3단계로 분해'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.ml}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.e1}>Easy Part 1: f^(p⁶-1)</text>
              {['p⁶승 = conjugate: (c0, c1) → (c0, -c1)',
                'f₁ = conjugate(f) · f⁻¹', '',
                '// f⁻¹: Fp6 역원 1회',
                '// 총: inv + mul = 2 연산',
                '결과: f₁^(p⁶) = f₁⁻¹ (유니타리)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.e1}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.e2}>Easy Part 2: f₁^(p²+1)</text>
              {['f₂ = frobenius_sq(f₁) · f₁', '',
                'frobenius²: 각 Fp2 계수에 상수 곱',
                '// 6개 Fp2 원소의 계수 보정',
                '// 비용: Fp mul ~6회 → "무료급"',
                '결과: 유니타리 원소 획득'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.e2}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.hard}>Hard Part: (p⁴-p²+1)/r</text>
              {['u = 4965661367071055426  // BN param', '',
                'a = f₂^u         // square-and-multiply',
                'b = a^u          // 같은 방법',
                'c = b · conj(a)  // Fp12 곱셈', '',
                '... (addition chain ~12단계)',
                '→ e(P,Q) ∈ GT ⊂ Fp12*'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.hard}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
