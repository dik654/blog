import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];
const STEPS = [
  { label: 'Excess Blob Gas 누적', body: 'excess = parentExcess + parentUsed - target. target보다 많이 쓰면 excess 증가.' },
  { label: '지수 가격 곡선: e^(excess/K)', body: 'excess가 커질수록 가격이 지수적으로 상승한다. K = UPDATE_FRACTION = 5,314,649.' },
  { label: '테일러 급수로 정수 근사', body: 'e^x = 1 + x/1! + x²/2! + ... 을 정수 산술로 반복 계산한다.' },
  { label: 'fakeExponential 수렴 과정', body: 'accum = accum × num / (denom × i). accum이 0이 될 때까지 합산하면 결과가 수렴한다.' },
];

/** excess → 가격 곡선 좌표 */
const CURVE: [number, number][] = [
  [0, 170], [60, 168], [120, 160], [180, 140], [240, 105], [300, 55], [360, 22],
];
const curvePath = CURVE.map(([x, y], i) =>
  `${i === 0 ? 'M' : 'L'}${x + 80},${y}`).join(' ');

export default function BlobGasMathViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Axes */}
          <line x1={78} y1={175} x2={460} y2={175} stroke="var(--border)" strokeWidth={1} />
          <line x1={78} y1={175} x2={78} y2={18} stroke="var(--border)" strokeWidth={1} />
          <text x={270} y={196} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">excess blob gas →</text>
          <text x={56} y={100} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)" transform="rotate(-90,56,100)">price (wei)</text>

          {/* Step 0: target line */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: step >= 0 ? 1 : 0 }}>
            <line x1={200} y1={18} x2={200} y2={175}
              stroke={C[3]} strokeWidth={1} strokeDasharray="4 3" />
            <text x={200} y={14} textAnchor="middle" fontSize={10}
              fontWeight={600} fill={C[3]}>target (3 blobs)</text>
          </motion.g>

          {/* Step 1: Price curve */}
          {step >= 1 && (
            <motion.path d={curvePath} fill="none" stroke={C[0]} strokeWidth={2}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }} />
          )}

          {/* Price labels on curve */}
          {step >= 1 && CURVE.filter((_, i) => i % 2 === 0).map(([x, y], i) => (
            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15 }}>
              <circle cx={x + 80} cy={y} r={3} fill={C[0]} />
              <text x={x + 80} y={y - 8} textAnchor="middle" fontSize={10}
                fill={C[0]}>{'×e' + '\u2070\u00B9\u00B2\u00B3'[i]}</text>
            </motion.g>
          ))}

          {/* Step 2: Taylor series boxes */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              {['1', 'x/1!', 'x²/2!', 'x³/3!', '...'].map((t, i) => (
                <g key={i}>
                  <rect x={90 + i * 72} y={32} width={60} height={22} rx={4}
                    fill={`${C[1]}15`} stroke={C[1]} strokeWidth={1} />
                  <text x={120 + i * 72} y={46} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={C[1]}>{t}</text>
                  {i < 4 && (
                    <text x={156 + i * 72} y={46} textAnchor="middle" fontSize={12}
                      fill={C[1]}>+</text>
                  )}
                </g>
              ))}
              <text x={270} y={68} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">테일러 급수: 정수로 근사 계산</text>
            </motion.g>
          )}

          {/* Step 3: fakeExponential convergence */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[1, 2, 3, 4, 5].map((i) => {
                const w = 300 - i * 50;
                return (
                  <rect key={i} x={270 - w / 2} y={80 + i * 14} width={w} height={10} rx={2}
                    fill={`${C[2]}${Math.round(20 + i * 12).toString(16)}`}
                    stroke={C[2]} strokeWidth={0.5} />
                );
              })}
              <text x={270} y={164} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C[2]}>accum이 0에 수렴 → 합산 종료</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
