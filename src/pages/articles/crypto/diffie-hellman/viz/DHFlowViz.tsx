import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { a: '#6366f1', b: '#10b981', k: '#f59e0b', bad: '#ef4444' };

const STEPS = [
  { label: '공개 파라미터 공유', body: 'p = 23 (소수), g = 5 (생성원)\n5의 거듭제곱이 {1,...,22}를 전부 순회 → 생성원 조건 충족.\n도청자도 p, g를 알 수 있지만 DLP 때문에 안전.' },
  { label: '① 비밀 선택 + 공개 값 계산', body: 'Alice: a = 6 (비밀), A = gᵃ mod p\n  A = 5⁶ mod 23 = 15625 mod 23 = 8\n\nBob: b = 15 (비밀), B = gᵇ mod p\n  B = 5¹⁵ mod 23 = modpow(5,15,23) = 19' },
  { label: '② 공개 값 교환', body: 'Alice → Bob: A = 8\nBob → Alice: B = 19\n\n도청자: A=8, B=19를 관측하지만\na, b를 구하려면 DLP를 풀어야 함.' },
  { label: '③ 공유 키 계산', body: 'Alice: K = Bᵃ mod p = 19⁶ mod 23\n  = modpow(19, 6, 23) = 2\n\nBob: K = Aᵇ mod p = 8¹⁵ mod 23\n  = modpow(8, 15, 23) = 2\n\n같은 키! gᵃᵇ = 5⁹⁰ mod 23 = 2' },
  { label: '도청자의 한계', body: '도청자가 아는 것: p=23, g=5, A=8, B=19\nK = gᵃᵇ를 구하려면:\n  8 = 5ᵃ mod 23 → a = ?  (DLP)\n  |Fp*| = 22 → BSGS: O(√22) ≈ 5번\n  |Fp*| = 2²⁵⁶ → O(2¹²⁸) 연산: 불가능.' },
];

export default function DHFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill="var(--foreground)">공개 파라미터</text>
              {['p = 23   // 소수',
                'g = 5    // 생성원 (원시근)', '',
                '검증: ord(5) = p-1 = 22',
                '5¹ = 5, 5² = 2, ..., 5²² = 1 mod 23',
                '{1,...,22} 전부 순회 ✓'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill="var(--foreground)">{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.a}>Alice</text>
              {['a = 6       // 비밀키',
                'A = 5⁶ mod 23',
                '  = 15625 mod 23 = 8'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.a}>{t}</text>
              ))}
              <text x={260} y={18} fontSize={10} fontWeight={600} fill={C.b}>Bob</text>
              {['b = 15      // 비밀키',
                'B = 5¹⁵ mod 23',
                '  = modpow(5,15,23) = 19'].map((t, i) => (
                <text key={i} x={260} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.b}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill="var(--foreground)">공개 값 교환</text>
              {['Alice → Bob:  A = 8',
                'Bob → Alice:  B = 19', '',
                '도청자 관측: A=8, B=19, p=23, g=5',
                'a = log₅(8) mod 23 = ???  (DLP)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={i < 2 ? C.k : C.bad}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.k}>공유 키 계산</text>
              {['Alice: K = B^a mod p',
                '  = 19⁶ mod 23 = 2', '',
                'Bob:   K = A^b mod p',
                '  = 8¹⁵ mod 23 = 2', '',
                '같은 키! g^(ab) = 5⁹⁰ mod 23 = 2'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.k}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.bad}>도청자의 한계</text>
              {['Known: p=23, g=5, A=8, B=19',
                'Need: a = log_g(A) mod p-1', '',
                '|Fp*| = 22 → BSGS O(√22) ≈ 5번',
                '|Fp*| = 2²⁵⁶ → O(2¹²⁸) → 불가능', '',
                '// CDH 가정: g^ab 계산 어려움'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.bad}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
