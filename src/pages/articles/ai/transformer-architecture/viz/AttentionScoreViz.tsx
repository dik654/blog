import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { TOKENS, QKT, SCALED, SOFTMAX, OUTPUT, STEPS, COLORS } from '../AttentionScoreData';

const C = 32, X0 = 50, Y0 = 28;

function Matrix3x3({ data, x, y, color, label }: {
  data: number[][]; x: number; y: number; color: string; label: string;
}) {
  return (
    <g>
      <text x={x + (3 * C) / 2} y={y - 6} textAnchor="middle" fontSize={9} fontWeight={600} fill={color}>{label}</text>
      {TOKENS.map((t, i) => (
        <text key={`c${i}`} x={x + i * C + C / 2} y={y + C * 3 + 10} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{t}</text>
      ))}
      {TOKENS.map((t, i) => (
        <text key={`r${i}`} x={x - 4} y={y + i * C + C / 2 + 2} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">{t}</text>
      ))}
      {data.map((row, r) => row.map((v, c) => {
        const hex = Math.round(v * 200).toString(16).padStart(2, '0');
        return (
          <g key={`${r}${c}`}>
            <motion.rect x={x + c * C} y={y + r * C} width={C - 1} height={C - 1} rx={3}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (r * 3 + c) * 0.04 }}
              fill={`${color}${hex}`} stroke={color} strokeWidth={0.8} />
            <motion.text x={x + c * C + C / 2} y={y + r * C + C / 2 + 2}
              textAnchor="middle" fontSize={9} fontWeight={500}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (r * 3 + c) * 0.04 }}
              fill={v > 0.4 ? '#fff' : 'var(--foreground)'}>{v.toFixed(2)}</motion.text>
          </g>
        );
      }))}
    </g>
  );
}

export default function AttentionScoreViz() {
  const matrices = [
    { data: QKT, color: COLORS.qkt, label: 'Q × Kᵀ (3×3)' },
    { data: SCALED, color: COLORS.scale, label: '÷ √6 ≈ 2.449' },
    { data: SOFTMAX, color: COLORS.softmax, label: 'Softmax (행별)' },
  ];

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= 2 && <Matrix3x3 key={step} {...matrices[step]} x={X0} y={Y0} />}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={200} y={Y0 + 20} fontSize={9} fill={COLORS.scale}>√d_k로 나누는 이유:</text>
              <text x={200} y={Y0 + 32} fontSize={9} fill="var(--muted-foreground)">값이 너무 크면 softmax 기울기 → 0</text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={X0 + 48} y={Y0 - 6} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.output}>
                Softmax × V = 셀프어텐션 출력 (3×6)
              </text>
              {TOKENS.map((t, i) => (
                <g key={i}>
                  <text x={X0 - 4} y={Y0 + i * 20 + 12} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">{t}</text>
                  {OUTPUT[i].map((v, j) => (
                    <g key={j}>
                      <rect x={X0 + j * 38} y={Y0 + i * 20} width={36} height={16} rx={2}
                        fill={`${COLORS.output}12`} stroke={COLORS.output} strokeWidth={0.5} />
                      <text x={X0 + j * 38 + 18} y={Y0 + i * 20 + 11} textAnchor="middle" fontSize={9} fill={COLORS.output}>{v.toFixed(2)}</text>
                    </g>
                  ))}
                </g>
              ))}
              <text x={X0 + 114} y={Y0 + 80} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 행 = 문맥이 반영된 토큰 표현
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
