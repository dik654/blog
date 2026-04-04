import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { r1cs: '#6366f1', ifft: '#10b981', qap: '#f59e0b', van: '#8b5cf6', h: '#ec4899' };

const STEPS = [
  { label: 'R1CS 매트릭스 구성', body: '예: x² = y, 변수 w = [1, x, y]\nA = [[0, 1, 0]]    // x 위치\nB = [[0, 1, 0]]    // x 위치\nC = [[0, 0, 1]]    // y 위치\n검증: A·w ⊙ B·w = C·w → x·x = y ✓' },
  { label: 'IFFT → 계수 다항식 복원', body: 'ω = primitive_root(1) = 1  (제약 1개)\naⱼ(x) = IFFT([A[0][j]])  → 상수 다항식\n\na₁(x) = 1  (변수 x의 계수)\nb₁(x) = 1\nc₂(x) = 1  (변수 y의 계수)' },
  { label: 'QAP 다항식 조합', body: 'A(x) = Σ wⱼ·aⱼ(x) = 1·0 + x·1 + y·0 = x\nB(x) = Σ wⱼ·bⱼ(x) = x\nC(x) = Σ wⱼ·cⱼ(x) = y\n\nA(x)·B(x) - C(x) = x² - y' },
  { label: 'Vanishing Polynomial t(x)', body: 't(x) = xᵐ - 1  (m = 제약 수)\nt(x) = x - 1  (m=1일 때)\n\nR1CS 만족 ⟺ t(x) | A·B-C\n즉, 모든 단위근에서 A·B-C = 0.' },
  { label: 'h(x) = (A·B - C) / t(x)', body: 'A·B-C = x² - y\nt(x) = x - 1\nh(x) = (x² - y)/(x - 1)  // x=3, y=9일 때\n     = (x² - 9)/(x - 1) = (x+3)(x-3)/(x-1)\n\n코셋 FFT: IFFT → coset_eval → 점별÷ → IFFT' },
];

export default function R1CStoQAPViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r1cs}>R1CS 매트릭스</text>
              {['// x² = y,  w = [1, x, y]',
                'A = [[0, 1, 0]]  // 제약 0: x 계수',
                'B = [[0, 1, 0]]  // 제약 0: x 계수',
                'C = [[0, 0, 1]]  // 제약 0: y 계수', '',
                'A·w ⊙ B·w = C·w',
                '[x] ⊙ [x]  = [y]  → x·x = y ✓'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r1cs}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.ifft}>IFFT 보간</text>
              {['domain = {ω⁰} = {1}  // 제약 1개',
                'a₀(x)=0, a₁(x)=1, a₂(x)=0  // A 열별',
                'b₀(x)=0, b₁(x)=1, b₂(x)=0  // B 열별',
                'c₀(x)=0, c₁(x)=0, c₂(x)=1  // C 열별', '',
                '// m>1이면 Lagrange 보간 다항식'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.ifft}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.qap}>QAP 조합</text>
              {['A(x) = w₀·a₀ + w₁·a₁ + w₂·a₂',
                '     = 1·0 + x·1 + y·0 = x',
                'B(x) = x,  C(x) = y', '',
                'A·B - C = x·x - y = x² - y',
                '// w 만족 시 모든 단위근에서 0'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.qap}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.van}>Vanishing Polynomial</text>
              {['t(x) = x^m - 1  // m = 제약 수',
                't(x) = x - 1    // (m=1)', '',
                't(ω⁰) = t(1) = 1-1 = 0 ✓',
                '모든 단위근에서 t = 0', '',
                'R1CS OK ⟺ t(x) | (A·B - C)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.van}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.h}>h(x) 몫 계산</text>
              {['h(x) = (A·B - C) / t(x)',
                '     = (x² - y) / (x - 1)', '',
                '// x=3, y=9 대입:',
                'h(x) = (x² - 9)/(x - 1)',
                '// 코셋 FFT로 O(n log n) 계산'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.h}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
