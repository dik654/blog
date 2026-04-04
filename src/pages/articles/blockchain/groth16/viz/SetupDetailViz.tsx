import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { toxic: '#ef4444', r1cs: '#6366f1', qap: '#10b981', key: '#f59e0b', mpc: '#8b5cf6' };

const STEPS = [
  { label: 'Toxic Waste 생성', body: 'τ ← Fr*, α ← Fr*, β ← Fr*, γ ← Fr*, δ ← Fr*\n각 값은 BN254 스칼라 필드에서 균일 랜덤 추출.\n|Fr| = 21888...93 (254-bit 소수).' },
  { label: 'SynthesisMode::Setup — R1CS 수집', body: '변수 n개, 제약 m개 카운트.\nA[i][j], B[i][j], C[i][j] 희소 매트릭스 수집.\n값 할당 없이 구조(인덱스+계수)만 기록.' },
  { label: 'IFFT 보간 → QAP 다항식', body: '각 변수 j에 대해:\naⱼ(x) = IFFT([A[0][j], ..., A[m-1][j]])\nbⱼ(x), cⱼ(x) 도 동일.\n평가점 = {ω⁰, ω¹, ..., ωᵐ⁻¹} (m번째 단위근).' },
  { label: 'MSM 배치 → a/b/h/l query', body: 'a_query[j] = Σᵢ aⱼᵢ·[τⁱ]₁    // 각 변수별 MSM\nb_query[j] = Σᵢ bⱼᵢ·[τⁱ]₂\nh_query[i] = [τⁱ/t(τ)]₁\nl_query[j] = (β·aⱼ(τ)+α·bⱼ(τ)+cⱼ(τ))/δ · G₁' },
  { label: 'MPC 세레모니', body: 'Phase1: τ에 대한 Powers of Tau → 범용 SRS.\nPhase2: 회로별 α,β,γ,δ 주입.\nN명 참여, 1명만 정직 → τ 복구 불가.' },
];

export default function SetupDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.toxic}>비밀 샘플링</text>
              {['τ ← uniform(1..r-1)', 'α ← uniform(1..r-1)', 'β ← uniform(1..r-1)',
                'γ ← uniform(1..r-1)', 'δ ← uniform(1..r-1)'].map((t, i) => (
                <motion.text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.toxic} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>{t}</motion.text>
              ))}
              <text x={20} y={128} fontSize={9} fill={C.toxic} opacity={0.6}>
                r = 2188...93 (BN254 스칼라 필드 위수)
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r1cs}>R1CS 매트릭스 수집</text>
              {['// 예: x * x == y 제약', 'A[0] = [0, 1, 0]  // x 계수',
                'B[0] = [0, 1, 0]  // x 계수', 'C[0] = [0, 0, 1]  // y 계수',
                '', '변수: n=3 (1, x, y), 제약: m=1'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r1cs}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.qap}>IFFT 보간</text>
              {['ω = primitive_root(m)  // m번째 단위근',
                'domain = {ω⁰, ω¹, ..., ωᵐ⁻¹}', '',
                'aⱼ(x) = IFFT(A[:,j])  // 열 j 추출',
                'bⱼ(x) = IFFT(B[:,j])',
                'cⱼ(x) = IFFT(C[:,j])'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.qap}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.key}>query 벡터 MSM</text>
              {['a_q[j] = MSM(aⱼ_coeffs, [τⁱ]₁)',
                'b_q[j] = MSM(bⱼ_coeffs, [τⁱ]₂)', '',
                'h_q[i] = [τⁱ·t(τ)⁻¹]₁',
                'l_q[j] = (β·aⱼ(τ)+α·bⱼ(τ)+cⱼ(τ))/δ · G₁'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.key}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.mpc}>MPC 세레모니</text>
              {['// Phase1: Powers of Tau', 'P₁ contributes: τ₁, acc = τ₁',
                'P₂ contributes: τ₂, acc = τ₁·τ₂', '...', 'τ = τ₁·τ₂·...·τₙ',
                '// P₁이 τ₁ 삭제하면 복구 불가'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.mpc}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
