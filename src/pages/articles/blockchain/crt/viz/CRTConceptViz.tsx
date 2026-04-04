import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { a: '#6366f1', b: '#f59e0b', ok: '#10b981' };

const STEPS = [
  { label: 'CRT 문제 정의', body: '연립 합동식:\n  x ≡ 2 (mod 3)\n  x ≡ 3 (mod 5)\n\ngcd(3, 5) = 1 (서로소) → 유일한 해 존재.\nN = 3 × 5 = 15, 해의 범위: 0 ≤ x < 15.' },
  { label: '① 역원 계산', body: 'N₁ = N/n₁ = 15/3 = 5\nN₂ = N/n₂ = 15/5 = 3\n\ny₁ = N₁⁻¹ mod n₁ = 5⁻¹ mod 3\n   5 mod 3 = 2,  2⁻¹ mod 3 = 2  (2·2=4≡1)\n   → y₁ = 2\n\ny₂ = N₂⁻¹ mod n₂ = 3⁻¹ mod 5\n   3⁻¹ mod 5 = 2  (3·2=6≡1)\n   → y₂ = 2' },
  { label: '② 부분 해 합산', body: 'x = a₁·N₁·y₁ + a₂·N₂·y₂  (mod N)\n  = 2·5·2 + 3·3·2\n  = 20 + 18\n  = 38\n  = 38 mod 15 = 8\n\n검증: 8 mod 3 = 2 ✓,  8 mod 5 = 3 ✓' },
  { label: '③ 일반화: k개 모듈러스', body: '모듈러스 n₁, n₂, ..., nₖ (쌍별 서로소)\nN = n₁·n₂·...·nₖ\nNᵢ = N / nᵢ\nyᵢ = Nᵢ⁻¹ mod nᵢ\n\nx = Σ aᵢ · Nᵢ · yᵢ  (mod N)\n// RSA: N=p·q 기반 CRT 복호화 가속.' },
];

export default function CRTConceptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.a}>CRT 문제</text>
              {['x ≡ 2 (mod 3)',
                'x ≡ 3 (mod 5)', '',
                'gcd(3, 5) = 1 → 유일해 존재',
                'N = 3 × 5 = 15',
                '해 범위: 0 ≤ x < 15'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.a}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.b}>역원 계산</text>
              {['N₁ = 15/3 = 5,  N₂ = 15/5 = 3',
                'y₁ = 5⁻¹ mod 3 = 2  (2·5=10≡1 mod3)',
                'y₂ = 3⁻¹ mod 5 = 2  (2·3=6≡1 mod5)', '',
                '// 확장 유클리드 알고리즘으로 계산',
                '// 또는 modpow(Nᵢ, nᵢ-2, nᵢ)'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.b}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.ok}>합산</text>
              {['x = a₁·N₁·y₁ + a₂·N₂·y₂  mod N',
                '  = 2·5·2 + 3·3·2',
                '  = 20 + 18 = 38',
                '  = 38 mod 15 = 8', '',
                '검증: 8 mod 3 = 2 ✓, 8 mod 5 = 3 ✓'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.ok}>{t}</text>
              ))}
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.a}>일반화</text>
              {['n₁, n₂, ..., nₖ  (쌍별 서로소)',
                'N = Π nᵢ',
                'Nᵢ = N/nᵢ,  yᵢ = Nᵢ⁻¹ mod nᵢ', '',
                'x = Σ aᵢ·Nᵢ·yᵢ  (mod N)', '',
                '// RSA CRT: N=pq → 4× 복호화 가속'].map((t, i) => (
                <text key={i} x={20} y={38 + i * 16} fontSize={10} fontFamily="monospace"
                  fill={C.a}>{t}</text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
