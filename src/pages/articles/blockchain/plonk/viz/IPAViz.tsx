import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { init: '#6366f1', r1: '#10b981', r2: '#f59e0b', fin: '#ec4899' };

const STEPS = [
  { label: '초기: 길이 n 벡터', body: 'a = [a₀, ..., aₙ₋₁],  b = [b₀, ..., bₙ₋₁]\nG = [G₀, ..., Gₙ₋₁]  // EC 기저점\nP = <a, G>            // 벡터 커밋먼트\n\n주장: P는 a에 대한 유효한 커밋.\n증명 없이는 a를 복원할 수 없음 (DLog 가정).' },
  { label: 'Round 1: n → n/2', body: 'aₗ = a[0..n/2],  aᵣ = a[n/2..n]\nGₗ = G[0..n/2],  Gᵣ = G[n/2..n]\n\nL = <aₗ, Gᵣ>     // 교차 커밋 (왼×오)\nR = <aᵣ, Gₗ>     // 교차 커밋 (오×왼)\n\nx ← FS(L, R)     // 챌린지\na\' = aₗ·x + aᵣ·x⁻¹   // 접힌 벡터 (n/2)' },
  { label: 'Round 2: n/2 → n/4', body: '동일한 접기를 a\'에 반복 적용:\nL\' = <a\'ₗ, G\'ᵣ>\nR\' = <a\'ᵣ, G\'ₗ>\n\nx\' ← FS(L\', R\')\na\'\' = a\'ₗ·x\' + a\'ᵣ·x\'⁻¹  // n/4\n\n매 라운드: 커밋 2개(L,R) + 벡터 절반.' },
  { label: '최종: 스칼라 1개', body: 'log₂(n) 라운드 후:\n  a_final: 스칼라 1개\n  {L₁,R₁, ..., Lₖ,Rₖ}: 2k 커밋\n\n검증자:\n  P\' = Σ xᵢ²·Lᵢ + P + Σ xᵢ⁻²·Rᵢ\n  G\' = 접힌 기저점\n  check: P\' == a_final · G\'\n\n증명 크기: 2·log(n) G1 + 1 Fr. Setup 불필요.' },
];

export default function IPAViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.init}>초기 벡터</text>
              {['a = [a₀, ..., aₙ₋₁]   // 길이 n',
                'G = [G₀, ..., Gₙ₋₁]   // 기저점',
                'P = <a, G> = Σ aᵢ·Gᵢ  // 커밋', '',
                '주장: P는 a에 대한 커밋',
                '// Trusted Setup 불필요 (IPA 장점)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.init}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r1}>Round 1: n → n/2</text>
              {['aₗ = a[0..n/2], aᵣ = a[n/2..n]',
                'L = <aₗ, Gᵣ>,  R = <aᵣ, Gₗ>', '',
                'x ← FS(L, R)  // 챌린지',
                'a\' = aₗ·x + aᵣ·x⁻¹  // n/2 벡터',
                'G\' = Gₗ·x⁻¹ + Gᵣ·x  // 기저 접기'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r1}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.r2}>Round 2: n/2 → n/4</text>
              {['L\' = <a\'ₗ, G\'ᵣ>',
                'R\' = <a\'ᵣ, G\'ₗ>', '',
                'x\' ← FS(L\', R\')',
                'a\'\' = a\'ₗ·x\' + a\'ᵣ·x\'⁻¹', '',
                '// 매 라운드: L,R 커밋 + 벡터 절반'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.r2}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.fin}>최종 검증</text>
              {['log₂(n) 라운드 후:',
                '  a_final: Fr 스칼라 1개',
                '  {L₁,R₁,...,Lₖ,Rₖ}: 2k 커밋', '',
                'P\' = Σ xᵢ²·Lᵢ + P + Σ xᵢ⁻²·Rᵢ',
                'check: P\' == a_final · G\'',
                '// 증명: 2·log(n) G1 + 1 Fr'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.fin}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
