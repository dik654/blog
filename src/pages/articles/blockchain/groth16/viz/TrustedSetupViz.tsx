import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { tau: '#6366f1', srs: '#10b981', del: '#ef4444' };

const STEPS = [
  { label: '비밀 파라미터 랜덤 샘플링', body: 'τ, α, β, γ, δ ← Fr 에서 무작위 추출. MPC 세레모니로 1-of-N 신뢰 보장.' },
  { label: 'τ 거듭제곱 → SRS 계산', body: '[τ⁰]₁ = G₁, [τ¹]₁ = τ·G₁, [τ²]₁ = τ²·G₁, ...\n스칼라 곱 d+1 회. BN254 기준 G₁ = (1, 2).' },
  { label: 'α, β로 구조 태그 결합', body: '[α]₁ = α·G₁,  [β]₂ = β·G₂\nA·α + B·β 형태로 witness 구조를 강제.\n α·β 결합 없이는 A,B 따로 위조 가능.' },
  { label: 'γ, δ로 공개/비공개 분리', body: 'public IC:  Σ sⱼ·(β·aⱼ(τ)+α·bⱼ(τ)+cⱼ(τ)) / γ · G₁\nprivate L:  같은 식 / δ · G₁\nγ≠δ 이므로 public↔private 교차 불가.' },
  { label: 'Toxic Waste 즉시 삭제', body: 'τ = 0x00..00 (덮어쓰기). α, β, γ, δ도 동일.\n하나라도 노출 시 proof 위조: A=rδ, B=sδ 형태로 등식 통과.' },
];

export default function TrustedSetupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: sampling */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.3 }} transition={sp}>
            <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.tau}>Fr 샘플링</text>
            {['τ ← rand(Fr)', 'α ← rand(Fr)', 'β ← rand(Fr)', 'γ ← rand(Fr)', 'δ ← rand(Fr)'].map((t, i) => (
              <motion.text key={i} x={20} y={36 + i * 16} fontSize={10} fontFamily="monospace"
                fill={C.tau} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: i * 0.08 }}>{t}</motion.text>
            ))}
          </motion.g>
          {/* Step 1: SRS */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 1 ? 1 : 0.3 }} transition={sp}>
              <text x={240} y={18} fontSize={10} fontWeight={600} fill={C.srs}>SRS 포인트 생성</text>
              {[
                '[τ⁰]₁ = 1·G₁ = G₁',
                '[τ¹]₁ = τ·G₁      // EC 스칼라 곱',
                '[τ²]₁ = τ²·G₁',
                '  ...',
                '[τᵈ]₁ = τᵈ·G₁    // d = 회로 크기',
              ].map((t, i) => (
                <motion.text key={i} x={240} y={36 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.srs} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.08 }}>{t}</motion.text>
              ))}
            </motion.g>
          )}
          {/* Step 2: alpha-beta */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 2 ? 1 : 0.3 }} transition={sp}>
              <text x={20} y={130} fontSize={10} fontWeight={600} fill="#f59e0b">구조 태그</text>
              <text x={20} y={148} fontSize={10} fontFamily="monospace" fill="#f59e0b">
                [α]₁ = α·G₁,   [β]₂ = β·G₂
              </text>
              <text x={20} y={164} fontSize={10} fontFamily="monospace" fill="#f59e0b">
                VK.alpha_beta_gt = e([α]₁, [β]₂)
              </text>
            </motion.g>
          )}
          {/* Step 4: deletion */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={240} y={120} width={220} height={42} rx={5}
                fill={`${C.del}12`} stroke={C.del} strokeWidth={1.2} />
              <text x={350} y={138} textAnchor="middle" fontSize={10} fontFamily="monospace"
                fill={C.del}>memset(toxic, 0x00, 5*32)</text>
              <text x={350} y={154} textAnchor="middle" fontSize={10}
                fill={C.del}>τ=α=β=γ=δ=0  // 복구 불가</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
