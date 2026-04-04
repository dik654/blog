import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { TOKENS, BEFORE, MASKED, SOFTMAX, STEPS, COLORS } from '../MaskedAttentionData';

const C = 36, X0 = 60, Y0 = 24;

export default function MaskedAttentionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const data = step === 0 ? BEFORE : step === 1 ? MASKED : SOFTMAX;
        const color = step === 0 ? COLORS.normal : step === 1 ? COLORS.masked : COLORS.result;
        const label = step === 0 ? 'Scaled Scores' : step === 1 ? 'Masked (-∞)' : 'Softmax 결과';

        return (
          <svg viewBox="0 0 500 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <text x={X0 + (3 * C) / 2} y={Y0 - 8} textAnchor="middle"
              fontSize={9} fontWeight={600} fill={color}>{label}</text>

            {/* Column headers */}
            {TOKENS.map((t, i) => (
              <text key={`c${i}`} x={X0 + i * C + C / 2} y={Y0} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{t}</text>
            ))}
            {/* Row headers */}
            {TOKENS.map((t, i) => (
              <text key={`r${i}`} x={X0 - 6} y={Y0 + 8 + i * C + C / 2} textAnchor="end"
                fontSize={9} fill="var(--muted-foreground)">{t}</text>
            ))}

            {/* Matrix cells */}
            {data.map((row, r) => row.map((v, c) => {
              const isMasked = step >= 1 && r < c;
              const isZero = step === 2 && r < c;
              const cellColor = isMasked ? COLORS.masked : color;
              const val = typeof v === 'number' ? v.toFixed(2) : v;

              return (
                <motion.g key={`${r}${c}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: (r * 3 + c) * 0.04 }}>
                  <rect x={X0 + c * C} y={Y0 + 4 + r * C} width={C - 2} height={C - 2} rx={3}
                    fill={isMasked ? `${COLORS.masked}15` : `${cellColor}12`}
                    stroke={cellColor} strokeWidth={isMasked ? 1.2 : 0.6} />
                  <text x={X0 + c * C + C / 2 - 1} y={Y0 + 4 + r * C + C / 2 + 1}
                    textAnchor="middle" fontSize={isZero ? 8 : 7} fontWeight={isMasked ? 600 : 400}
                    fill={isMasked ? COLORS.masked : 'var(--foreground)'}>
                    {val}
                  </text>
                </motion.g>
              );
            }))}

            {/* Mask overlay pattern for step 1 */}
            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={280} y={Y0 + 30} fontSize={9} fontWeight={600} fill={COLORS.masked}>
                  상삼각 = 미래 토큰
                </text>
                <text x={280} y={Y0 + 44} fontSize={9} fill="var(--muted-foreground)">
                  -∞ 값 → softmax 후 0
                </text>
                <text x={280} y={Y0 + 58} fontSize={9} fill="var(--muted-foreground)">
                  자기회귀: 이전 토큰만 참조
                </text>
              </motion.g>
            )}

            {/* Result explanation */}
            {step === 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={280} y={Y0 + 30} fontSize={9} fontWeight={600} fill={COLORS.result}>
                  "나는" → 자기만 참조 (1.00)
                </text>
                <text x={280} y={Y0 + 44} fontSize={9} fill="var(--muted-foreground)">
                  "학생" → "나는"+"학생" 참조
                </text>
                <text x={280} y={Y0 + 58} fontSize={9} fill="var(--muted-foreground)">
                  "이다" → 모든 토큰 참조
                </text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
