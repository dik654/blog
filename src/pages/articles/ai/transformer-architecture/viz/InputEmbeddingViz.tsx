import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { TOKENS, EMB, PE, INPUT, STEPS, COLORS } from '../InputEmbeddingData';

const CW = 40, CH = 16, X0 = 55, Y0 = 20;

function MatrixBlock({ data, x, y, color, label, show }: {
  data: number[][]; x: number; y: number; color: string; label: string; show: boolean;
}) {
  return (
    <motion.g animate={{ opacity: show ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
      <text x={x + (data[0].length * CW) / 2} y={y - 4} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={color}>{label}</text>
      {data.map((row, r) => row.map((v, c) => (
        <g key={`${r}${c}`}>
          <motion.rect x={x + c * CW} y={y + r * CH} width={CW - 2} height={CH - 2} rx={2}
            animate={{ fill: show ? `${color}12` : `${color}05`, stroke: color,
              strokeWidth: show ? 0.8 : 0.3 }} />
          <text x={x + c * CW + CW / 2 - 1} y={y + r * CH + CH / 2 + 2}
            textAnchor="middle" fontSize={6.5} fill={show ? color : 'var(--muted-foreground)'}>
            {v.toFixed(2)}
          </text>
        </g>
      )))}
      {/* row labels */}
      {TOKENS.map((t, r) => (
        <text key={r} x={x - 4} y={y + r * CH + CH / 2 + 2} textAnchor="end"
          fontSize={9} fill="var(--muted-foreground)">{t}</text>
      ))}
    </motion.g>
  );
}

export default function InputEmbeddingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* 차원 라벨 */}
          <text x={X0 + 3 * CW} y={12} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">d_model = 6</text>

          <MatrixBlock data={EMB} x={X0} y={Y0} color={COLORS.emb}
            label="임베딩 벡터 (3×6)" show={step === 0 || step === 2} />

          {step >= 1 && (
            <>
              <motion.text x={X0 + 3 * CW} y={Y0 + 3 * CH + 14} textAnchor="middle"
                fontSize={12} fill={COLORS.pe} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                +
              </motion.text>
              <MatrixBlock data={PE} x={X0} y={Y0 + 3 * CH + 22} color={COLORS.pe}
                label="위치 인코딩 PE (3×6)" show={step === 1 || step === 2} />
            </>
          )}

          {step >= 2 && (
            <>
              <motion.text x={X0 + 3 * CW} y={Y0 + 6 * CH + 36} textAnchor="middle"
                fontSize={12} fill={COLORS.sum} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                =
              </motion.text>
              <MatrixBlock data={INPUT} x={X0} y={Y0 + 6 * CH + 44} color={COLORS.sum}
                label="최종 입력 (3×6)" show />
            </>
          )}

          {/* 공식 표시 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={320} y={Y0 + 3 * CH + 30} fontSize={9} fill="var(--foreground)">
                PE(pos,2i) = sin(pos / 10000^(2i/d))
              </text>
              <text x={320} y={Y0 + 3 * CH + 42} fontSize={9} fill="var(--foreground)">
                PE(pos,2i+1) = cos(pos / 10000^(2i/d))
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
