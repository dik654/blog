import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { root: '#6366f1', hi: '#10b981' };

// F₁₇에서 ω=2 (2^8=256 mod 17=1, order 8)
// 2^0=1, 2^1=2, 2^2=4, 2^3=8, 2^4=16, 2^5=15, 2^6=13, 2^7=9
const ROOTS = [1, 2, 4, 8, 16, 15, 13, 9];

const STEPS = [
  { label: 'F₁₇에서 8차 단위근 ω=2', body: '2⁸ = 256 mod 17 = 1 → ω=2는 8차 단위근.\n2ᵏ (k < 8) 은 모두 ≠ 1.\n이 8개 값 {1,2,4,8,16,15,13,9}이 NTT의 평가점.' },
  { label: 'ω⁴ = 16 ≡ -1 (mod 17)', body: '8차 단위근의 절반(4승)이 -1이 된다.\n이 성질 덕분에 짝수/홀수 항을 분리할 수 있고,\n문제를 반씩 나누는 분할 정복이 가능해진다.' },
  { label: '재귀 분할: 8 → 4 → 2 → 1', body: 'n=8인 NTT를 n=4 두 개로 분할.\nn=4를 n=2 두 개로 분할.\nlog₂(8) = 3단계 × n번 연산 = O(n log n).' },
];

const CW = 48, EY = 20;

export default function UnitRootViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Root values */}
          {ROOTS.map((v, i) => {
            const isHalf = step === 1 && i === 4;
            return (
              <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <rect x={12 + i * CW + 2} y={EY} width={CW - 4} height={36} rx={4}
                  fill={isHalf ? `${C.hi}20` : `${C.root}10`}
                  stroke={isHalf ? C.hi : C.root}
                  strokeWidth={isHalf ? 1.5 : 0.5} />
                <text x={12 + i * CW + CW / 2} y={EY + 14} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">ω{['⁰','¹','²','³','⁴','⁵','⁶','⁷'][i]}</text>
                <text x={12 + i * CW + CW / 2} y={EY + 32} textAnchor="middle"
                  fontSize={11} fontWeight={isHalf ? 600 : 400}
                  fill={isHalf ? C.hi : C.root}>{v}</text>
              </motion.g>
            );
          })}
          {/* Step 1: highlight ω⁴ = -1 */}
          {step === 1 && (
            <motion.text x={12 + 4 * CW + CW / 2} y={EY + 52} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={C.hi}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              = -1 (mod 17)
            </motion.text>
          )}
          {/* Step 2: split visualization */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <rect x={30} y={EY + 60} width={180} height={22} rx={4}
                fill={`${C.root}10`} stroke={C.root} strokeWidth={0.6} />
              <text x={120} y={EY + 75} textAnchor="middle" fontSize={9} fill={C.root}>
                n=8 → 짝수{'{'}ω⁰,²,⁴,⁶{'}'} + 홀수{'{'}ω¹,³,⁵,⁷{'}'}
              </text>
              <text x={230} y={EY + 75} fontSize={9} fill="var(--muted-foreground)">→</text>
              <rect x={250} y={EY + 60} width={100} height={22} rx={4}
                fill={`${C.hi}10`} stroke={C.hi} strokeWidth={0.6} />
              <text x={300} y={EY + 75} textAnchor="middle" fontSize={9} fill={C.hi}>
                각각 n=4 NTT
              </text>
              <text x={230} y={EY + 100} textAnchor="middle" fontSize={10} fontWeight={500} fill={C.hi}>
                log₂(8) = 3단계 × 8 = 24 연산 (vs 64)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
