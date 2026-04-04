import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { u1: '#a855f7', u2: '#3b82f6', t: '#f59e0b', fold: '#6366f1', aug: '#14b8a6' };

const STEPS = [
  { label: 'NIFS 입력: 두 R1CS 인스턴스', body: 'U₁ = (comm_W₁, comm_E₁, u₁, x₁)  // Relaxed\nU₂ = (comm_W₂, E₂=0, u₂=1, x₂)   // Fresh\nW₁ = witness₁, W₂ = witness₂\n\nRelaxed R1CS: A·W ⊙ B·W = u·C·W + E' },
  { label: '교차항 T 계산', body: 'T = A·W₁ ⊙ B·W₂ + A·W₂ ⊙ B·W₁\n  − u₁·C·W₂ − u₂·C·W₁\n\n// 두 인스턴스 사이의 교차 다항식.\n// 폴딩 후에도 Relaxed R1CS가 성립하게 함.' },
  { label: 'comm_T + 챌린지 r', body: 'comm_T = Pedersen.commit(T, r_blind)\ntranscript.absorb(comm_T)\nr ← transcript.squeeze()\n\n// r: Verifier가 재현 가능한 랜덤 스칼라.' },
  { label: '선형 폴딩: U\' = U₁ + r·U₂', body: 'comm_W\' = comm_W₁ + r · comm_W₂\ncomm_E\' = comm_E₁ + r · comm_T + r² · comm_E₂\nu\' = u₁ + r · u₂\nx\' = x₁ + r · x₂\n\nW\' = W₁ + r · W₂  (증명자만 보유)' },
  { label: 'Augmented Circuit 검증', body: 'E\' = E₁ + r · T + r² · E₂\ncheck: A·W\' ⊙ B·W\' == u\'·C·W\' + E\'\n\n// 재귀: F_aug(i) = "F(z) + NIFS.verify"\n// i단계 후 하나의 Relaxed R1CS로 축적.' },
];

export default function NIFSArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.u1}>NIFS 입력</text>
              {['U₁ = (comm_W₁, comm_E₁, u₁, x₁)  // Relaxed',
                'U₂ = (comm_W₂, E₂=0, u₂=1, x₂)   // Fresh', '',
                'Relaxed R1CS:',
                '  A·W ⊙ B·W = u·C·W + E',
                '  (u=1, E=0 이면 표준 R1CS)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={i < 2 ? C.u1 : C.u2}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.t}>교차항 T</text>
              {['T = A·W₁ ⊙ B·W₂ + A·W₂ ⊙ B·W₁',
                '  − u₁·C·W₂ − u₂·C·W₁', '',
                '// 교차 다항식: 폴딩 보정 항',
                '// T ∈ Fⁿ (n = 제약 수)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.t}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill="#ec4899">커밋 + 챌린지</text>
              {['comm_T = Pedersen(T, r_blind)',
                'transcript.absorb(comm_T)',
                'r ← transcript.squeeze()', '',
                '// Fiat-Shamir: 비대화형 변환'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill="#ec4899">{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.fold}>선형 폴딩</text>
              {['comm_W\' = comm_W₁ + r·comm_W₂',
                'comm_E\' = comm_E₁ + r·comm_T + r²·comm_E₂',
                'u\' = u₁ + r·u₂',
                'x\' = x₁ + r·x₂', '',
                'W\' = W₁ + r·W₂  // 증명자만 보유'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.fold}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.aug}>Augmented Circuit</text>
              {['E\' = E₁ + r·T + r²·E₂',
                'check: A·W\' ⊙ B·W\' == u\'·C·W\' + E\'', '',
                '// IVC: F_aug(i) = F(z) + NIFS.verify',
                '// n 단계 → 하나의 Relaxed R1CS'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.aug}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
