import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { srs: '#6366f1', cm: '#10b981', open: '#f59e0b', vfy: '#8b5cf6' };

const STEPS = [
  { label: '① Universal Setup — SRS', body: 'τ ← Fr (비밀)\nSRS = {[1]₁, [τ]₁, [τ²]₁, ..., [τᵈ]₁,  [τ]₂}\n= {G₁, τ·G₁, τ²·G₁, ..., τᵈ·G₁,  τ·G₂}\n// 1회 생성, 모든 deg≤d 다항식에 재사용.' },
  { label: '② Commit — f(x) → G1 점', body: 'f(x) = a₀ + a₁x + a₂x² + ... + aₙxⁿ\n[f]₁ = a₀·[1]₁ + a₁·[τ]₁ + a₂·[τ²]₁ + ...\n     = [f(τ)]₁  // τ를 모르지만 결과는 계산 가능\n     = G1Affine  → 64 bytes (x, y 좌표).' },
  { label: '③ Open at z — 인수정리', body: '주장: f(z) = y\nq(x) = (f(x) − y) / (x − z)  // 인수정리\n[q]₁ = KZG.commit(q)\n\nf(z) = y ⟺ (x-z) | (f(x)-y)\n즉, q(x) 존재 ⟺ f(z)=y 참.' },
  { label: '④ Verify — 페어링 2회', body: 'e([f]₁ − y·G₁,  G₂) == e([q]₁,  [τ]₂ − z·G₂)\n\nLHS: e([f(τ)−y]₁,  G₂) = e(f(τ)-y, 1)_T\nRHS: e([q(τ)]₁, [τ−z]₂) = e(q(τ), τ-z)_T\n\nf(τ)-y = q(τ)·(τ-z) ⟺ 등식 성립.' },
];

export default function KZGCommitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.srs}>Universal SRS</text>
              {['τ ← rand(Fr)   // 비밀 평가점',
                'SRS_G1 = [G₁, τ·G₁, τ²·G₁, ..., τᵈ·G₁]',
                'SRS_G2 = [G₂, τ·G₂]', '',
                '// d = 최대 다항식 차수',
                '// τ 삭제 후 재사용 가능 (universal)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.srs}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.cm}>Commit (MSM)</text>
              {['f(x) = a₀ + a₁x + ... + aₙxⁿ',
                '[f]₁ = a₀·G₁ + a₁·[τ]₁ + ... + aₙ·[τⁿ]₁',
                '     = [f(τ)]₁   // G1 점 1개', '',
                '// MSM으로 계산: O(n / log n)',
                '// 출력: G1Affine (x,y) = 64 bytes'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.cm}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.open}>Open (인수정리)</text>
              {['주장: f(z) = y',
                'q(x) = (f(x) - y) / (x - z)', '',
                '인수정리: (x-z) | (f(x)-y)',
                '  ⟺ f(z) = y', '',
                '[q]₁ = KZG.commit(q) → 전송'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.open}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.vfy}>Verify (Pairing)</text>
              {['e([f]₁ − y·G₁, G₂)',
                '  == e([q]₁, [τ]₂ − z·G₂) ?', '',
                '등가: f(τ)−y == q(τ)·(τ−z)', '',
                '// 페어링 2회, 회로 크기 무관 O(1)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.vfy}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
