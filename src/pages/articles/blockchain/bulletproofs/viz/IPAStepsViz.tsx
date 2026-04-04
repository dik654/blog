import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { in: '#6366f1', cm: '#8b5cf6', ch: '#f59e0b', fold: '#10b981', lr: '#ec4899', done: '#ef4444' };

const STEPS = [
  { label: '입력 벡터 a, b (n차원)', body: 'a = [a₀, a₁, ..., aₙ₋₁],  b = [b₀, b₁, ..., bₙ₋₁]\nc = <a, b> = Σ aᵢ·bᵢ\n예: a = [3, 7], b = [2, 5]\nc = 3·2 + 7·5 = 6 + 35 = 41' },
  { label: 'Pedersen 벡터 커밋먼트 P', body: 'G = [G₀, G₁, ..., Gₙ₋₁]  // 기저점 벡터\nH = [H₀, H₁, ..., Hₙ₋₁]\nP = <a, G> + <b, H> + c·U\n  = a₀G₀ + a₁G₁ + ... + b₀H₀ + b₁H₁ + ... + c·U' },
  { label: 'Fiat-Shamir 챌린지 u', body: 'transcript.append(P)\nu ← FS(transcript)  // Merlin transcript\n\nu는 접기 방향을 결정하는 랜덤 스칼라.\nVerifier도 동일한 u를 재현 가능.' },
  { label: '접기: n → n/2 (L, R 계산)', body: 'aₗ = a[0..n/2], aᵣ = a[n/2..n]\nL = <aₗ, Gᵣ> + <bᵣ, Hₗ> + <aₗ,bᵣ>·U\nR = <aᵣ, Gₗ> + <bₗ, Hᵣ> + <aᵣ,bₗ>·U\na\' = aₗ·u + aᵣ·u⁻¹   // n/2 차원\nb\' = bₗ·u⁻¹ + bᵣ·u    // n/2 차원' },
  { label: '재귀 반복 (log₂n 라운드)', body: 'n=64 → 6라운드:\n  64 → 32 → 16 → 8 → 4 → 2 → 1\n매 라운드 (Lᵢ, Rᵢ) 쌍 누적.\n최종: 스칼라 a\', b\' 1개씩 남음.' },
  { label: '최종 검증: a\'·b\' = c', body: '검증자: 모든 Lᵢ, Rᵢ, uᵢ로 P\' 재구성:\nP\' = Σ uᵢ²·Lᵢ + P + Σ uᵢ⁻²·Rᵢ\na\'·b\' == c 확인 + P\' == a\'·G\'+b\'·H\'+c·U\n\n증명 크기: 2·log₂(n) 점 + 2 스칼라' },
];

export default function IPAStepsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.in}>입력 벡터</text>
              {['a = [a₀, a₁, ..., aₙ₋₁]',
                'b = [b₀, b₁, ..., bₙ₋₁]',
                'c = <a,b> = Σ aᵢ·bᵢ', '',
                '예: a=[3,7], b=[2,5]',
                'c = 3·2 + 7·5 = 41'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.in}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.cm}>벡터 커밋먼트 P</text>
              {['G = [G₀, G₁, ...], H = [H₀, H₁, ...]',
                'P = <a,G> + <b,H> + c·U',
                '  = a₀G₀ + a₁G₁ + ...',
                '  + b₀H₀ + b₁H₁ + ...',
                '  + c·U'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.cm}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.ch}>FS 챌린지</text>
              {['transcript.append(P)',
                'u ← FS(transcript)', '',
                '// u: 접기 방향 결정',
                '// Verifier도 동일하게 재현'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.ch}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.fold}>벡터 접기</text>
              {['L = <aₗ,Gᵣ> + <bᵣ,Hₗ> + <aₗ,bᵣ>·U',
                'R = <aᵣ,Gₗ> + <bₗ,Hᵣ> + <aᵣ,bₗ>·U', '',
                'a\' = aₗ·u + aᵣ·u⁻¹   // n/2 벡터',
                'b\' = bₗ·u⁻¹ + bᵣ·u'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.fold}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.lr}>재귀 (log n 라운드)</text>
              {['n=64 → log₂(64) = 6 라운드',
                '64→32→16→8→4→2→1', '',
                '매 라운드: (Lᵢ, Rᵢ) 쌍 생성',
                '최종: 스칼라 a\', b\' 1개씩'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.lr}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.done}>최종 검증</text>
              {['P\' = Σ uᵢ²·Lᵢ + P + Σ uᵢ⁻²·Rᵢ',
                'check: a\'·b\' == c', '',
                'check: P\' == a\'·G\'+b\'·H\'+c·U', '',
                '증명 크기: 2·log₂(n) 점 + 2 스칼라'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.done}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
